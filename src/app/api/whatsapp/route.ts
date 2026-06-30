import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { prisma } from '@/lib/prisma'
import { scrapeCompanies } from '@/lib/scraper'
import twilio from 'twilio'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Subscription limits
const PLAN_LIMITS = {
  free: {
    maxCompanies: 50,
    maxScrapesPerMonth: 10,
    features: ['Basic email extraction', 'CSV export (limited)']
  },
  starter: {
    maxCompanies: 200,
    maxScrapesPerMonth: 50,
    features: ['Advanced extraction', 'Unlimited CSV export', 'Email support']
  },
  plus: {
    maxCompanies: Infinity,
    maxScrapesPerMonth: Infinity,
    features: ['Unlimited companies', 'Priority support', 'API access']
  }
}

function isScrapingRequest(message: string): boolean {
  const keywords = [
    'companies', 'company', 'emails', 'leads',
    'find', 'search', 'scrape', 'get me',
    'list of', 'give me', 'show me', 'provide'
  ]
  const lower = message.toLowerCase()
  return keywords.some(k => lower.includes(k))
}

async function sendWhatsAppMessage(to: string, message: string) {
  try {
    await twilioClient.messages.create({
      from: 'whatsapp:+14155238886',
      to: to,
      body: message,
    })
    console.log(`✅ Sent message to ${to}`)
  } catch (error: any) {
    console.error('Error sending message:', error.message)
  }
}

// Get or create user subscription based on phone number
async function getUserSubscription(phoneNumber: string) {
  // Try to find existing subscription by phone (we'll use WhatsApp messages to track)
  const recentMessage = await prisma.whatsAppMessage.findFirst({
    where: { from: phoneNumber },
    orderBy: { createdAt: 'desc' }
  })

  // For now, we'll link phone numbers to subscriptions via a userId pattern
  // In production, you'd want a proper WhatsAppUser table
  
  // Check if subscription exists - using phone as userId for WhatsApp users
  let subscription = await prisma.subscription.findUnique({
    where: { userId: phoneNumber }
  })

  if (!subscription) {
    // Create new free subscription
    subscription = await prisma.subscription.create({
      data: {
        userId: phoneNumber,
        plan: 'free',
        status: 'active'
      }
    })
  }

  return subscription
}

// Check if user has exceeded their plan limits
async function checkSubscriptionLimits(phoneNumber: string, subscription: any) {
  const plan = subscription.plan as keyof typeof PLAN_LIMITS
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free

  // Count scrapes this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const scrapesThisMonth = await prisma.whatsAppMessage.count({
    where: {
      from: phoneNumber,
      createdAt: { gte: startOfMonth },
      status: 'SUCCESS',
      customerMessage: {
        contains: 'companies'
      }
    }
  })

  return {
    allowed: scrapesThisMonth < limits.maxScrapesPerMonth,
    current: scrapesThisMonth,
    limit: limits.maxScrapesPerMonth,
    maxCompanies: limits.maxCompanies
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const incomingMessage = formData.get('Body') as string
    const from = formData.get('From') as string

    console.log(`📩 Message from ${from}: ${incomingMessage}`)

    // Get user subscription
    const subscription = await getUserSubscription(from)
    const limits = await checkSubscriptionLimits(from, subscription)

    let aiReply = ''

    // Check for plan info request
    if (incomingMessage.toLowerCase().includes('plan') || incomingMessage.toLowerCase().includes('subscription')) {
      const plan = subscription.plan.toUpperCase()
      aiReply = `📊 *Your Current Plan: ${plan}*\n\n`
      aiReply += `✅ Scrapes used this month: ${limits.current}/${limits.limit === Infinity ? '∞' : limits.limit}\n`
      aiReply += `📦 Max companies per scrape: ${limits.maxCompanies === Infinity ? '∞' : limits.maxCompanies}\n\n`
      aiReply += `Want to upgrade? Visit our website for premium plans! 🚀`

      await prisma.whatsAppMessage.create({
        data: {
          from,
          customerMessage: incomingMessage,
          aiReply,
          status: 'SUCCESS'
        }
      })

      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${aiReply}</Message>
</Response>`

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    if (isScrapingRequest(incomingMessage)) {
      console.log('🔍 Scraping request detected!')

      // Check subscription limits
      if (!limits.allowed) {
        aiReply = `⚠️ *Scraping Limit Reached!*\n\n`
        aiReply += `You've used ${limits.current}/${limits.limit} scrapes this month on the *${subscription.plan.toUpperCase()}* plan.\n\n`
        aiReply += `💡 Upgrade to get:\n`
        aiReply += `• Unlimited scraping\n`
        aiReply += `• More companies per search\n`
        aiReply += `• Priority support\n\n`
        aiReply += `Visit our pricing page to upgrade! 🚀`

        await prisma.whatsAppMessage.create({
          data: {
            from,
            customerMessage: incomingMessage,
            aiReply,
            status: 'LIMIT_EXCEEDED'
          }
        })

        const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${aiReply}</Message>
</Response>`

        return new NextResponse(twimlResponse, {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        })
      }

      aiReply = `🔍 Got it! I am searching for "${incomingMessage}" right now. This may take 1-2 minutes. I will send you the results as soon as they are ready!`

      await prisma.whatsAppMessage.create({
        data: {
          from,
          customerMessage: incomingMessage,
          aiReply,
          status: 'SUCCESS'
        }
      })

      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${aiReply}</Message>
</Response>`

      scrapeCompanies(incomingMessage).then(async (results) => {
        console.log(`🏢 Scraping done! Found ${results.length} results`)

        // Apply plan limits to results
        const maxResults = Math.min(results.length, limits.maxCompanies)
        const limitedResults = results.slice(0, maxResults)

        if (limitedResults.length > 0) {
          const job = await prisma.scrapeJob.create({
            data: {
              query: incomingMessage,
              status: 'completed',
              totalFound: limitedResults.length,
            }
          })

          for (const place of limitedResults) {
            try {
              await prisma.company.create({
                data: {
                  name: place.title || place.name || 'Unknown',
                  website: place.website || '',
                  email: place.email || '',
                  location: place.address || '',
                  source: 'Google Maps',
                  scrapeJobId: job.id,
                }
              })
            } catch (e) {
              // Skip duplicates
            }
          }

          // Generate CSV
          const csvHeader = 'Name,Email,Website,Location\n'
          const csvRows = limitedResults.map((c: any) =>
            `"${c.title || c.name || 'Unknown'}","${c.email || ''}","${c.website || ''}","${c.address || ''}"`
          ).join('\n')
          const csvContent = csvHeader + csvRows

          // Save CSV temporarily
          const fileName = `results-${Date.now()}.csv`
          const filePath = path.join(process.cwd(), 'public', fileName)
          fs.writeFileSync(filePath, csvContent)

          // Upload to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw',
            public_id: fileName,
            format: 'csv',
          })

          const csvUrl = uploadResult.secure_url
          console.log(`📁 CSV uploaded to Cloudinary: ${csvUrl}`)

          // Delete local file
          fs.unlinkSync(filePath)

          // Send CSV link via WhatsApp
          let resultMessage = `✅ Done! Found *${limitedResults.length} companies* for "${incomingMessage}"!\n\n📥 Download your CSV file here:\n${csvUrl}\n\n`
          
          // Show upgrade prompt for free users
          if (subscription.plan === 'free' && results.length > limitedResults.length) {
            resultMessage += `\n💡 *${results.length - limitedResults.length} more companies available!* Upgrade to see all results.`
          }
          
          resultMessage += `\n📊 Scrapes used: ${limits.current + 1}/${limits.limit === Infinity ? '∞' : limits.limit} this month`

          await sendWhatsAppMessage(from, resultMessage)

        } else {
          await sendWhatsAppMessage(from, `❌ Sorry! I couldn't find results for "${incomingMessage}". Please try a more specific keyword like "IT companies in New York".`)
        }
      })

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })

    } else {
      console.log('💬 Normal conversation detected!')

      const previousMessages = await prisma.whatsAppMessage.findMany({
        where: { from },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })

      const conversationHistory: any[] = []
      previousMessages.reverse().forEach((msg) => {
        conversationHistory.push({ role: 'user', content: msg.customerMessage })
        conversationHistory.push({ role: 'assistant', content: msg.aiReply })
      })
      conversationHistory.push({ role: 'user', content: incomingMessage })

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer service assistant for ScrapeEngine, 
            a platform that scrapes business emails automatically. 
            Be friendly, professional and concise. Keep replies under 150 words.
            If users ask about plans or pricing, mention we have Free, Starter, and Plus plans.
            Tell them to send "plan" to see their current usage.`
          },
          ...conversationHistory
        ],
        max_tokens: 200,
      })

      aiReply = completion.choices[0].message.content || ''

      await prisma.whatsAppMessage.create({
        data: {
          from,
          customerMessage: incomingMessage,
          aiReply,
          status: 'SUCCESS'
        }
      })

      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${aiReply}</Message>
</Response>`

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

  } catch (error: any) {
    console.error('❌ WhatsApp webhook error:', error.message)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}