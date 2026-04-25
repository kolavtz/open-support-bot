import { Router } from "express";
const router = Router();

router.get("/", (_, res) => {
  res.json({ ok: true, service: "support-bot-server" });
});

export default router;
