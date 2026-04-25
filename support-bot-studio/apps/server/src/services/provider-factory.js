import { openAIProvider } from "./providers/openai.js";
import { openRouterProvider } from "./providers/openrouter.js";
import { anthropicProvider } from "./providers/anthropic.js";
import { localProvider } from "./providers/local.js";

export function getProviderClient(provider) {
  switch (provider) {
    case "openai":
      return openAIProvider();
    case "openrouter":
      return openRouterProvider();
    case "anthropic":
    case "claude":
      return anthropicProvider();
    case "local":
    case "ollama":
    case "lmstudio":
      return localProvider();
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
