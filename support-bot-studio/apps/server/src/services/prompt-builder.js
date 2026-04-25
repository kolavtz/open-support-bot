export function buildMessages({ systemPrompt, siteContext, messages }) {
  const finalSystem = [
    systemPrompt,
    siteContext ? `Website context:\n${siteContext}` : "",
    "Keep answers concise, accurate, and support-focused.",
    "If you do not know, say so clearly."
  ].filter(Boolean).join("\n\n");

  return [
    { role: "system", content: finalSystem },
    ...messages
  ];
}
