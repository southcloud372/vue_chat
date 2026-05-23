const API_BASE = 'https://token-plan-ams.xiaomimimo.com/v1'
const API_KEY = 'tp-eslxi7tjiqzvxux1h4kvc8dfaotjpsyyn6381n1cdvt7iohn'
const MODEL = 'mimo-v2.5-pro'

export async function sendMessageStream(messages, onChunk, onDone, onError) {
  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4096
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API请求失败: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') {
          onDone()
          return
        }
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) onChunk(content)
          if (parsed.choices?.[0]?.finish_reason === 'stop') {
            onDone()
            return
          }
        } catch {}
      }
    }
    onDone()
  } catch (err) {
    onError(err.message)
  }
}
