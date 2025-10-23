


import React, { useState, useEffect, useRef } from "react";
import axios from "../api";
import { FaRobot } from "react-icons/fa"; // 🤖 AI icon

export default function SemanticSearch({ onSelectQuestion }) {
  const [query, setQuery] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResponses, setAiResponses] = useState({}); // {questionId: answer}
  const chatEndRef = useRef(null);

  // ✅ Fetch all questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await axios.get("/questions");
        console.log("Fetched questions:", res.data);
        setAllQuestions(res.data.questions || res.data || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    }
    fetchQuestions();
  }, []);

  // ✅ Filter & sort questions as you type
  const filteredQuestions = query
    ? allQuestions
        .filter((q) => q.title.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
          const aStarts = a.title.toLowerCase().startsWith(query.toLowerCase());
          const bStarts = b.title.toLowerCase().startsWith(query.toLowerCase());
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        })
    : [];

  // ✅ Handle AI generation for clicked question
  async function handleAiClick(question) {
    setLoading(true);
    try {
        const response = await axios.post("http://localhost:5000/api/ai/ask", {
          prompt: question.title,
        });

      const res = response.data;
      const aiText = res.answer || "No explanation received.";
      setAiResponses((prev) => ({ ...prev, [question.id]: aiText }));
    } catch (err) {
      console.error("AI fetch error:", err);
      setAiResponses((prev) => ({
        ...prev,
        [question.id]: "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Search input */}
      <input
        type="text"
        placeholder="Type your question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "16px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />

      {/* Filtered question list */}
      {filteredQuestions.length > 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
            marginBottom: "15px",
            overflow: "hidden",
          }}
        >
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Question title */}
              <span
                onClick={() => onSelectQuestion(q)}
                style={{
                  cursor: "pointer",
                  color: "#111",
                  flex: 1,
                }}
              >
                {q.title}
              </span>

              {/* AI button */}
              <button
                onClick={() => handleAiClick(q)}
                disabled={loading}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#4f46e5",
                  fontSize: "18px",
                }}
                title="Ask AI to explain"
              >
                <FaRobot />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AI responses under question */}
      {Object.keys(aiResponses).map((id) => (
        <div
          key={id}
          style={{
            marginTop: "10px",
            background: "#f9fafb",
            borderRadius: "8px",
            padding: "10px",
            border: "1px solid #ddd",
          }}
        >
          <strong>💡 AI Explanation:</strong>
          <p style={{ marginTop: "5px", color: "#333" }}>{aiResponses[id]}</p>
        </div>
      ))}

      <div ref={chatEndRef}></div>
    </div>
  );
}
