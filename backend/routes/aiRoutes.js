import express from "express";
import { generateAnswer } from "../ai/ai.js";

const router = express.Router();

// POST /api/ai/ask
router.post("/ask", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const answer = await generateAnswer(prompt);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
