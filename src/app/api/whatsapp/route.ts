import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { prisma } from '@/lib/prisma'
import { scrapeCompanies } from '@/lib/scraper'
import twilio from 'twilio'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import Stripe from 'stripe'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const FREE_LIMIT = 100
const NEAR_LIMIT_THRESHOLD = 10

const PLANS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['50 emails/month', '1 scraping job at a time', 'Basic email extraction', 'CSV export (limited)'],
    priceId: null,
  },
  starter: {
    name: 'Starter',
    monthlyPrice: 29,
    yearlyPrice: 199,
    features: ['500 emails/month', '5 concurrent jobs', 'Advanced extraction', 'Unlimited CSV export', 'Email support'],
    priceId: {
      monthly: 'price_1TnYfE5ZTEXUpREBwxNwwEqV',
      yearly: 'price_1TnwvI5ZTEXUpREBhdfJS2s6',
    },
  },
  plus: {
    name: 'Plus',
    monthlyPrice: 59,
    yearlyPrice: 399,
    features: ['Unlimited emails', '10 concurrent jobs', 'Advanced extraction', 'Unlimited CSV export', 'Priority support', 'All platforms', 'API access'],
    priceId: {
      monthly: 'price_1TnwtN5ZTEXUpREBI2uOTv98',
      yearly: 'price_1Tnwvd5ZTEXUpREBYKPYdWWy',
    },
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function sendWhatsAppMessage(to: string, message: string) {
  try {
    await twilioClient.messages.create({
      from: 'whatsapp:+14155238886',
      to,
      body: message,
    })
    console.log(`✅ Sent message to ${to}`)
  } catch (error: any) {
    console.error('Error sending message:', error.message)
  }
}

async function getOrCreateWhatsAppUser(phoneNumber: string) {
  let user = await prisma.whatsAppUser.findUnique({ where: { phoneNumber } })
  if (!user) user = await prisma.whatsAppUser.create({ data: { phoneNumber } })
  return user
}

async function checkLimit(phoneNumber: string) {
  const user = await getOrCreateWhatsAppUser(phoneNumber)
  const isPro = user.plan === 'pro' || user.plan === 'plus' || user.plan === 'starter'
  const remaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - user.scrapeCount)
  return {
    used: user.scrapeCount,
    limit: FREE_LIMIT,
    isLimitReached: !isPro && user.scrapeCount >= FREE_LIMIT,
    isPro,
    plan: user.plan,
    remaining,
    isNearLimit: !isPro && remaining <= NEAR_LIMIT_THRESHOLD && remaining > 0,
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

async function checkUserPlanByEmail(email: string): Promise<{ exists: boolean; plan: string; name: string }> {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { exists: false, plan: 'free', name: '' }
    return { exists: true, plan: user.plan || 'free', name: user.name || '' }
  } catch {
    return { exists: false, plan: 'free', name: '' }
  }
}

async function checkWhatsAppUserPlan(phoneNumber: string): Promise<string> {
  const user = await prisma.whatsAppUser.findUnique({ where: { phoneNumber } })
  return user?.plan || 'free'
}

async function classifyIntent(message: string): Promise<
  'scrape_request' | 'upgrade_info' | 'provide_email' | 'payment_confirmed' | 'general_chat'
> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You classify WhatsApp messages for a business email scraping service into exactly one category:
- "scrape_request": user wants to find/search/scrape companies right now (e.g. "50 IT companies in New York")
- "upgrade_info": user is explicitly asking about plans, pricing, usage, or upgrading
- "provide_email": the message looks like just an email address (e.g. "user@example.com")
- "payment_confirmed": user is saying they have paid or upgraded (e.g. "I upgraded", "I paid", "I completed payment", "I bought the plan", "payment done")
- "general_chat": anything else — greetings like hi/hello/hey, questions, small talk

Reply with ONLY one of: scrape_request, upgrade_info, provide_email, payment_confirmed, or general_chat. Nothing else.`,
        },
        { role: 'user', content: message },
      ],
      max_tokens: 10,
      temperature: 0,
    })
    const result = completion.choices[0].message.content?.trim().toLowerCase()
    if (result === 'scrape_request') return 'scrape_request'
    if (result === 'upgrade_info') return 'upgrade_info'
    if (result === 'provide_email') return 'provide_email'
    if (result === 'payment_confirmed') return 'payment_confirmed'
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
          content: `You are a warm, polite, and professional assistant for ScrapeEngine — a business email scraping service on WhatsApp.

Your tone:
- Friendly, genuine, and helpful — like a kind colleague texting
- Polite and respectful ALWAYS — when user says "hi", "hello", "hey", "hlo" etc., greet them warmly back
- Natural and conversational, never robotic or template-sounding
- Concise — under 100 words unless truly needed

Rules:
- NEVER push upgrades unless user asks or hits their limit
- If near limit, mention it gently ONCE as a heads-up only
- Never invent numbers, links, or facts not given to you
- If told not to include a link, do NOT include any URL
- Use emojis sparingly and only where natural
- Always acknowledge what the user said first`,
        },
        ...conversationHistory,
        {
          role: 'user',
          content: `User's message: "${userMessage}"\n\nSituation: ${situationContext}\n\nWrite a warm, polite WhatsApp reply.`,
        },
      ],
      max_tokens: 200,
    })
    return completion.choices[0].message.content || situationContext
  } catch (error: any) {
    console.error('Groq reply generation error:', error.message)
    return situationContext
  }
}

function buildInvoiceMessage(planId: 'starter' | 'plus', billing: 'monthly' | 'yearly', email: string): string {
  const plan = PLANS[planId]
  const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  const billingLabel = billing === 'monthly' ? 'Monthly' : 'Yearly'
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const featuresText = plan.features.map(f => `  • ${f}`).join('\n')

  return `🧾 *ScrapeEngine Invoice*
━━━━━━━━━━━━━━━━━━━━
📋 Plan: *${plan.name}*
💳 Billing: *${billingLabel}*
📧 Email: ${email}
📅 Date: ${date}
━━━━━━━━━━━━━━━━━━━━
✅ *What's included:*
${featuresText}
━━━━━━━━━━━━━━━━━━━━
💰 *Total: $${price}/${billing === 'monthly' ? 'month' : 'year'}*
━━━━━━━━━━━━━━━━━━━━
Your payment link is coming right up! 👇`
}

// Now accepts the WhatsApp phone number so the Stripe webhook can
// automatically message this user back the instant payment completes —
// no need for the user to say "I paid".
async function createStripeCheckoutLink(
  email: string,
  planId: 'starter' | 'plus',
  billing: 'monthly' | 'yearly' = 'monthly',
  whatsappPhone?: string
): Promise<string | null> {
  try {
    const existingCustomers = await stripe.customers.list({ email, limit: 1 })
    let customerId: string

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
      console.log(`♻️ Existing Stripe customer: ${customerId}`)
    } else {
      const newCustomer = await stripe.customers.create({ email })
      customerId = newCustomer.id
      console.log(`✨ New Stripe customer: ${customerId}`)
    }

    const priceId = PLANS[planId].priceId![billing]

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        plan: planId,
        userEmail: email,
        source: 'whatsapp',
        whatsappPhone: whatsappPhone || '',
      },
      // client_reference_id also carries the phone — belt and suspenders,
      // since the webhook checks both metadata and this field.
      client_reference_id: whatsappPhone || undefined,
      success_url: `https://wa.me/14155238886`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    })

    return session.url
  } catch (error: any) {
    console.error('Stripe checkout error:', error.message)
    return null
  }
}

async function ensureClerkAccount(email: string): Promise<{ created: boolean; tempPassword: string | null }> {
  try {
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()

    const existingUsers = await client.users.getUserList({ emailAddress: [email] })
    if (existingUsers.totalCount > 0) {
      console.log(`♻️ Clerk account already exists for ${email}`)
      return { created: false, tempPassword: null }
    }

    const words = ['Blue', 'Star', 'Fast', 'Bold', 'Sky']
    const word = words[Math.floor(Math.random() * words.length)]
    const num = Math.floor(1000 + Math.random() * 9000)
    const tempPassword = `${word}@${num}`

    await client.users.createUser({
      emailAddress: [email],
      password: tempPassword,
    })
    console.log(`✨ Created Clerk account for ${email}`)

    return { created: true, tempPassword }
  } catch (error: any) {
    console.error('Clerk account creation error:', error.message)
    return { created: false, tempPassword: null }
  }
}

function extractEmail(message: string): string | null {
  const match = message.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)
  return match ? match[0] : null
}

async function isWaitingForEmail(from: string): Promise<{ waiting: boolean; planId?: string; billing?: string }> {
  const lastMsg = await prisma.whatsAppMessage.findFirst({
    where: { from },
    orderBy: { createdAt: 'desc' },
  })
  if (lastMsg?.status === 'AWAITING_EMAIL') {
    try {
      const match = lastMsg.aiReply.match(/\[PENDING:(.+)\]$/)
      if (match) {
        const { planId, billing } = JSON.parse(match[1])
        return { waiting: true, planId, billing }
      }
    } catch {}
    return { waiting: true }
  }
  return { waiting: false }
}

async function getLastEmailUsed(from: string): Promise<string | null> {
  const messages = await prisma.whatsAppMessage.findMany({
    where: { from, status: 'SUCCESS' },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  for (const msg of messages) {
    const email = extractEmail(msg.customerMessage)
    if (email) return email
  }
  return null
}

function twiml(message: string): NextResponse {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`,
    { status: 200, headers: { 'Content-Type': 'text/xml' } }
  )
}

// ── Main POST handler ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const incomingMessage = formData.get('Body') as string
    const from = formData.get('From') as string

    console.log(`📩 Message from ${from}: ${incomingMessage}`)

    if (!from || !incomingMessage) {
      console.log('⚠️ Missing From or Body — ignoring')
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
        { status: 200, headers: { 'Content-Type': 'text/xml' } }
      )
    }

    await getOrCreateWhatsAppUser(from)
    const conversationHistory = await getConversationHistory(from)

    // ── Waiting for email? ────────────────────────────────────────────────────
    const emailWait = await isWaitingForEmail(from)
    if (emailWait.waiting) {
      const email = extractEmail(incomingMessage)

      if (email) {
        const planId = (emailWait.planId || 'starter') as 'starter' | 'plus'
        const billing = (emailWait.billing || 'monthly') as 'monthly' | 'yearly'

        // Check if Clerk account exists, create one if not
        const { created, tempPassword } = await ensureClerkAccount(email)

        // Message 1: Account created with temp password (only if new account)
        if (created && tempPassword) {
          const accountMsg = `✨ *Account Created!*
━━━━━━━━━━━━━━━━━━━━
📧 Email: ${email}
🔐 Temp Password: *${tempPassword}*
━━━━━━━━━━━━━━━━━━━━
You can log in to ScrapeEngine with these credentials. Please change your password after logging in for security. 😊`
          await sendWhatsAppMessage(from, accountMsg)
          await new Promise(res => setTimeout(res, 1500))
        }

        // Message 2: Invoice
        const invoiceMessage = buildInvoiceMessage(planId, billing, email)
        await sendWhatsAppMessage(from, invoiceMessage)
        await new Promise(res => setTimeout(res, 1500))

        // Message 3: Stripe payment link (phone number passed so the
        // webhook can auto-confirm payment back into this WhatsApp chat)
        const checkoutUrl = await createStripeCheckoutLink(email, planId, billing, from)
        let paymentMessage: string
        if (checkoutUrl) {
          paymentMessage = `💳 *Complete your payment here:*\n\n${checkoutUrl}\n\nOnce payment is done, you'll be brought right back here and I'll confirm your *${PLANS[planId].name}* plan automatically! 🎉`
        } else {
          paymentMessage = `I'm sorry, I had trouble generating your payment link. Please visit ${process.env.NEXT_PUBLIC_BASE_URL}/pricing to upgrade directly. Apologies for the inconvenience! 🙏`
        }

        const fullReply = `${invoiceMessage}\n\n${paymentMessage}`
        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply: fullReply, status: 'SUCCESS' },
        })

        await sendWhatsAppMessage(from, paymentMessage)

        return new NextResponse(
          `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
          { status: 200, headers: { 'Content-Type': 'text/xml' } }
        )

      } else {
        const aiReply = `Hmm, that doesn't look like a valid email address. Could you please share your email again? For example: yourname@example.com 😊`
        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply, status: 'AWAITING_EMAIL' },
        })
        return twiml(aiReply)
      }
    }

    // ── Classify intent ───────────────────────────────────────────────────────
    const intent = await classifyIntent(incomingMessage)
    console.log(`🎯 Intent: ${intent}`)

    let aiReply = ''

    // ── User says they already paid / upgraded (manual fallback — the ────────
    //    webhook should normally beat this by messaging automatically first) ─
    if (intent === 'payment_confirmed') {
      console.log('💰 Payment confirmation detected!')

      const whatsappPlan = await checkWhatsAppUserPlan(from)
      const isPaidPlan = whatsappPlan === 'starter' || whatsappPlan === 'plus' || whatsappPlan === 'pro'

      if (isPaidPlan) {
        const planName = PLANS[whatsappPlan as 'starter' | 'plus']?.name || whatsappPlan
        aiReply = `🎉 Welcome to the *${planName}* plan! Your upgrade is confirmed and all your premium features are now active.\n\nJust send me any scraping request and I'll get started right away! 🚀`
      } else {
        const lastEmail = await getLastEmailUsed(from)
        let dbPlan = 'free'

        if (lastEmail) {
          const userInfo = await checkUserPlanByEmail(lastEmail)
          dbPlan = userInfo.plan
        }

        const isDbPaid = dbPlan === 'starter' || dbPlan === 'plus' || dbPlan === 'pro'

        if (isDbPaid) {
          await prisma.whatsAppUser.update({
            where: { phoneNumber: from },
            data: { plan: dbPlan },
          })
          const planName = PLANS[dbPlan as 'starter' | 'plus']?.name || dbPlan
          aiReply = `🎉 Wonderful! I've confirmed your *${planName}* plan upgrade. All your premium features are now active!\n\nJust send me any scraping request and I'll get to work right away! 🚀`
        } else {
          aiReply = `Hmm, I checked your account but it looks like your plan hasn't been updated yet. 🤔\n\nThis can sometimes take a minute or two to reflect. Please wait a moment and try again!\n\nIf the issue continues, please share your payment confirmation email and I'll look into it right away. 🙏`
        }
      }

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
      })
      return twiml(aiReply)
    }

    // ── Upgrade / plan info ───────────────────────────────────────────────────
    if (intent === 'upgrade_info') {
      const limit = await checkLimit(from)
      const msgLower = incomingMessage.toLowerCase()
      const wantsStarter = msgLower.includes('starter')
      const wantsPlus = msgLower.includes('plus')
      const wantsBilling = msgLower.includes('yearly') || msgLower.includes('annual') ? 'yearly' : 'monthly'

      if ((wantsStarter || wantsPlus) && (
        msgLower.includes('upgrade') || msgLower.includes('buy') ||
        msgLower.includes('get') || msgLower.includes('subscribe') ||
        msgLower.includes('want') || msgLower.includes('take')
      )) {
        const targetPlan = wantsPlus ? 'plus' : 'starter'
        const plan = PLANS[targetPlan]
        const price = wantsBilling === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice

        aiReply = `Great choice! 🎉 The *${plan.name}* plan is *$${price}/${wantsBilling === 'monthly' ? 'month' : 'year'}*.\n\nTo generate your invoice and payment link, could you please share the email address you'd like to use for your account?`

        await prisma.whatsAppMessage.create({
          data: {
            from,
            customerMessage: incomingMessage,
            aiReply: aiReply + `[PENDING:${JSON.stringify({ planId: targetPlan, billing: wantsBilling })}]`,
            status: 'AWAITING_EMAIL',
          },
        })
        return twiml(aiReply)
      }

      const plansInfo = `Here are our plans:\n\n🆓 *Free — $0*\n• 50 emails/month\n• 1 job at a time\n• Basic extraction, limited CSV\n\n⚡ *Starter — $29/mo or $199/yr*\n• 500 emails/month\n• 5 concurrent jobs\n• Advanced extraction\n• Unlimited CSV + Email support\n\n🚀 *Plus — $59/mo or $399/yr*\n• Unlimited emails\n• 10 concurrent jobs\n• Advanced extraction\n• Unlimited CSV, Priority support\n• API access + All platforms`

      const situationContext = limit.isPro
        ? `User asked about plans. They are on a paid plan (${limit.plan}). Thank them warmly and show the plans.`
        : `User asked about plans. FREE plan, used ${limit.used}/${limit.limit} (${limit.remaining} left). Show the plans and mention they can upgrade by saying "upgrade to Starter" or "upgrade to Plus".`

      aiReply = await generateNaturalReply(situationContext, incomingMessage, conversationHistory)
      aiReply = `${aiReply}\n\n${plansInfo}\n\n💬 Say *"upgrade to Starter"* or *"upgrade to Plus"* and I'll send your invoice + payment link instantly! 😊`

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
      })
      return twiml(aiReply)
    }

    // ── Scrape request ────────────────────────────────────────────────────────
    if (intent === 'scrape_request') {
      console.log('🔍 Scraping request detected!')
      const limit = await checkLimit(from)

      if (limit.isLimitReached) {
        const situationContext = `User hit free limit of ${limit.limit} companies (used ${limit.used}). Tell them politely and say they can type "upgrade to Starter" or "upgrade to Plus" to get their invoice and payment link.`
        aiReply = await generateNaturalReply(situationContext, incomingMessage, conversationHistory)
        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply, status: 'LIMIT_EXCEEDED' },
        })
        return twiml(aiReply)
      }

      let startSituation = `User asked to scrape: "${incomingMessage}". Search just started, takes 1-2 minutes. Let them know you're on it.`
      if (limit.isNearLimit) {
        startSituation += ` Gently mention they only have ${limit.remaining} free companies left out of ${limit.limit}.`
      }

      aiReply = await generateNaturalReply(startSituation, incomingMessage, conversationHistory)

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
      })

      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${aiReply}</Message></Response>`

      scrapeCompanies(incomingMessage).then(async (results) => {
        console.log(`🏢 Scraping done! Found ${results.length} results`)

        const allowedCount = limit.isPro ? results.length : Math.min(results.length, limit.remaining)
        const cappedResults = results.slice(0, allowedCount)

        if (cappedResults.length > 0) {
          const job = await prisma.scrapeJob.create({
            data: { query: incomingMessage, status: 'completed', totalFound: cappedResults.length },
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
                },
              })
            } catch (e) { /* skip duplicates */ }
          }

          await incrementScrapeCount(from, cappedResults.length)

          const csvHeader = 'Name,Email,Website,Location\n'
          const csvRows = cappedResults.map((c: any) =>
            `"${c.title || c.name || 'Unknown'}","${c.email || ''}","${c.website || ''}","${c.address || ''}"`
          ).join('\n')

          const fileName = `results-${Date.now()}.csv`
          const filePath = path.join(process.cwd(), 'public', fileName)
          fs.writeFileSync(filePath, csvHeader + csvRows)

          const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw', public_id: fileName, format: 'csv',
          })
          const csvUrl = uploadResult.secure_url
          fs.unlinkSync(filePath)

          const updatedLimit = await checkLimit(from)

          let resultSituation = `Found ${cappedResults.length} companies for "${incomingMessage}". Do NOT include any link or URL — will be added by system. `
          if (!limit.isPro && allowedCount < results.length) {
            resultSituation += `Found ${results.length} total but only ${allowedCount} due to free limit. Mention they can say "upgrade to Starter" or "upgrade to Plus" (no link).`
          } else if (updatedLimit.isLimitReached) {
            resultSituation += `Used up all free companies. Mention they can say "upgrade to Starter" or "upgrade to Plus" to continue (no link).`
          } else if (updatedLimit.isNearLimit) {
            resultSituation += `Used ${updatedLimit.used}/${updatedLimit.limit}, only ${updatedLimit.remaining} left. Gentle heads-up only.`
          } else {
            resultSituation += `Used ${updatedLimit.used}/${updatedLimit.limit}. No need to mention upgrading.`
          }

          const naturalIntro = await generateNaturalReply(resultSituation, incomingMessage, conversationHistory)
          let resultMessage = `${naturalIntro}\n\n📥 Download your results here:\n${csvUrl}`

          if ((!limit.isPro && allowedCount < results.length) || updatedLimit.isLimitReached) {
            resultMessage += `\n\n💬 Say *"upgrade to Starter"* or *"upgrade to Plus"* and I'll send your invoice + payment link instantly!`
          }

          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply: resultMessage, status: 'SUCCESS' },
          })
          await sendWhatsAppMessage(from, resultMessage)

        } else {
          const noResultsSituation = `No results for "${incomingMessage}". Politely suggest a more specific search like "IT companies in New York".`
          const noResultsMessage = await generateNaturalReply(noResultsSituation, incomingMessage, conversationHistory)
          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply: noResultsMessage, status: 'NO_RESULTS' },
          })
          await sendWhatsAppMessage(from, noResultsMessage)
        }
      }).catch(async (err) => {
        console.error('❌ Background scrape failed:', err)
        await sendWhatsAppMessage(from, "I'm sorry, something went wrong while searching. Please try again in a moment! 🙏")
      })

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })

    } else {
      // ── general_chat ──────────────────────────────────────────────────────
      console.log('💬 General conversation detected!')
      const limit = await checkLimit(from)

      const generalSituation = limit.isNearLimit
        ? `User sent a general message or greeting. Respond warmly. Gently mention they have ${limit.remaining} free companies left if it fits naturally.`
        : `User sent a general message or greeting. If it's a greeting like "hi", "hello", "hey", or "hlo", greet them back warmly and let them know what ScrapeEngine can do. Do NOT mention upgrading or usage.`

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a warm, polite, professional assistant for ScrapeEngine — a business email scraping service on WhatsApp.

IMPORTANT: Always reply to greetings like "hi", "hello", "hey", "hlo" with a warm, friendly welcome. Never ignore a greeting.

Keep replies under 150 words. Never push upgrades unless the user asks.
ScrapeEngine helps find business emails and company data. Free users get 100 companies total.
To check usage or upgrade, users can say "my plan" or "upgrade to Starter" / "upgrade to Plus".`,
          },
          ...conversationHistory,
          { role: 'user', content: `${generalSituation}\n\nUser's message: "${incomingMessage}"` },
        ],
        max_tokens: 200,
      })

      aiReply = completion.choices[0].message.content ||
        `Hi there! 👋 Welcome to ScrapeEngine! I help you find business emails and company data. Just tell me what companies you're looking for and I'll get started! 😊`

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
      })

      return twiml(aiReply)
    }

  } catch (error: any) {
    console.error('❌ WhatsApp webhook error:', error.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
