# Support Bot Studio

A modular, multi-provider support bot system.

## Project Structure

- `apps/server`: Node.js Express backend proxy.
- `apps/widget`: Vanilla JS embeddable chat widget.
- `packages/shared`: Shared constants and utilities.

## Setup

### Backend

1. Navigate to `apps/server`.
2. Install dependencies: `npm install`.
3. Create a `.env.local` file (or `.env`) from `.env.example`. 
   - Note: `.env.local` is prioritized and is ignored by git to prevent credential leaks.
4. Add your API keys (OpenAI, OpenRouter, or Anthropic) OR configure a local model (LM Studio/Ollama).
   - For local models, set `LOCAL_MODEL_BASE_URL` (e.g., `http://localhost:11434/v1` for Ollama).
5. Start the server: `npm run dev`.

### Widget

1. The widget is located in `apps/widget/embed.js`.
2. To test locally, open `apps/widget/demo.html`.

## Deployment

1. Deploy the `apps/server` to a host like Railway, Render, or Fly.io.
2. Serve `embed.js` from a CDN or static hosting.
3. Use the embed script on your target website.

```html
<script
  src="https://your-cdn.com/embed.js"
  data-bot-id="your-bot-id"
  data-api-base="https://your-api.com"
  data-provider="openai"
  data-color="#01696f"
  defer
></script>
```
