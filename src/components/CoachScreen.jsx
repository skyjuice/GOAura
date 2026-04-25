import React, { useState, useRef, useEffect } from 'react'
import './CoachScreen.css'

const SITI_OPENING = [
  { from: 'ai', text: "Hi Siti! I've scanned 6 months of your TNG transactions. You're spending RM 1,650/month but leaving RM 308 on the table every month. Let me show you exactly where." },
  { from: 'ai', text: "Medical: RM 180/month → MySejahtera covers this at RM 1/visit.\nChildren: 2 kids → BSH child supplement RM 240/year not yet claimed.\nGroceries: RM 520/month → Rahmah Menu cashback not activated.", type: 'highlight' },
]

const AHMAD_OPENING = [
  { from: 'ai', text: "Ahmad, you've been driving with Grab for 18 months — 340 TNG transactions. I've built you a financial identity. No bank account needed." },
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

export default function CoachScreen({ persona }) {
  const isSiti = persona.id === 'siti'
  const opening = isSiti ? SITI_OPENING : AHMAD_OPENING
  const quickReplies = isSiti
    ? ['How do I claim MySejahtera?', 'Apply for BSH', 'Save on groceries']
    : ['Raise my TNG Score', 'Tell me about micro-credit', 'Am I insured?']
  const replyMap = isSiti ? SITI_REPLIES : AHMAD_REPLIES

  const [messages, setMessages] = useState(opening)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const logRef = useRef(null)

  useEffect(() => {
    setMessages(opening)
  }, [persona.id])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, typing])

  const sendMessage = (text) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = replyMap[text] || FALLBACK
      setMessages(prev => [...prev, { from: 'ai', text: reply }])
      setTyping(false)
    }, 700)
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
      </div>

      <div className="chat-log" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg-wrap ${m.from === 'user' ? 'user' : 'ai'}`}>
            {m.from === 'ai' && (
              <div className="ai-avatar" style={{ background: persona.accentColor }}>AI</div>
            )}
            <div className={`bubble ${m.from} ${m.type === 'highlight' ? 'highlight' : ''}`}>
              {m.text.split('\n').map((line, li) => (
                <p key={li}>{line}</p>
              ))}
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
