import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { prisma } from '@/lib/prisma'
import { scrapeCompanies } from '@/lib/scraper'
import twilio from 'twilio'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import Stripe from 'stripe'
import { Resend } from 'resend'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const resend = new Resend(process.env.RESEND_API_KEY)

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

// ── OTP Store (in-memory, resets on server restart) ───────────────────────────
// Structure: { phoneNumber: { otp, email, planId, billing, expiresAt } }
const otpStore = new Map<string, {
  otp: string
  email: string
  planId: 'starter' | 'plus'
  billing: 'monthly' | 'yearly'
  expiresAt: number
}>()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ── Send WhatsApp ─────────────────────────────────────────────────────────────
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

// ── Send OTP Email ────────────────────────────────────────────────────────────
async function sendOTPEmail(email: string, otp: string, planName: string) {
  try {
    await resend.emails.send({
      from: 'ScrapeEngine <onboarding@resend.dev>',
      to: email,
      subject: `🔐 Your ScrapeEngine Verification Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <div style="background: #2563EB; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Email Verification</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
            <p style="color: #4b5563; font-size: 16px;">Your verification code for <strong>${planName}</strong> plan upgrade:</p>
            <div style="background: #f3f4f6; padding: 24px; border-radius: 8px; margin: 16px 0;">
              <span style="font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #2563EB;">${otp}</span>
            </div>
            <p style="color: #9ca3af; font-size: 14px;">This code expires in 10 minutes.</p>
            <p style="color: #6b7280; font-size: 14px;">Share this code in WhatsApp to complete your verification.</p>
          </div>
          <p style="color: #9ca3af; text-align: center; font-size: 12px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    })
    console.log(`✅ OTP email sent to ${email}`)
  } catch (error: any) {
    console.error('Error sending OTP email:', error.message)
  }
}

// ── Send Invoice Email ────────────────────────────────────────────────────────
async function sendInvoiceEmail(email: string, planId: 'starter' | 'plus', billing: 'monthly' | 'yearly') {
  try {
    const plan = PLANS[planId]
    const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
    const billingLabel = billing === 'monthly' ? 'Monthly' : 'Yearly'
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const featuresHtml = plan.features.map(f => `<li>${f}</li>`).join('')

    await resend.emails.send({
      from: 'ScrapeEngine <onboarding@resend.dev>',
      to: email,
      subject: `🧾 Your ScrapeEngine ${plan.name} Plan Invoice`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <div style="background: #2563EB; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🧾 ScrapeEngine Invoice</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Plan</td><td style="padding: 8px 0; font-weight: bold; text-align: right;">${plan.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Billing</td><td style="padding: 8px 0; text-align: right;">${billingLabel}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; text-align: right;">${email}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Date</td><td style="padding: 8px 0; text-align: right;">${date}</td></tr>
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total</td>
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px; text-align: right; color: #2563EB;">$${price}/${billing === 'monthly' ? 'month' : 'year'}</td>
              </tr>
            </table>
          </div>
          <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #1f2937; margin-top: 0;">✅ What's included:</h3>
            <ul style="color: #4b5563; line-height: 1.8;">${featuresHtml}</ul>
          </div>
          <p style="color: #9ca3af; text-align: center; font-size: 12px;">
            Thank you for choosing ScrapeEngine! Complete your payment via the link sent to your WhatsApp.
          </p>
        </div>
      `,
    })
    console.log(`✅ Invoice email sent to ${email}`)
  } catch (error: any) {
    console.error('Error sending invoice email:', error.message)
  }
}

// ── DB helpers ────────────────────────────────────────────────────────────────
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
    take: 10,
  })
  const history: any[] = []
  previousMessages.reverse().forEach((msg) => {
    history.push({ role: 'user', content: msg.customerMessage })
    const cleanReply = msg.aiReply.replace(/\[PENDING:.+\]$/, '').trim()
    history.push({ role: 'assistant', content: cleanReply })
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

function classifyIntent(message: string, conversationHistory: any[]): 
  'scrape_request' | 'upgrade_info' | 'provide_email' | 'provide_otp' | 'payment_confirmed' | 'general_chat'
{
  const msg = message.trim().toLowerCase()

  // ── provide_email — looks like an email address ───────────────────────────
  if (/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(message.trim())) {
    return 'provide_email'
  }

  // ── provide_otp — exactly 6 digits ───────────────────────────────────────
  if (/^\d{6}$/.test(message.trim())) {
    return 'provide_otp'
  }

  // ── payment_confirmed ─────────────────────────────────────────────────────
  const paymentKeywords = ['i paid', 'i upgraded', 'payment done', 'payment complete', 'i completed payment', 'i bought', 'payment successful', 'done payment', 'paid already']
  if (paymentKeywords.some(k => msg.includes(k))) {
    return 'payment_confirmed'
  }

  // ── upgrade_info — plan/pricing questions OR upgrade requests ─────────────
  const upgradeKeywords = [
    'upgrade to', 'buy starter', 'buy plus', 'get starter', 'get plus',
    'subscribe to', 'want starter', 'want plus', 'take starter', 'take plus',
    'starter plan', 'plus plan', 'pricing', 'how much', 'what is the plan',
    'my plan', 'my usage', 'how many left', 'remaining companies',
    'free plan', 'what plan', 'current plan', 'plan info', 'plan details',
    'yearly', 'monthly plan', 'annual plan'
  ]
  if (upgradeKeywords.some(k => msg.includes(k))) {
    return 'upgrade_info'
  }

  // ── scrape_request — finding/searching companies ──────────────────────────
  const scrapeKeywords = [
    'scrape', 'find', 'search', 'get me', 'i need', 'look for',
    'companies', 'businesses', 'restaurants', 'agencies', 'hotels',
    'shops', 'stores', 'firms', 'organizations', 'leads', 'emails from',
    'list of', 'fetch', 'collect', 'gather'
  ]
  if (scrapeKeywords.some(k => msg.includes(k))) {
    return 'scrape_request'
  }

  // ── general_chat — everything else ───────────────────────────────────────
  return 'general_chat'
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
          content: `You are a warm, polite, professional assistant for ScrapeEngine — a business email scraping service on WhatsApp.

Your tone:
- Friendly, genuine, helpful — like a kind colleague texting
- Polite and respectful ALWAYS
- Natural and conversational, never robotic
- Remember what the user said earlier
- Concise — under 100 words unless truly needed

Rules:
- NEVER push upgrades unless user asks or hits their limit
- Never invent numbers, links, or facts not given to you
- If told not to include a link, do NOT include any URL
- Use emojis sparingly
- Always acknowledge what the user said`,
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
Invoice also sent to your email! 📩`
}

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
    } else {
      const newCustomer = await stripe.customers.create({ email })
      customerId = newCustomer.id
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

function extractOTP(message: string): string | null {
  const match = message.trim().match(/^\d{6}$/)
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

async function isWaitingForOTP(from: string): Promise<boolean> {
  const lastMsg = await prisma.whatsAppMessage.findFirst({
    where: { from },
    orderBy: { createdAt: 'desc' },
  })
  return lastMsg?.status === 'AWAITING_OTP'
}

async function getLastEmailUsed(from: string): Promise<string | null> {
  const messages = await prisma.whatsAppMessage.findMany({
    where: { from },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })
  for (const msg of messages) {
    const email = extractEmail(msg.customerMessage)
    if (email) return email
  }
  return null
}

// ── After OTP verified — send invoice + payment link ─────────────────────────
async function sendInvoiceAndPaymentLink(
  from: string,
  email: string,
  planId: 'starter' | 'plus',
  billing: 'monthly' | 'yearly'
) {
  const { created, tempPassword } = await ensureClerkAccount(email)

  // Account created msg
  if (created && tempPassword) {
    const accountMsg = `✨ *Account Created!*
━━━━━━━━━━━━━━━━━━━━
📧 Email: ${email}
🔐 Temp Password: *${tempPassword}*
━━━━━━━━━━━━━━━━━━━━
You can log in to ScrapeEngine with these credentials. Please change your password after logging in! 😊`
    await sendWhatsAppMessage(from, accountMsg)
    await new Promise(res => setTimeout(res, 1500))
  }

  // Invoice WhatsApp + Email
  const invoiceMessage = buildInvoiceMessage(planId, billing, email)
  await sendWhatsAppMessage(from, invoiceMessage)
  await sendInvoiceEmail(email, planId, billing)
  await new Promise(res => setTimeout(res, 1500))

  // Payment link
  const checkoutUrl = await createStripeCheckoutLink(email, planId, billing, from)
  let paymentMessage: string
  if (checkoutUrl) {
    paymentMessage = `💳 *Complete your payment here:*\n\n${checkoutUrl}\n\nOnce payment is done, you'll be brought right back here and I'll confirm your *${PLANS[planId].name}* plan automatically! 🎉`
  } else {
    paymentMessage = `I'm sorry, I had trouble generating your payment link. Please visit ${process.env.NEXT_PUBLIC_BASE_URL}/pricing to upgrade directly. 🙏`
  }

  const fullReply = `${invoiceMessage}\n\n${paymentMessage}`
  await prisma.whatsAppMessage.create({
    data: { from, customerMessage: email, aiReply: fullReply, status: 'SUCCESS' },
  })
  await sendWhatsAppMessage(from, paymentMessage)
}

// ── Main POST handler ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const incomingMessage = formData.get('Body') as string
    const from = formData.get('From') as string

    console.log(`📩 Message from ${from}: ${incomingMessage}`)

    if (!from || !incomingMessage) {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
        { status: 200, headers: { 'Content-Type': 'text/xml' } }
      )
    }

    await getOrCreateWhatsAppUser(from)
    const conversationHistory = await getConversationHistory(from)

    // ── Waiting for OTP? ──────────────────────────────────────────────────────
    const waitingForOTP = await isWaitingForOTP(from)
    if (waitingForOTP) {
      const msgLower = incomingMessage.toLowerCase().trim()

      // If user sends non-OTP message, clear session and process normally
      const isEscapeMessage =
        msgLower === 'hi' || msgLower === 'hlo' || msgLower === 'hello' || msgLower === 'hey' ||
        msgLower.includes('cancel') || msgLower.includes('upgrade to') ||
        msgLower.includes('scrape') || msgLower.includes('find') ||
        msgLower.includes('plan') || msgLower.includes('pricing') ||
        msgLower.includes('resend code')

      if (!isEscapeMessage) {
        const otpData = otpStore.get(from)
        const otp = extractOTP(incomingMessage.trim())

        if (!otpData) {
          const aiReply = `Sorry, your verification session has expired. Please start again by saying "upgrade to Starter" or "upgrade to Plus". 🙏`
          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
          })
          await sendWhatsAppMessage(from, aiReply)
          return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
        }

        if (Date.now() > otpData.expiresAt) {
          otpStore.delete(from)
          const aiReply = `Your verification code has expired. ⏰\n\nPlease start again by saying "upgrade to Starter" or "upgrade to Plus" and we'll send a new code!`
          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
          })
          await sendWhatsAppMessage(from, aiReply)
          return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
        }

        if (msgLower.includes('resend code') || msgLower.includes('resend otp')) {
          const newOtp = generateOTP()
          otpStore.set(from, { ...otpData, otp: newOtp, expiresAt: Date.now() + 10 * 60 * 1000 })
          await sendOTPEmail(otpData.email, newOtp, PLANS[otpData.planId].name)
          const aiReply = `📧 A new verification code has been sent to *${otpData.email}*. Please check your inbox! 🔐`
          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply, status: 'AWAITING_OTP' },
          })
          await sendWhatsAppMessage(from, aiReply)
          return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
        }

        if (otp && otp === otpData.otp) {
          // ✅ OTP correct!
          otpStore.delete(from)
          const verifiedMsg = `✅ *Email Verified!*\n\nGreat, your email *${otpData.email}* has been verified. Sending your invoice and payment link now... 🎉`
          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply: verifiedMsg, status: 'SUCCESS' },
          })
          await sendWhatsAppMessage(from, verifiedMsg)
          await new Promise(res => setTimeout(res, 1000))
          await sendInvoiceAndPaymentLink(from, otpData.email, otpData.planId, otpData.billing)
        } else {
          // ❌ Wrong OTP
          const aiReply = `That code doesn't match. 🤔 Please check your email and try again, or say "resend code" to get a new one.`
          await prisma.whatsAppMessage.create({
            data: { from, customerMessage: incomingMessage, aiReply, status: 'AWAITING_OTP' },
          })
          await sendWhatsAppMessage(from, aiReply)
        }

        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
      }

      // Escape — clear OTP session and fall through to normal processing
      otpStore.delete(from)
      await prisma.whatsAppMessage.updateMany({
        where: { from, status: 'AWAITING_OTP' },
        data: { status: 'SUCCESS' },
      })
    }

    // ── Waiting for email? ────────────────────────────────────────────────────
    const emailWait = await isWaitingForEmail(from)
    if (emailWait.waiting) {
      const msgLower = incomingMessage.toLowerCase().trim()

      // Allow user to escape email flow
      const isEscapeFromEmail =
        msgLower === 'hi' || msgLower === 'hlo' || msgLower === 'hello' || msgLower === 'hey' ||
        msgLower.includes('cancel') || msgLower.includes('cancle') || msgLower.includes('stop') ||
        msgLower.includes('nevermind') || msgLower.includes('never mind') ||
        msgLower.includes('scrape') || msgLower.includes('find') ||
        msgLower.includes('companies') || msgLower.includes('back')

      if (isEscapeFromEmail) {
        // Clear email wait session
        await prisma.whatsAppMessage.updateMany({
          where: { from, status: 'AWAITING_EMAIL' },
          data: { status: 'SUCCESS' },
        })
        const cancelMsg = `No problem! The upgrade has been cancelled. 😊

Feel free to ask me anything or send a scraping request anytime!`
        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply: cancelMsg, status: 'SUCCESS' },
        })
        await sendWhatsAppMessage(from, cancelMsg)
        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
      }

      const email = extractEmail(incomingMessage)

      if (email) {
        const planId = (emailWait.planId || 'starter') as 'starter' | 'plus'
        const billing = (emailWait.billing || 'monthly') as 'monthly' | 'yearly'

        // Generate OTP and store it
        const otp = generateOTP()
        otpStore.set(from, {
          otp,
          email,
          planId,
          billing,
          expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        })

        // Send OTP to email
        await sendOTPEmail(email, otp, PLANS[planId].name)

        // Ask user to enter OTP
        const otpMsg = `📧 We've sent a 6-digit verification code to *${email}*.\n\nPlease check your inbox and share the code here to continue! 🔐\n\n_(Code expires in 10 minutes)_`

        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply: otpMsg, status: 'AWAITING_OTP' },
        })
        await sendWhatsAppMessage(from, otpMsg)

        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })

      } else {
        const aiReply = `Hmm, that doesn't look like a valid email address. Could you please share your email again? For example: yourname@example.com 😊`
        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply, status: 'AWAITING_EMAIL' },
        })
        await sendWhatsAppMessage(from, aiReply)
        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
      }
    }

    const intent = classifyIntent(incomingMessage, conversationHistory)
    console.log(`🎯 Intent: ${intent}`)

    let aiReply = ''

    // ── Resend OTP request ────────────────────────────────────────────────────
    if (incomingMessage.toLowerCase().includes('resend code') || incomingMessage.toLowerCase().includes('resend otp')) {
      const otpData = otpStore.get(from)
      if (otpData) {
        const newOtp = generateOTP()
        otpStore.set(from, { ...otpData, otp: newOtp, expiresAt: Date.now() + 10 * 60 * 1000 })
        await sendOTPEmail(otpData.email, newOtp, PLANS[otpData.planId].name)
        aiReply = `📧 A new verification code has been sent to *${otpData.email}*. Please check your inbox! 🔐`
        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply, status: 'AWAITING_OTP' },
        })
        await sendWhatsAppMessage(from, aiReply)
        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
      }
    }

    // ── Payment confirmed ─────────────────────────────────────────────────────
    if (intent === 'payment_confirmed') {
      const whatsappPlan = await checkWhatsAppUserPlan(from)
      const isPaidPlan = whatsappPlan === 'starter' || whatsappPlan === 'plus' || whatsappPlan === 'pro'

      if (isPaidPlan) {
        const planName = PLANS[whatsappPlan as 'starter' | 'plus']?.name || whatsappPlan
        aiReply = `🎉 Welcome to the *${planName}* plan! Your upgrade is confirmed and all premium features are now active.\n\nJust send me any scraping request and I'll get started right away! 🚀`
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
          aiReply = `🎉 Wonderful! Your *${planName}* plan is confirmed. All premium features are now active!\n\nJust send me any scraping request! 🚀`
        } else {
          aiReply = `Hmm, I checked your account but the plan hasn't updated yet. 🤔\n\nThis usually takes 1-2 minutes. Please try again shortly!\n\nIf the issue continues, share your payment confirmation and I'll sort it out. 🙏`
        }
      }

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
      })
      await sendWhatsAppMessage(from, aiReply)
      return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
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

        aiReply = `Great choice! 🎉 The *${plan.name}* plan is *$${price}/${wantsBilling === 'monthly' ? 'month' : 'year'}*.\n\nTo verify your identity and generate your invoice, could you please share the email address you'd like to use?`

        await prisma.whatsAppMessage.create({
          data: {
            from,
            customerMessage: incomingMessage,
            aiReply: aiReply + `[PENDING:${JSON.stringify({ planId: targetPlan, billing: wantsBilling })}]`,
            status: 'AWAITING_EMAIL',
          },
        })
        await sendWhatsAppMessage(from, aiReply)
        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
      }

      const plansInfo = `Here are our plans:\n\n🆓 *Free — $0*\n• 50 emails/month\n• 1 job at a time\n• Basic extraction, limited CSV\n\n⚡ *Starter — $29/mo or $199/yr*\n• 500 emails/month\n• 5 concurrent jobs\n• Advanced extraction\n• Unlimited CSV + Email support\n\n🚀 *Plus — $59/mo or $399/yr*\n• Unlimited emails\n• 10 concurrent jobs\n• Advanced extraction\n• Unlimited CSV, Priority support\n• API access + All platforms`

      const situationContext = limit.isPro
        ? `User asked about plans. On paid plan (${limit.plan}). Thank them warmly.`
        : `User asked about plans. FREE plan, used ${limit.used}/${limit.limit} (${limit.remaining} left). Show plans.`

      aiReply = await generateNaturalReply(situationContext, incomingMessage, conversationHistory)
      aiReply = `${aiReply}\n\n${plansInfo}\n\n💬 Say *"upgrade to Starter"* or *"upgrade to Plus"* and I'll send your invoice + payment link instantly! 😊`

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
      })
      await sendWhatsAppMessage(from, aiReply)
      return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
    }

    // ── Scrape request ────────────────────────────────────────────────────────
    if (intent === 'scrape_request') {
      const limit = await checkLimit(from)

      if (limit.isLimitReached) {
        const situationContext = `User hit free limit of ${limit.limit} companies (used ${limit.used}). Tell them politely and say they can type "upgrade to Starter" or "upgrade to Plus".`
        aiReply = await generateNaturalReply(situationContext, incomingMessage, conversationHistory)
        await prisma.whatsAppMessage.create({
          data: { from, customerMessage: incomingMessage, aiReply, status: 'LIMIT_EXCEEDED' },
        })
        await sendWhatsAppMessage(from, aiReply)
        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
      }

      let startSituation = `User asked to scrape: "${incomingMessage}". Search just started, takes 1-2 minutes.`
      if (limit.isNearLimit) {
        startSituation += ` Gently mention they only have ${limit.remaining} free companies left.`
      }

      aiReply = await generateNaturalReply(startSituation, incomingMessage, conversationHistory)

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
      })
      await sendWhatsAppMessage(from, aiReply)

      scrapeCompanies(incomingMessage).then(async (results) => {
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
            } catch (e) { }
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

          let resultSituation = `Found ${cappedResults.length} companies for "${incomingMessage}". Do NOT include any link or URL — added by system. `
          if (!limit.isPro && allowedCount < results.length) {
            resultSituation += `Found ${results.length} total but only ${allowedCount} due to free limit. Mention "upgrade to Starter" or "upgrade to Plus" (no link).`
          } else if (updatedLimit.isLimitReached) {
            resultSituation += `Used up all free companies. Mention "upgrade to Starter" or "upgrade to Plus" (no link).`
          } else if (updatedLimit.isNearLimit) {
            resultSituation += `Only ${updatedLimit.remaining} left. Gentle heads-up only.`
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
          const noResultsSituation = `No results for "${incomingMessage}". Suggest more specific search like "IT companies in New York".`
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

      return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })

    } else {
      // ── general_chat ──────────────────────────────────────────────────────
      const limit = await checkLimit(from)

      const generalSituation = limit.isNearLimit
        ? `User sent a message. Respond warmly. Gently mention they have ${limit.remaining} free companies left if natural.`
        : `User sent a message. If greeting like "hi/hello/hey/hlo", greet them warmly. Be helpful. Do NOT mention upgrading.`

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a warm, polite, professional assistant for ScrapeEngine — a business email scraping service on WhatsApp.

IMPORTANT RULES:
- ALWAYS reply warmly to ANY message including greetings
- Keep replies under 100 words
- Never push upgrades unless user asks
- Never use idioms like "I'm all ears", "shoot", "fire away", "you've got it" — speak naturally and simply
- Never say "I'm all ears" or similar phrases
- ScrapeEngine finds business emails and company data
- Free users get 100 companies total
- To upgrade: say "upgrade to Starter" or "upgrade to Plus"
- Always be helpful and to the point`,
          },
          ...conversationHistory,
          { role: 'user', content: `${generalSituation}\n\nUser's message: "${incomingMessage}"` },
        ],
        max_tokens: 200,
      })

      aiReply = completion.choices[0].message.content ||
        `Hi there! 👋 Welcome to ScrapeEngine! I help you find business emails and company data. Just tell me what companies you're looking for! 😊`

      await prisma.whatsAppMessage.create({
        data: { from, customerMessage: incomingMessage, aiReply, status: 'SUCCESS' },
      })

      await sendWhatsAppMessage(from, aiReply)
      return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
    }

  } catch (error: any) {
    console.error('❌ WhatsApp webhook error:', error.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}