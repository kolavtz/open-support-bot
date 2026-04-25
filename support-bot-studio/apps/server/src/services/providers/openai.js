import OpenAI from "openai";

export function openAIProvider() {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return {
    async chat({ model, messages }) {
      const response = await client.chat.completions.create({
        model: model || process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages
      });

      return {
        message: response.choices?.[0]?.message?.content || "",
        usage: response.usage || null
      };
    }
  };
}
