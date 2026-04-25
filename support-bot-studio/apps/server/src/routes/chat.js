import { Router } from "express";
import { getProviderClient } from "../services/provider-factory.js";
import { buildMessages } from "../services/prompt-builder.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      provider = process.env.DEFAULT_PROVIDER || "openai",
      botId,
      messages = [],
      siteContext = "",
      systemPrompt = "You are a helpful website support assistant.",
      model
    } = req.body;

    if (!botId) {
      return res.status(400).json({ error: "botId is required" });
    }

    const client = getProviderClient(provider);
    const inputMessages = buildMessages({ systemPrompt, siteContext, messages });

    const result = await client.chat({
      model,
      messages: inputMessages
    });

    res.json({
      ok: true,
      provider,
      message: result.message,
      usage: result.usage || null
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Unexpected server error"
    });
  }
});

export default router;
