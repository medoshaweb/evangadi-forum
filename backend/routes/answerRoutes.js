// // answerRoutes.js
import express from "express";
import {
  createAnswer,
  getAnswersByQuestionId,
} from "../controllers/answerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:questionId", verifyToken, createAnswer);
router.get("/:questionId", getAnswersByQuestionId);

export default router;
