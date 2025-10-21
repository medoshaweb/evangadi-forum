import express from "express";
import { generateAnswer } from "../ai/ai.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ answer: "Prompt is required" });

  try {
    const answer = await generateAnswer(prompt);
    res.json({ answer });
  } catch (err) {
    console.error("AI endpoint error:", err);
    res
      .status(500)
      .json({ answer: "Something went wrong while fetching AI response." });
  }
});

export default router;
