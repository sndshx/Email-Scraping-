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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const incomingMessage = formData.get('Body') as string
    const from = formData.get('From') as string

    console.log(`📩 Message from ${from}: ${incomingMessage}`)

    let aiReply = ''

    if (isScrapingRequest(incomingMessage)) {
      console.log('🔍 Scraping request detected!')

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

        if (results.length > 0) {
          const job = await prisma.scrapeJob.create({
            data: {
              query: incomingMessage,
              status: 'completed',
              totalFound: results.length,
            }
          })

          for (const place of results.slice(0, 50)) {
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
          const csvRows = results.map((c: any) =>
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
          await sendWhatsAppMessage(from, `✅ Done! Found *${results.length} companies* for "${incomingMessage}"!\n\n📥 Download your CSV file here:\n${csvUrl}`)

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
            Be friendly, professional and concise. Keep replies under 150 words.`
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