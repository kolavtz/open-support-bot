import OpenAI from "openai";

export function openRouterProvider() {
  const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  });

  return {
    async chat({ model, messages }) {
      const response = await client.chat.completions.create({
        model: model || process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        messages
      });

      return {
        message: response.choices?.[0]?.message?.content || "",
        usage: response.usage || null
      };
    }
  };
}
