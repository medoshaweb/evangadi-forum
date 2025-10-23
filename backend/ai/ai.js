
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro-002' });

export async function generateAnswer(prompt) {
  const response = await model.generateText({
    prompt: prompt,
    temperature: 0.7,
  });

  return response.text; 
}













