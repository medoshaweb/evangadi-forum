import db from "../config/db.js";

// Create a new answer
export const createAnswer = async (req, res) => {
  const { questionId } = req.params;
  const { answerText } = req.body; // include userId if needed
  const userId = req.user?.id; // get from verifyToken middleware

  console.log("Received body:", req.body);

  console.log(
    "questionId:",
    questionId,
    "answerText:",
    answerText,
    "userId:",
    userId
  );
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: no user info" });
  }

  if (!answerText) {
    return res.status(400).json({ message: "Answer text is required" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO answers (question_id, user_id, answer) VALUES (?, ?, ?)",
      [questionId, userId, answerText]
    );

    res.status(201).json({
      message: "Answer created successfully",
      answerId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🆕 Get answers by questionId
export const getAnswersByQuestionId = async (req, res) => {
  try {
    const { questionId } = req.params;
    console.log("Fetching answers for question:", questionId);

    const [rows] = await db.execute(
      "SELECT * FROM answers WHERE question_id = ?",
      [questionId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
