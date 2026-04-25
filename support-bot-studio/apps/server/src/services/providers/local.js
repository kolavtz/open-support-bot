import OpenAI from "openai";

export function localProvider() {
  const client = new OpenAI({
    apiKey: process.env.LOCAL_MODEL_API_KEY || "not-needed",
    baseURL: process.env.LOCAL_MODEL_BASE_URL || "http://localhost:1234/v1" // Default for LM Studio
  });

  return {
    async chat({ model, messages }) {
      const response = await client.chat.completions.create({
        model: model || process.env.LOCAL_MODEL_NAME || "local-model",
        messages
      });

      return {
        message: response.choices?.[0]?.message?.content || "",
        usage: response.usage || null
      };
    }
  };
}
