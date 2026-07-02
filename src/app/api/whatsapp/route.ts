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

const FREE_LIMIT = 100

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

function getUpgradeMessage(usedCount: number): string {
  const pricingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`
  return `🚀 *Upgrade to ScrapeEngine Pro!*\n\nYou've used ${usedCount}/${FREE_LIMIT} free companies.\nGet unlimited scraping, priority support, and more.\n\n👉 Upgrade here: ${pricingLink}`
}

async function getOrCreateWhatsAppUser(phoneNumber: string) {
  let user = await prisma.whatsAppUser.findUnique({
    where: { phoneNumber },
  })

  if (!user) {
    user = await prisma.whatsAppUser.create({
      data: { phoneNumber },
    })
  }

  return user
}

async function checkLimit(phoneNumber: string) {
  const user = await getOrCreateWhatsAppUser(phoneNumber)
  const isPro = user.plan === 'pro'

  return {
    used: user.scrapeCount,
    limit: FREE_LIMIT,
    isLimitReached: !isPro && user.scrapeCount >= FREE_LIMIT,
    isPro,
    remaining: isPro ? Infinity : Math.max(0, FREE_LIMIT - user.scrapeCount),
  }
}

async function incrementScrapeCount(phoneNumber: string, count: number) {
  await prisma.whatsAppUser.update({
    where: { phoneNumber },
    data: { scrapeCount: { increment: count } },
  })
}

async function getConversationHistory(from: string) {
  const previousMessages = await prisma.whatsAppMessage.findMany({
    where: { from },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const history: any[] = []
  previousMessages.reverse().forEach((msg) => {
    history.push({ role: 'user', content: msg.customerMessage })
    history.push({ role: 'assistant', content: msg.aiReply })
  })
  return history
}

async function classifyIntent(message: string): Promise<'scrape_request' | 'upgrade_info' | 'general_chat'> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You classify WhatsApp messages for a business email scraping service into exactly one category:
- "scrape_request": user is actually asking to find/search/scrape a list of companies right now (e.g. "50 IT companies in New York", "find marketing agencies in London")
- "upgrade_info": user is asking about their plan, pricing, usage, or upgrading
- "general_chat": anything else — greetings, questions about how the service works, small talk, unclear requests

Reply with ONLY one of these exact words: scrape_request, upgrade_info, or general_chat. Nothing else.`
        },
        { role: 'user', content: message }
      ],
      max_tokens: 10,
      temperature: 0,
    })

    const result = completion.choices[0].message.content?.trim().toLowerCase()

    if (result === 'scrape_request') return 'scrape_request'
    if (result === 'upgrade_info') return 'upgrade_info'
    return 'general_chat'
  } catch (error: any) {
    console.error('Intent classification error:', error.message)
    return 'general_chat'
  }
}

async function generateNaturalReply(
  situationContext: string,
  userMessage: string,
  conversationHistory: any[] = []
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a friendly, helpful assistant for ScrapeEngine, a business email scraping service on WhatsApp.
Reply naturally and conversationally, like a helpful human teammate texting — not like a template or a bot.
Vary your phrasing, use casual warmth, and keep it under 100 words.
You will be given the current situation as context — turn that into a natural WhatsApp reply.
Never invent numbers, links, or facts that weren't given to you in the situation.
If told not to include a link, do not include any URL at all — one will be added separately by the system.
Use emojis sparingly, only where they'd naturally fit.`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: `User's message: "${userMessage}"\n\nSituation: ${situationContext}\n\nWrite a natural reply to send back.`
        }
      ],
      max_tokens: 200,
    })

    return completion.choices[0].message.content || situationContext
  } catch (error: any) {
    console.error('Groq reply generation error:', error.message)
    return situationContext
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const incomingMessage = formData.get('Body') as string
    const from = formData.get('From') as string

    console.log(`📩 Message from ${from}: ${incomingMessage}`)

    await getOrCreateWhatsAppUser(from)

    const conversationHistory = await getConversationHistory(from)

    const intent = await classifyIntent(incomingMessage)
    console.log(`🎯 Intent classified as: ${intent}`)

    let aiReply = ''

    // ── "plan" / "upgrade" info request ──────────────────────────────
    if (intent === 'upgrade_info') {
      const limit = await checkLimit(from)

      const situationContext = limit.isPro
        ? `User is on the PRO plan with unlimited scraping. Thank them for being a subscriber.`
        : `User is on the FREE plan. They've used ${limit.used} out of ${limit.limit} free companies, ${limit.remaining} remaining. Suggest they upgrade at ${process.env.NEXT_PUBLIC_BASE_URL}/pricing for unlimited scraping.`

      aiReply = await generateNaturalReply(situationContext, incomingMessage, conversationHistory)

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' }
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

    // ── Handle scraping requests ───────────────────────────────────────
    if (intent === 'scrape_request') {
      console.log('🔍 Scraping request detected!')

      const limit = await checkLimit(from)

      if (limit.isLimitReached) {
        const situationContext = `User hit their free limit of ${limit.limit} companies (used ${limit.used}). They need to upgrade to continue scraping. Upgrade link: ${process.env.NEXT_PUBLIC_BASE_URL}/pricing`

        aiReply = await generateNaturalReply(situationContext, incomingMessage, conversationHistory)

        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply, status: 'LIMIT_EXCEEDED' }
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

      const startSituation = `User asked to scrape/find: "${incomingMessage}". The search just started and takes 1-2 minutes. They've used ${limit.used} out of ${limit.limit} free companies so far. Let them know you're on it and results are coming soon.`

      aiReply = await generateNaturalReply(startSituation, incomingMessage, conversationHistory)

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' }
      })

      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${aiReply}</Message>
</Response>`

      // ── Background job: runs after the TwiML response is already sent ──
      scrapeCompanies(incomingMessage).then(async (results) => {
        console.log(`🏢 Scraping done! Found ${results.length} results`)

        const allowedCount = limit.isPro ? results.length : Math.min(results.length, limit.remaining)
        const cappedResults = results.slice(0, allowedCount)

        if (cappedResults.length > 0) {
          const job = await prisma.scrapeJob.create({
            data: {
              query: incomingMessage,
              status: 'completed',
              totalFound: cappedResults.length,
            }
          })

          for (const place of cappedResults) {
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

          await incrementScrapeCount(from, cappedResults.length)

          const csvHeader = 'Name,Email,Website,Location\n'
          const csvRows = cappedResults.map((c: any) =>
            `"${c.title || c.name || 'Unknown'}","${c.email || ''}","${c.website || ''}","${c.address || ''}"`
          ).join('\n')
          const csvContent = csvHeader + csvRows

          const fileName = `results-${Date.now()}.csv`
          const filePath = path.join(process.cwd(), 'public', fileName)
          fs.writeFileSync(filePath, csvContent)

          const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw',
            public_id: fileName,
            format: 'csv',
          })

          const csvUrl = uploadResult.secure_url
          console.log(`📁 CSV uploaded to Cloudinary: ${csvUrl}`)

          fs.unlinkSync(filePath)

          const updatedLimit = await checkLimit(from)

          // Note: link is intentionally left OUT of what the AI rewrites,
          // so it can never be dropped, shortened, or altered by the AI.
          let resultSituation = `Found ${cappedResults.length} companies for "${incomingMessage}". Do not include any link or URL in your reply — one will be added separately. `

          if (!limit.isPro && allowedCount < results.length) {
            resultSituation += `We actually found ${results.length} total but they hit their free limit, so only ${allowedCount} were included. Mention they should consider upgrading (don't include the link).`
          } else if (updatedLimit.isLimitReached) {
            resultSituation += `This used up all ${updatedLimit.limit} of their free companies. Mention they should consider upgrading (don't include the link).`
          } else {
            resultSituation += `They've now used ${updatedLimit.used} out of ${updatedLimit.limit} free companies.`
          }

          const naturalIntro = await generateNaturalReply(resultSituation, incomingMessage, conversationHistory)

          // Append the real, exact link in code — never trust the AI to preserve it
          let resultMessage = `${naturalIntro}\n\n📥 Download your list here:\n${csvUrl}`

          if ((!limit.isPro && allowedCount < results.length) || updatedLimit.isLimitReached) {
            resultMessage += `\n\n🚀 Upgrade: ${process.env.NEXT_PUBLIC_BASE_URL}/pricing`
          }

          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply: resultMessage, status: 'SUCCESS' }
          })

          await sendWhatsAppMessage(from, resultMessage)

        } else {
          const noResultsSituation = `Could not find any results for "${incomingMessage}". Suggest they try a more specific search, like including a location or industry, e.g. "IT companies in New York".`

          const noResultsMessage = await generateNaturalReply(noResultsSituation, incomingMessage, conversationHistory)

          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply: noResultsMessage, status: 'NO_RESULTS' }
          })

          await sendWhatsAppMessage(from, noResultsMessage)
        }
      }).catch(async (err) => {
        // Catches anything that throws inside the block above (DB errors, Cloudinary
        // failures, etc.) so the user gets a reply instead of waiting forever with nothing.
        console.error('❌ Background scrape/send failed:', err)
        await sendWhatsAppMessage(from, "Sorry, something went wrong while searching. Please try again in a moment.")
      })

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })

    } else {
      // ── general_chat ──────────────────────────────────────────────
      console.log('💬 Normal conversation detected!')

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer service assistant for ScrapeEngine, 
            a platform that scrapes business emails automatically. 
            Be friendly, professional and concise. Keep replies under 150 words.
            Free users get 100 companies total. Tell them to send "upgrade" to see their usage and upgrade options.`
          },
          ...conversationHistory,
          { role: 'user', content: incomingMessage }
        ],
        max_tokens: 200,
      })

      aiReply = completion.choices[0].message.content || ''

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' }
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