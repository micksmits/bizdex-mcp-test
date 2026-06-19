# Bizdex MCP Test

Clean Hono API project for prototyping Google ADK before adding MCP.

## Setup

```sh
pnpm install
pnpm dev
```

Set `GEMINI_API_KEY` in `.env.local` first. Optional: change `ADK_MODEL` there.

To enable Bizdex MCP, also set `BIZDEX_API_KEY`. `BIZDEX_MCP_URL` defaults to the local Bizdex API MCP endpoint.

## Generate

```sh
curl -X POST http://localhost:3000/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Write one sentence about Bizdex."}'
```

With the Bizdex API running and `BIZDEX_API_KEY` set:

```sh
curl -X POST http://localhost:3000/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Use Bizdex to return my account context."}'
```

The response is JSON with:

```json
{
  "text": "final model response",
  "json": null,
  "events": []
}
```

Bizdex MCP tool outputs are included in `events[].toolResponses`.

## Devtools

```sh
npx adk run src/agent.ts
npx adk web
```

## Scripts

```sh
pnpm dev
pnpm build
pnpm start
```
