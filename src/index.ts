import { config } from 'dotenv'

config({ path: '.env.local', quiet: true })

import { serve } from '@hono/node-server'
import {
  getFunctionCalls,
  getFunctionResponses,
  InMemoryRunner,
  isFinalResponse,
  stringifyContent,
  type Event,
} from '@google/adk'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { rootAgent } from './agent.js'

const app = new Hono()
const runner = new InMemoryRunner({
  agent: rootAgent,
  appName: 'bizdex-mcp-test',
})

app.use('*', cors())

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

const generateSchema = z.object({
  prompt: z.string().min(1),
})

function parseJson(value: string) {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

function serializeEvent(event: Event) {
  const text = stringifyContent(event)

  return {
    id: event.id,
    author: event.author,
    final: isFinalResponse(event),
    text,
    json: text ? parseJson(text) : null,
    toolCalls: getFunctionCalls(event),
    toolResponses: getFunctionResponses(event),
  }
}

app.post('/generate', zValidator('json', generateSchema), async (c) => {
  const { prompt } = c.req.valid('json')
  let text = ''
  let json: unknown = null
  const events: ReturnType<typeof serializeEvent>[] = []

  for await (const event of runner.runEphemeral({
    userId: 'local-user',
    newMessage: { role: 'user', parts: [{ text: prompt }] },
  })) {
    const serialized = serializeEvent(event)
    events.push(serialized)

    if (isFinalResponse(event)) {
      text = stringifyContent(event)
      json = text ? parseJson(text) : null
    }
  }

  return c.json({ text, json, events })
})

const port = Number(process.env.PORT ?? 3015) // i got 80 things running, commenting so you notice this lol

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
