const DEFAULT_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
const DEFAULT_MODEL = 'qwen-plus'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  if (method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  try {
    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return jsonResponse(500, { error: 'Missing DASHSCOPE_API_KEY' })
    }

    const body = parseBody(event)
    const persona = body?.persona || {}
    const walletContext = body?.walletContext || {}
    const userText = String(body?.text || '').trim()

    if (!userText) {
      return jsonResponse(400, { error: 'Missing text' })
    }

    const baseUrl = (process.env.DASHSCOPE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
    const model = process.env.DASHSCOPE_MODEL || DEFAULT_MODEL
    const system = [
      "You are GOAura Coach inside Touch 'n Go eWallet (Malaysia).",
      'Goal: give short, practical, personalised financial tips and next-best actions based on wallet spending patterns.',
      'Be specific in RM amounts and actions (activate cashback, claim aid, set bill pay, repay micro-credit).',
      'Formatting requirements:',
      '- Start with a friendly greeting with the user name and a 1-line summary.',
      '- Then a blank line and 2-4 bullet points (each bullet is a concrete action with where-to-tap steps).',
      '- Then a short closing question (1 line).',
      'Use **bold** for button/menu labels and *italics* for emphasis.',
      `Persona: ${persona?.name || 'User'} (${persona?.badge || 'TNG user'}).`,
      walletContext?.spendMonthly ? `Context: approx spend RM ${walletContext.spendMonthly}/month.` : null,
      walletContext?.potentialMonthly ? `Context: potential saves RM ${walletContext.potentialMonthly}/month.` : null,
    ].filter(Boolean).join('\n')

    const messages = [
      { role: 'system', content: system },
      ...(Array.isArray(body?.history) ? body.history : [])
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-12),
      { role: 'user', content: userText },
    ]

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
      }),
    })

    const dashScopeJson = await response.json().catch(() => ({}))
    if (!response.ok) {
      return jsonResponse(response.status, {
        error: dashScopeJson?.error?.message || dashScopeJson?.message || 'DashScope request failed',
      })
    }

    const text = dashScopeJson?.choices?.[0]?.message?.content
    return jsonResponse(200, { text: typeof text === 'string' ? text : '' })
  } catch (err) {
    return jsonResponse(500, { error: err?.message || 'Server error' })
  }
}

function parseBody(event) {
  if (!event.body) return {}
  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body
  return JSON.parse(body)
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
