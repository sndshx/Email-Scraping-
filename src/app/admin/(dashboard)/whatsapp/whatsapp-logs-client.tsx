'use client'

import React, { useState, useMemo } from 'react'
import { 
  Search, 
  MessageSquare, 
  User as UserIcon, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  ChevronRight,
  Database,
  Hash,
  Activity
} from 'lucide-react'

interface WhatsAppMessageData {
  id: number
  from: string
  customerMessage: string
  aiReply: string
  status: string
  createdAt: string | Date
}

interface WhatsAppUserData {
  id: string
  phoneNumber: string
  plan: string
  stripeCustomerId: string | null
  subscriptionId: string | null
  scrapeCount: number
  trialEndsAt: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
}

interface WebUserData {
  id: number
  name: string
  email: string
  whatsappNumber: string | null
  plan: string
}

interface WhatsAppLogsClientProps {
  initialUsers: WhatsAppUserData[]
  initialMessages: WhatsAppMessageData[]
  webUsers: WebUserData[]
}

// Normalize phone numbers for matching
function getPhoneMatchKey(num: string | null): string {
  if (!num) return ''
  const digitsOnly = num.replace(/[^\d]/g, '')
  return digitsOnly.slice(-10) // match last 10 digits
}

// Clean phone number for presentation (strips "whatsapp:")
function formatPhoneNumber(num: string): string {
  return num.replace(/^whatsapp:/i, '')
}

export default function WhatsAppLogsClient({
  initialUsers,
  initialMessages,
  webUsers,
}: WhatsAppLogsClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)

  // Map Web Users by their normalized phone number for O(1) lookup
  const webUserMap = useMemo(() => {
    const map = new Map<string, WebUserData>()
    webUsers.forEach(u => {
      if (u.whatsappNumber) {
        const key = getPhoneMatchKey(u.whatsappNumber)
        if (key) map.set(key, u)
      }
    })
    return map
  }, [webUsers])

  // Group messages by phone number
  const groupedMessages = useMemo(() => {
    const map = new Map<string, WhatsAppMessageData[]>()
    initialMessages.forEach(msg => {
      const phone = msg.from
      if (!map.has(phone)) {
        map.set(phone, [])
      }
      map.get(phone)!.push(msg)
    })
    return map
  }, [initialMessages])

  // Create list of active WhatsApp chat sessions
  const chatUsers = useMemo(() => {
    const usersMap = new Map<string, {
      phoneNumber: string
      plan: string
      scrapeCount: number
      stripeCustomerId: string | null
      subscriptionId: string | null
      trialEndsAt: Date | null
      createdAt: Date
      updatedAt: Date
      lastMessageAt: Date
      lastMessageText: string
      lastMessageStatus: string
      messagesCount: number
    }>()

    // 1. Load data from WhatsAppUser records
    initialUsers.forEach(u => {
      const msgs = groupedMessages.get(u.phoneNumber) || []
      const sortedMsgs = [...msgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      const lastMsg = sortedMsgs[sortedMsgs.length - 1]

      usersMap.set(u.phoneNumber, {
        phoneNumber: u.phoneNumber,
        plan: u.plan,
        scrapeCount: u.scrapeCount,
        stripeCustomerId: u.stripeCustomerId,
        subscriptionId: u.subscriptionId,
        trialEndsAt: u.trialEndsAt ? new Date(u.trialEndsAt) : null,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
        lastMessageAt: lastMsg ? new Date(lastMsg.createdAt) : new Date(u.updatedAt),
        lastMessageText: lastMsg ? lastMsg.customerMessage : 'No messages',
        lastMessageStatus: lastMsg ? lastMsg.status : 'SUCCESS',
        messagesCount: msgs.length,
      })
    })

    // 2. Add any numbers that have messages but no WhatsAppUser record
    groupedMessages.forEach((msgs, phone) => {
      if (!usersMap.has(phone)) {
        const sortedMsgs = [...msgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        const lastMsg = sortedMsgs[sortedMsgs.length - 1]
        const firstMsg = sortedMsgs[0]

        usersMap.set(phone, {
          phoneNumber: phone,
          plan: 'free',
          scrapeCount: 0,
          stripeCustomerId: null,
          subscriptionId: null,
          trialEndsAt: null,
          createdAt: firstMsg ? new Date(firstMsg.createdAt) : new Date(),
          updatedAt: lastMsg ? new Date(lastMsg.createdAt) : new Date(),
          lastMessageAt: lastMsg ? new Date(lastMsg.createdAt) : new Date(),
          lastMessageText: lastMsg ? lastMsg.customerMessage : 'No messages',
          lastMessageStatus: lastMsg ? lastMsg.status : 'SUCCESS',
          messagesCount: msgs.length,
        })
      }
    })

    // Convert map to array and sort by lastMessageAt descending
    return Array.from(usersMap.values()).sort(
      (a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
    )
  }, [initialUsers, groupedMessages])

  // Filter users based on search term (matches number or web user name/email)
  const filteredChatUsers = useMemo(() => {
    if (!searchTerm.trim()) return chatUsers

    const term = searchTerm.toLowerCase()
    return chatUsers.filter(u => {
      const matchKey = getPhoneMatchKey(u.phoneNumber)
      const linkedUser = webUserMap.get(matchKey)
      
      const phoneMatch = u.phoneNumber.toLowerCase().includes(term)
      const nameMatch = linkedUser?.name.toLowerCase().includes(term) || false
      const emailMatch = linkedUser?.email.toLowerCase().includes(term) || false

      return phoneMatch || nameMatch || emailMatch
    })
  }, [chatUsers, searchTerm, webUserMap])

  // Get active selected user
  const activeUser = useMemo(() => {
    if (!selectedPhone) return null
    return chatUsers.find(u => u.phoneNumber === selectedPhone) || null
  }, [chatUsers, selectedPhone])

  // Get active messages, sorted chronologically (oldest to newest)
  const activeMessages = useMemo(() => {
    if (!selectedPhone) return []
    const msgs = groupedMessages.get(selectedPhone) || []
    return [...msgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [groupedMessages, selectedPhone])

  // Get matching web user details for the active user
  const activeLinkedWebUser = useMemo(() => {
    if (!selectedPhone) return null
    const matchKey = getPhoneMatchKey(selectedPhone)
    return webUserMap.get(matchKey) || null
  }, [selectedPhone, webUserMap])

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[550px]">
      
      {/* LEFT: Search and Chat List */}
      <div className="w-full lg:w-80 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150"
            />
          </div>
        </div>

        {/* List of Users */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredChatUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              No chat sessions found
            </div>
          ) : (
            filteredChatUsers.map((u) => {
              const cleanNum = formatPhoneNumber(u.phoneNumber)
              const matchKey = getPhoneMatchKey(u.phoneNumber)
              const linkedUser = webUserMap.get(matchKey)
              const isSelected = selectedPhone === u.phoneNumber

              return (
                <button
                  key={u.phoneNumber}
                  onClick={() => setSelectedPhone(u.phoneNumber)}
                  className={`w-full text-left p-4 flex items-start gap-3 transition-colors duration-150 ${
                    isSelected 
                      ? 'bg-indigo-50/50 border-r-4 border-indigo-600' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {linkedUser ? linkedUser.name.substring(0, 2).toUpperCase() : cleanNum.substring(cleanNum.length - 2)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {linkedUser ? linkedUser.name : cleanNum}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">
                        {u.lastMessageAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xs text-slate-500 truncate font-medium flex-1">
                        {u.lastMessageText}
                      </p>
                      
                      {/* Plan Tag */}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        u.plan === 'pro'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.plan}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* RIGHT: Selected User Details & Chat Messages */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full">
        {activeUser ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header / User Info Panel */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  💬
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {formatPhoneNumber(activeUser.phoneNumber)}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      activeUser.plan === 'pro'
                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {activeUser.plan}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    WhatsApp Session • {activeUser.messagesCount} message{activeUser.messagesCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Area: Split Chat and User Info Panel */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Chat Conversation Scroll Area */}
              <div className="flex-1 flex flex-col bg-slate-50/50 overflow-y-auto p-4 space-y-4">
                {activeMessages.map((msg) => (
                  <div key={msg.id} className="space-y-4">
                    
                    {/* Customer Message */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] sm:max-w-[70%]">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 ml-1 flex items-center gap-1">
                          <UserIcon className="w-2.5 h-2.5" /> Customer
                        </div>
                        <div className="bg-white border border-slate-200 text-slate-800 text-sm rounded-2xl rounded-tl-sm p-3.5 shadow-sm leading-relaxed font-medium">
                          {msg.customerMessage}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1 ml-1">
                          {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* AI Reply */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] sm:max-w-[70%]">
                        <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-1 mr-1 flex items-center justify-end gap-1">
                          AI Assistant 
                          {msg.status === 'SUCCESS' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-500" />
                          )}
                        </div>
                        <div className="bg-indigo-600 text-white text-sm rounded-2xl rounded-tr-sm p-3.5 shadow-sm leading-relaxed font-medium">
                          {msg.aiReply}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1 mr-1 text-right">
                          {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Sidebar/Details Pane */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-100 p-6 space-y-6 overflow-y-auto bg-white flex-shrink-0">
                {/* Section 1: WhatsApp Bot Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-indigo-500" /> WhatsApp Bot Details
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Plan</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        activeUser.plan === 'pro'
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {activeUser.plan}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Scrape Count</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        {activeUser.scrapeCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Joined Bot</span>
                      <span className="text-slate-700 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {activeUser.createdAt.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Linked Web Account */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-500" /> Linked Web Account
                  </h3>
                  {activeLinkedWebUser ? (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 text-sm">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Name</div>
                        <div className="font-bold text-slate-900">{activeLinkedWebUser.name}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Email</div>
                        <div className="font-semibold text-slate-700 break-all">{activeLinkedWebUser.email}</div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Web Plan</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                          {activeLinkedWebUser.plan}
                        </span>
                      </div>
                      
                      <a
                        href={`/admin/users?search=${encodeURIComponent(activeLinkedWebUser.email)}`}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors duration-150"
                      >
                        <ExternalLink className="w-3 h-3" /> View Web Profile
                      </a>
                    </div>
                  ) : (
                    <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 text-xs text-amber-700 font-medium leading-relaxed font-sans">
                      No matching web account was found using this phone number. This user is interacting with ScrapeEngine exclusively via WhatsApp.
                    </div>
                  )}
                </div>

                {/* Section 3: Billing & Stripe Info (If Pro or Info Available) */}
                {(activeUser.stripeCustomerId || activeUser.subscriptionId) && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-purple-500" /> Stripe Billing Info
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3.5 text-xs">
                      {activeUser.stripeCustomerId && (
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Customer ID</div>
                          <code className="bg-white px-2 py-1 rounded border border-slate-200 block truncate font-mono text-[10px]">
                            {activeUser.stripeCustomerId}
                          </code>
                        </div>
                      )}
                      {activeUser.subscriptionId && (
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Subscription ID</div>
                          <code className="bg-white px-2 py-1 rounded border border-slate-200 block truncate font-mono text-[10px]">
                            {activeUser.subscriptionId}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
            <p className="font-semibold">No Conversation Selected</p>
            <p className="text-xs mt-1 max-w-xs leading-relaxed">
              Select a phone number or contact from the sidebar list to view their full WhatsApp logs, bot usage, and linked accounts.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
