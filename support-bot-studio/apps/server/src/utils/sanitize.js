/**
 * Basic sanitization for chat messages
 */
export function sanitizeMessage(text) {
  if (typeof text !== "string") return "";
  return text.trim().slice(0, 5000); // Limit length
}
