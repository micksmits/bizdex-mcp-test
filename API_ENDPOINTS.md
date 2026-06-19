# API Endpoints

## GET /health

Health check.

Response 200: `{ "status": "ok" }`

## POST /generate

Runs the ADK agent once and returns generated text.

Body: `{ "prompt": string }`

Response 200: `{ "text": string, "json": unknown | null, "events": Event[] }`

`events` includes ADK tool calls and tool responses. Bizdex MCP tool responses are returned in the `toolResponses` entries, preserving their structured JSON payloads when ADK emits them.

Runtime env: `GEMINI_API_KEY` is required. Optional: set `ADK_MODEL` to override `gemini-flash-latest`.

Bizdex MCP env: set `BIZDEX_API_KEY` and `BIZDEX_MCP_URL` to expose Bizdex MCP tools to the ADK agent. Tools are prefixed with `bizdex_`.
