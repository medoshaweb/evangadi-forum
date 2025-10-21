// backend/ai/ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY, // your API key
});

export async function generateAnswer(prompt) {
  try {
    const result = await genAI.generateText({
      model: "gemini-1.5", // simpler stable model
      prompt: prompt,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    console.log("AI result:", result); // log full response for debugging
    return result?.candidates?.[0]?.content || "No response from AI.";
  } catch (err) {
    console.error("AI error:", err);
    return "Something went wrong while fetching AI response.";
  }
}
