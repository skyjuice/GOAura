import React, { useState, useRef, useEffect } from 'react'
import './CoachScreen.css'

function renderInline(text) {
  const parts = []
  let i = 0

  const pushText = (value) => {
    if (!value) return
    parts.push(value)
  }

  while (i < text.length) {
    const boldStart = text.indexOf('**', i)
    const italicStart = text.indexOf('*', i)

    const next = [boldStart, italicStart].filter(n => n !== -1).sort((a, b) => a - b)[0]
    if (next === undefined) {
      pushText(text.slice(i))
      break
    }

    if (next > i) pushText(text.slice(i, next))

    if (next === boldStart) {
      const end = text.indexOf('**', boldStart + 2)
      if (end === -1) {
        pushText(text.slice(boldStart))
        break
      }
      const content = text.slice(boldStart + 2, end)
      parts.push(<strong key={`b-${parts.length}`}>{content}</strong>)
      i = end + 2
      continue
    }

    // italic: single *...* (avoid ** handled above)
    if (next === italicStart) {
      // if this is actually '**' we already handled via boldStart, so skip
      if (text.slice(italicStart, italicStart + 2) === '**') {
        i = italicStart + 2
        continue
      }
      const end = text.indexOf('*', italicStart + 1)
      if (end === -1) {
        pushText(text.slice(italicStart))
        break
      }
      const content = text.slice(italicStart + 1, end)
      parts.push(<em key={`i-${parts.length}`}>{content}</em>)
      i = end + 1
      continue
    }
  }

  return parts
}

function renderMessageText(text) {
  const lines = String(text || '').split('\n')
  const blocks = []
  let bulletBuffer = []
  let paraBuffer = []

  const flushPara = () => {
    if (!paraBuffer.length) return
    const content = paraBuffer.join(' ').trim()
    if (content) blocks.push({ type: 'p', text: content })
    paraBuffer = []
  }

  const flushBullets = () => {
    if (!bulletBuffer.length) return
    blocks.push({ type: 'ul', items: bulletBuffer })
    bulletBuffer = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()
    const bulletMatch = trimmed.match(/^([-•])\s+/)
    const isBullet = !!bulletMatch

    if (!trimmed) {
      flushPara()
      flushBullets()
      continue
    }

    if (isBullet) {
      flushPara()
      bulletBuffer.push(trimmed.replace(/^([-•])\s+/, ''))
      continue
    }

    // Continuation line for a bullet (model sometimes wraps with indentation)
    if ((rawLine.startsWith(' ') || rawLine.startsWith('\t')) && bulletBuffer.length) {
      bulletBuffer[bulletBuffer.length - 1] += ` ${trimmed}`
      continue
    }

    flushBullets()
    paraBuffer.push(trimmed)
  }

  flushPara()
  flushBullets()

  return blocks.map((b, idx) => {
    if (b.type === 'ul') {
      return (
        <ul key={`ul-${idx}`}>
          {b.items.map((item, i) => (
            <li key={`li-${idx}-${i}`}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    }
    return <p key={`p-${idx}`}>{renderInline(b.text)}</p>
  })
}

const SITI_OPENING = [
  { from: 'ai', text: "Hi Siti! I've scanned 6 months of your TNG transactions. You're spending RM 1,650/month but leaving RM 308 on the table every month. Let me show you exactly where." },
  { from: 'ai', text: "Medical: RM 180/month → MySejahtera covers this at RM 1/visit.\nChildren: 2 kids → BSH child supplement RM 240/year not yet claimed.\nGroceries: RM 520/month → Rahmah Menu cashback not activated.", type: 'highlight' },
]

const AHMAD_OPENING = [
  { from: 'ai', text: "Ahmad, you've been driving with Grab for 18 months — 340 TNG transactions. I've built you a financial identity." },
  { from: 'ai', text: "Fuel: RM 680/month at 4 stations → PETRONAS Shell on Jln Duta gives 8% back vs 3% elsewhere. That's RM 40 extra per month.\nCredit: You qualify for RM 300 micro-credit. Each repayment raises your TNG Score.", type: 'highlight' },
]

const SITI_REPLIES = {
  'How do I claim MySejahtera?': "I've pre-filled your MySejahtera application using your TNG profile. Nearest panel clinic: Klinik Maju Klang, 0.8km away. Your RM 180/month medical spend drops to RM 2/visit — saving RM 26/month. Go to Benefits tab to activate.",
  'Apply for BSH':               "Your BSH application is 80% pre-filled from your TNG + MyKad data. I just need your bank account to process the RM 240/year payout. Tap 'Apply' in the Benefits tab to complete in 2 minutes.",
  'Save on groceries':           "Switch from cash to TNG Pay at Giant or Mydin. Rahmah Menu pricing + 3% cashback applies automatically. On your RM 520/month grocery spend, that's RM 15.60 back every month with zero effort.",
}

const AHMAD_REPLIES = {
  'Raise my TNG Score':    "Top actions: 1) Pay Grab insurance via TNG (+25 pts) 2) Set auto bill pay for Unifi (+30 pts) 3) Repay micro-credit early (+40 pts). You could hit 760 in 6 weeks — that's bank account pre-approval territory.",
  'Tell me about micro-credit': "You qualify for RM 300 at 0.8%/month — that's RM 2.40 interest per month. Repayments auto-deduct from your TNG wallet on payday. Every on-time repayment raises your score by ~15 pts.",
  'Am I insured?':         "Yes! You have Personal Accident cover up to RM 10,000 — active since you crossed 100 transactions. No premium needed. Coverage renews as long as you stay active on TNG.",
}

const FALLBACK = "Let me check your transaction history for that... Based on your recent spending patterns, I'll personalise the best recommendation for you."
const TEMP_DASHSCOPE_CONFIG = {
  apiKey: 'DASHSCOPE_API_KEY_PLACEHOLDER',
  baseUrl: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
}
const COACH_API_URL = import.meta.env.VITE_COACH_API_URL || '/api/coach'

export default function CoachScreen({ persona }) {
  const isSiti = persona.id === 'siti'
  const opening = isSiti ? SITI_OPENING : AHMAD_OPENING
  const quickReplies = isSiti
    ? ['How do I claim MySejahtera?', 'Apply for BSH', 'Save on groceries']
    : ['Raise my TNG Score', 'Tell me about micro-credit', 'Am I insured?']
  const replyMap = isSiti ? SITI_REPLIES : AHMAD_REPLIES

  const walletContext = persona.id === 'siti'
    ? { spendMonthly: 1650, potentialMonthly: 308 }
    : { spendMonthly: 2100, potentialMonthly: 144 }

  const [messages, setMessages] = useState(opening)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [liveCoachStatus, setLiveCoachStatus] = useState('unknown') // unknown | ok | demo
  const logRef = useRef(null)

  useEffect(() => {
    setMessages(opening)
    setLiveCoachStatus('unknown')
  }, [persona.id])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, typing])

  const callLiveCoach = async (text) => {
    const history = messages
      .filter(m => m.from === 'user' || m.from === 'ai')
      .slice(-10)
      .map(m => ({
        role: m.from === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))

    const res = await fetch(COACH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        persona: { id: persona.id, name: persona.name, badge: persona.badge },
        walletContext,
        text,
        history,
      }),
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = typeof json?.error === 'string' ? json.error : 'coach api failed'
      throw new Error(msg)
    }
    const reply = typeof json?.text === 'string' ? json.text.trim() : ''
    if (!reply) throw new Error('empty coach reply')
    return reply
  }

  const sendMessage = async (text) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')
    setTyping(true)

    // Prefer live coach (server-side DashScope) when available; otherwise fall back to canned demo replies.
    try {
      const reply = await callLiveCoach(text)
      setLiveCoachStatus('ok')
      setMessages(prev => [...prev, { from: 'ai', text: reply }])
    } catch {
      setLiveCoachStatus('demo')
      setTimeout(() => {
        const reply = replyMap[text] || FALLBACK
        setMessages(prev => [...prev, { from: 'ai', text: reply }])
      }, 350)
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="coach-screen">
      <div className="coach-header">
        <div className="coach-header-title">
          {isSiti ? 'B40 Financial Coach' : 'Financial Inclusion Coach'}
        </div>
        <div className="coach-header-sub">
          {isSiti
            ? 'Finds government aid you qualify for but haven\'t claimed'
            : 'Helping build credit history from your TNG transactions'}
        </div>
        {liveCoachStatus === 'demo' && (
          <div className="coach-header-sub" style={{ marginTop: 6, opacity: 0.9 }}>
            Live Coach not configured — using demo replies (set <strong>TEMP_DASHSCOPE_CONFIG.apiKey</strong> in <strong>.env.local</strong> and restart).
          </div>
        )}
      </div>

      <div className="chat-log" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg-wrap ${m.from === 'user' ? 'user' : 'ai'}`}>
            {m.from === 'ai' && (
              <div className="ai-avatar" style={{ background: persona.accentColor }}>AI</div>
            )}
            <div className={`bubble ${m.from} ${m.type === 'highlight' ? 'highlight' : ''}`}>
              {renderMessageText(m.text)}
            </div>
          </div>
        ))}
        {typing && (
          <div className="msg-wrap ai">
            <div className="ai-avatar" style={{ background: persona.accentColor }}>AI</div>
            <div className="bubble ai typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      <div className="quick-replies">
        {quickReplies.map(q => (
          <button
            key={q}
            className="quick-reply-btn"
            style={{ borderColor: persona.accentColor, color: persona.accentColor }}
            onClick={() => sendMessage(q)}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask about any benefit or aid..."
        />
        <button
          className="send-btn"
          style={{ background: persona.accentColor }}
          onClick={() => sendMessage(input)}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
