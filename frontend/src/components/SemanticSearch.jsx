

// import React, { useState, useEffect, useRef } from "react";
// import axios from "../api";

// export default function SemanticSearch({ onSelectQuestion }) {
//   const [query, setQuery] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [allQuestions, setAllQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showTyping, setShowTyping] = useState(false);
//   const chatEndRef = useRef(null);

//   // Fetch all questions once
//   useEffect(() => {
//     async function fetchQuestions() {
//       try {
//         const res = await axios.get("/questions");
//         console.log("Fetched questions:", res.data);
//         setAllQuestions(res.data.questions || res.data || []);
//       } catch (err) {
//         console.error("Failed to fetch questions:", err);
//       }
//     }
//     fetchQuestions();
//   }, []);

//   // Scroll chat to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, showTyping]);

  
//   // ✅ Safe filtering + sorting (no "before initialization" error)
//   let filteredQuestions = [];

//   if (query.trim() && allQuestions.length > 0) {
//     const lowerQuery = query.toLowerCase();
//     filteredQuestions = allQuestions
//       .filter((q) => q.title?.toLowerCase().includes(lowerQuery))
//       .sort((a, b) => {
//         const aStarts = a.title?.toLowerCase().startsWith(lowerQuery);
//         const bStarts = b.title?.toLowerCase().startsWith(lowerQuery);
//         if (aStarts && !bStarts) return -1;
//         if (!aStarts && bStarts) return 1;
//         console.log("Query:", query);
//         console.log("Filtered questions:", filteredQuestions);

//         return 0;
//       });
//   }

//   async function handleSend() {
//     if (!query.trim()) return;

//     const userMessage = { type: "user", text: query };
//     setMessages((prev) => [...prev, userMessage]);
//     const currentQuery = query;
//     setQuery(""); // clear input after sending
//     setLoading(true);
//     setShowTyping(true);

//     try {
//       const res = await axios.post("/ai/generate", {
//         prompt: currentQuery,
//       });
//       console.log("AI response:", res.data);
//       // Safely access answer
//       const aiAnswer = res.data.answer || "AI did not respond.";
//       setMessages((prev) => [...prev, { type: "ai", text: aiAnswer }]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "ai", text: "Something went wrong. Please try again." },
//       ]);
//     } finally {
//       setLoading(false);
//       setShowTyping(false);
//     }
//   }

//   function handleKeyDown(e) {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSend();
//     }
//   }

//   return (
//     <div
//       style={{
//         maxWidth: "700px",
//         margin: "30px auto",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       {/* Input */}
//       <input
//         type="text"
//         placeholder="Type your question..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         onKeyDown={handleKeyDown}
//         style={{
//           width: "100%",
//           padding: "12px 16px",
//           fontSize: "16px",
//           marginBottom: "10px",
//           borderRadius: "8px",
//           border: "1px solid #ddd",
//         }}
//       />

//       {/* Live filtered questions */}
//       {filteredQuestions.length > 0 && (
//         <div
//           style={{
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             marginBottom: "15px",
//             background: "#fff",
//           }}
//         >
//           {filteredQuestions.map((q) => (
//             <div
//               key={q.id}
//               onClick={() => onSelectQuestion(q)}
//               style={{
//                 padding: "10px",
//                 cursor: "pointer",
//                 borderBottom: "1px solid #eee",
//               }}
//             >
//               {q.title}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Chat */}
//       <div
//         style={{
//           border: "1px solid #ddd",
//           borderRadius: "16px",
//           padding: "15px",
//           maxHeight: "400px",
//           overflowY: "auto",
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             style={{
//               marginBottom: "10px",
//               textAlign: msg.type === "user" ? "left" : "right",
//             }}
//           >
//             <span
//               style={{
//                 padding: "10px 15px",
//                 borderRadius: "12px",
//                 background: msg.type === "user" ? "#f3f4f6" : "#4f46e5",
//                 color: msg.type === "user" ? "#111" : "#fff",
//               }}
//             >
//               {msg.text}
//             </span>
//           </div>
//         ))}

//         {showTyping && (
//           <div style={{ textAlign: "right", color: "#4f46e5" }}>Typing...</div>
//         )}

//         <div ref={chatEndRef}></div>
//       </div>
//     </div>
//   );
// }


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
      const res = await axios.post("/ai/generate", { prompt: question.title });
      const aiText = res.data.answer || "No explanation received.";
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
