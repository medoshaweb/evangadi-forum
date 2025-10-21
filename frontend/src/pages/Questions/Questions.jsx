

import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import SemanticSearch from "../../components/SemanticSearch";
import { FaRegCircleUser } from "react-icons/fa6";
import "./questions.css"
import { useAuth } from "../../context/AuthContext";
// import axios from "axios";


export default function Questions() {
  const { user } = useAuth();
  console.log("Current user in Questions page:", user);
  console.log("Loading state in Questions page:", user?.loading);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = storedUser?.token; // ✅ extract token
        const res = await API.get("/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched questions:", res.data);
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, []);


  return (
    <div className="questions-page container">
      {/* Header Section */}
      <div className="questions-header">
        <Link to="/ask" className="ask-btn">
          Ask Question
        </Link>
        <h2>
          Welcome: {user?.user?.firstName || user?.user?.username || "Guest"}
        </h2>
        {/* <h2>Welcome: {user?.username || "Guest"}</h2> */}
      </div>

      <h1 className="page-title">Questions</h1>

      {/* Semantic Search */}
      <SemanticSearch onSelectQuestion={(q) => setSelectedQuestion(q)} />

      {/* Selected Question (optional AI result) */}
      {selectedQuestion && (
        <div className="selected-question">
          <h2>Recommended / Selected Question</h2>
          <h3>{selectedQuestion.title}</h3>
          <p>{selectedQuestion.description}</p>
        </div>
      )}

      {/* All Questions */}
      <div className="questions-list">
        {questions.map((q) => (
          <div key={q.id} className="question-item">
            <div className="roew">
              <div className="merge">
                <div className="user-avatar">
                  <FaRegCircleUser style={{ fontSize: "60px" }} />
                  <p className="question-user">{q.username}</p>
                </div>

                <div className="question-content">
                  <h3 className="question-title">
                    <Link to={`/questions/${q.id}`}>{q.title}</Link>
                  </h3>
                </div>
              </div>
              <div className="question-arrow">
                <Link to={`/questions/${q.id}`} className="arrow-link">
                  ➜
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


