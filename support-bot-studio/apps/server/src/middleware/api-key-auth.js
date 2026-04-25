/**
 * Middleware to validate origin and potentially a master key
 */
export const apiKeyAuth = (req, res, next) => {
  const masterKey = process.env.EMBED_MASTER_KEY;
  
  // If no master key is set in .env, skip authentication
  if (!masterKey) {
    return next();
  }

  const clientKey = req.headers["x-sb-master-key"];
  
  if (clientKey !== masterKey) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized: Invalid or missing Master Key"
    });
  }
  
  next();
};
