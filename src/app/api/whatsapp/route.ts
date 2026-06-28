import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { prisma } from '@/lib/prisma'
import { scrapeCompanies } from '@/lib/scraper'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

function isScrapingRequest(message: string): boolean {
  const keywords = [
    'companies', 'company', 'emails', 'leads',
    'find', 'search', 'scrape', 'get me',
    'list of', 'give me', 'show me'
  ]
  const lower = message.toLowerCase()
  return keywords.some(k => lower.includes(k))
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const incomingMessage = formData.get('Body') as string
    const from = formData.get('From') as string

    console.log(`Message from ${from}: ${incomingMessage}`)

    let aiReply = ''

    if (isScrapingRequest(incomingMessage)) {
      console.log('Scraping request detected!')

      aiReply = `Got it! I am searching for "${incomingMessage}" right now. Please wait a moment...`

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

      // Start scraping in background
      scrapeCompanies(incomingMessage).then(async (results) => {
        if (results.length > 0) {
          // Save to database
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

          const top5 = results.slice(0, 5)
          const companiesList = top5.map((c: any, i: number) =>
            `${i + 1}. ${c.title || c.name} - ${c.email || 'email not found'}`
          ).join('\n')

          console.log(`Scraping done! Found ${results.length} companies`)
          console.log(`Top 5:\n${companiesList}`)
        }
      })

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })

    } else {
      // Normal conversation
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
    console.error('WhatsApp webhook error:', error.message)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}