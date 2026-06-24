import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, Minimize2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { aiCopilotResponses } from '@/data/mockData'
import type { ChatMessage } from '@/types'

let msgId = 0
const nextId = () => `msg-${++msgId}`

const initialMessages: ChatMessage[] = [
  {
    id: nextId(),
    role: 'ai',
    content: aiCopilotResponses.default,
    time: 'Just now',
  },
]

export default function AICopilot() {
  const { isAICopilotOpen, setAICopilotOpen } = useAppStore()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: input,
      time: 'Just now',
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const lower = input.toLowerCase()
      let response = aiCopilotResponses.default
      if (lower.includes('stock') || lower.includes('inventory')) response = aiCopilotResponses.stock
      else if (lower.includes('sale') || lower.includes('revenue') || lower.includes('today')) response = aiCopilotResponses.sales
      else if (lower.includes('expir')) response = aiCopilotResponses.expiry
      else if (lower.includes('profit') || lower.includes('margin')) response = aiCopilotResponses.profit
      const aiMsg: ChatMessage = { id: nextId(), role: 'ai', content: response, time: 'Just now' }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isAICopilotOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAICopilotOpen(true)}
            className="floating-btn animate-bounce-soft relative"
            style={{ zIndex: 100 }}
          >
            <Sparkles className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isAICopilotOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 right-6 w-80 rounded-2xl shadow-floating overflow-hidden z-[100] flex flex-col"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              height: '440px',
            }}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between flex-shrink-0" style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">MediFlow AI</p>
                  <p className="text-xs text-white/70">Your pharmacy copilot</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setAICopilotOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  onClick={() => setAICopilotOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-gradient-primary text-white'
                        : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                    }`}
                    style={msg.role === 'ai' ? { color: 'var(--text-secondary)' } : {}}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="px-3 py-3 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto flex-shrink-0">
              {['Stock status', 'Today sales', 'Expiry alert', 'Profit'].map((p) => (
                <button
                  key={p}
                  onClick={() => { setInput(p); }}
                  className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    color: '#6366f1',
                    border: '1px solid rgba(99,102,241,0.2)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 pt-0 flex-shrink-0">
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'var(--input-bg)', border: '1.5px solid var(--border)' }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent outline-none text-xs"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
