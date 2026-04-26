import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      // basic safety: cap at 256KB
      if (data.length > 256 * 1024) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

function coachApiPlugin() {
  return {
    name: 'goaura-coach-api',
    configureServer(server) {
      server.middlewares.use('/api/coach', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const apiKey = process.env.DASHSCOPE_API_KEY || process.env.ALIBABA_API_KEY
          if (!apiKey) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing DASHSCOPE_API_KEY (or ALIBABA_API_KEY) in server env' }))
            return
          }

          const baseUrl = (process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1').replace(/\/$/, '')
          const model = process.env.DASHSCOPE_MODEL || 'qwen-plus'

          const raw = await readRequestBody(req)
          const body = raw ? JSON.parse(raw) : {}
          const persona = body?.persona || {}
          const walletContext = body?.walletContext || {}
          const userText = String(body?.text || '').trim()
          if (!userText) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing text' }))
            return
          }

          const system = [
            "You are GOAura Coach inside Touch 'n Go eWallet (Malaysia).",
            'Goal: give short, practical, personalised financial tips and next-best actions based on wallet spending patterns.',
            'Be specific in RM amounts and actions (activate cashback, claim aid, set bill pay, repay micro-credit).',
            'Formatting requirements:',
            '- Start with a friendly greeting with the user name and a 1-line summary.',
            '- Then a blank line and 2–4 bullet points (each bullet is a concrete action with where-to-tap steps).',
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

          const json = await response.json().catch(() => ({}))
          if (!response.ok) {
            res.statusCode = response.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: json?.error?.message || json?.message || 'DashScope request failed' }))
            return
          }

          const text = json?.choices?.[0]?.message?.content
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ text: typeof text === 'string' ? text : '' }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load `.env*` files into `process.env` for dev middleware usage.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  const localEmulatorProxy = process.env.GOAURA_FUNCTIONS_PROXY

  return {
    plugins: [react(), coachApiPlugin()],
    base: './',
    // Optional: proxy only our Functions API routes (NOT `/api/coach`) to the local emulator.
    server: localEmulatorProxy
      ? {
          proxy: {
            '/api/users': {
              target: localEmulatorProxy,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/api/health': {
              target: localEmulatorProxy,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        }
      : undefined,
  }
})
