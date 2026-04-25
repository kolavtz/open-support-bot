import { Router } from "express";
const router = Router();

router.get("/:botId", (req, res) => {
  const { botId } = req.params;

  // In a real app, this would fetch from a database based on botId
  const config = {
    botId,
    name: "Support Assistant",
    greeting: "Hi — how can I help today?",
    primaryColor: "#01696f",
    position: "bottom-right"
  };

  res.json(config);
});

export default router;
