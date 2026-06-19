import { config } from 'dotenv'
import { LlmAgent, MCPToolset, type ToolUnion } from '@google/adk'

config({ path: '.env.local', quiet: true })

const bizdexMcpUrl = process.env.BIZDEX_MCP_URL
const bizdexApiKey = process.env.BIZDEX_API_KEY

const tools: ToolUnion[] = []

if (bizdexMcpUrl && bizdexApiKey) {
  tools.push(
    new MCPToolset(
      {
        type: 'StreamableHTTPConnectionParams',
        url: bizdexMcpUrl,
        transportOptions: {
          requestInit: {
            headers: {
              Authorization: `Bearer ${bizdexApiKey}`,
              Accept: 'application/json, text/event-stream',
            },
          },
        },
      },
      undefined,
      'bizdex',
    ),
  )
}

export const rootAgent = new LlmAgent({
  name: 'bizdex_mcp_test_agent',
  model: process.env.ADK_MODEL ?? 'gemini-flash-latest',
  description: 'A simple ADK agent for Bizdex MCP experiments.',
  instruction:
    'You are a concise assistant for prototyping Bizdex agent behavior. When Bizdex tools are available, use them for network, company, intent, and account-context questions.',
  tools,
})
