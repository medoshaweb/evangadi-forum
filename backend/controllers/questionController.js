import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "../config/db.js";

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI({
  model: "chat-bison-001", // Gemini chat model
  location: process.env.GOOGLE_CLOUD_LOCATION || "global",
});

// 📘 Helper to format MySQL timestamps
function formatDateTime(mysqlDate) {
  if (!mysqlDate) return null;
  const date = new Date(mysqlDate);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 📘 Get all questions
export const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const offset = (page - 1) * limit;
    // Count total for pagination
    const countQuery = `
SELECT COUNT(*) AS total
FROM questions q
JOIN users u ON q.user_id = u.id
WHERE q.title LIKE ? OR q.description LIKE ? OR u.username LIKE ?
`;
    const [countResult] = await db.query(countQuery, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ]);
    const total = countResult[0].total;

    // Fetch paginated questions
    const query = `
SELECT q.*, u.username
FROM questions q
JOIN users u ON q.user_id = u.id
WHERE q.title LIKE ? OR q.description LIKE ? OR u.username LIKE ?
ORDER BY q.created_at DESC
LIMIT ? OFFSET ?
`;
    const [rows] = await db.query(query, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      Number(limit),
      Number(offset),
    ]);

    // Format created_at before sending to frontend
    const formattedRows = rows.map((r) => ({
      ...r,
      created_at: formatDateTime(r.created_at),
    }));

    res.json({
      questions: formattedRows,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📘 Get single question with its answers
export const getQuestionWithAnswers = async (req, res) => {
  const { id } = req.params;
  try {
    const [qres] = await db.query(
      `SELECT q.id, q.title, q.description, q.created_at, u.username
       FROM questions q
       JOIN users u ON q.user_id = u.id
       WHERE q.id = ?`,
      [id]
    );

    if (!qres.length)
      return res.status(404).json({ message: "Question not found" });

    const question = qres[0];
    question.created_at = formatDateTime(question.created_at);

    const [answers] = await db.query(
      `SELECT a.id, a.answer, a.created_at, u.username
       FROM answers a
       JOIN users u ON a.user_id = u.id
       WHERE a.question_id = ?
       ORDER BY a.created_at ASC`,
      [id]
    );

    const formattedAnswers = answers.map((a) => ({
      ...a,
      created_at: formatDateTime(a.created_at),
    }));

    res.json({ question, answers: formattedAnswers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
};

// 🧠 Create a new question with Google embeddings
export const createQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || title.length > 200)
      return res
        .status(400)
        .json({ message: "Title required (max 200 chars)" });
    if (!description)
      return res.status(400).json({ message: "Description required" });

    const userId = req.user.id;

    // 1️⃣ Insert into MySQL questions
    const [result] = await db.query(
      "INSERT INTO questions (user_id, title, description) VALUES (?, ?, ?)",
      [userId, title, description]
    );
    const questionId = result.insertId;

    // 4️⃣ Return the inserted question
    const [rows] = await db.query(
      `SELECT q.id, q.title, q.description, q.created_at, u.username
       FROM questions q
       JOIN users u ON q.user_id = u.id
       WHERE q.id = ?`,
      [questionId]
    );

    const newQuestion = rows[0];
    newQuestion.created_at = formatDateTime(newQuestion.created_at);

    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔍 Semantic search route using cosine similarity
export const searchQuestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Missing query" });

    // 1️⃣ Generate embedding for the search query
    const queryEmbeddingResponse = await genAI.embed({ text: query });

    if (
      !queryEmbeddingResponse ||
      !Array.isArray(queryEmbeddingResponse.embedding)
    ) {
      return res
        .status(500)
        .json({ message: "Embedding not available yet, retry later." });
    }

    const queryEmbedding = queryEmbeddingResponse.embedding;

    // 2️⃣ Fetch all question embeddings
    const [results] = await db.query(
      "SELECT question_id, embedding FROM question_embeddings"
    );

    // 3️⃣ Compute cosine similarity
    const similarities = results.map((r) => {
      const emb = JSON.parse(r.embedding);
      const score = cosineSimilarity(queryEmbedding, emb);
      return { question_id: r.question_id, score };
    });

    // 4️⃣ Sort by highest similarity
    similarities.sort((a, b) => b.score - a.score);

    // 5️⃣ Return top 10 results
    res.json(similarities.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧮 Helper function for cosine similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}
