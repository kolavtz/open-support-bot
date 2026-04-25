import Anthropic from "@anthropic-ai/sdk";

export function anthropicProvider() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  return {
    async chat({ model, messages }) {
      const system = messages.find(m => m.role === "system")?.content || "";
      const chatMessages = messages.filter(m => m.role !== "system");

      const response = await client.messages.create({
        model: model || process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 1024,
        system,
        messages: chatMessages.map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content
        }))
      });

      const text = response.content
        ?.filter(item => item.type === "text")
        ?.map(item => item.text)
        ?.join("\n") || "";

      return {
        message: text,
        usage: response.usage || null
      };
    }
  };
}
