import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import SemanticSearch from "../../components/SemanticSearch";
import { FaRegCircleUser } from "react-icons/fa6";
import "./questions.css";
import { useAuth } from "../../context/AuthContext";
import { format } from "timeago.js";

export default function Questions() {
  const { user } = useAuth();
  console.log("Current user in Questions page:", user);
  console.log("Loading state in Questions page:", user?.loading);
  const [questionsData, setQuestionsData] = useState({
    questions: [],
    page: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const fetchQuestions = async (page = 1, search = "") => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      const res = await API.get(`/questions?page=${page}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched questions:", res.data);
      setQuestionsData(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const handleVote = async (questionId, voteValue) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;
      if (!token) return alert("You must be logged in to vote.");

      const res = await API.post(
        "/questions/vote",
        { questionId, vote: voteValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Update local vote count instantly
      setQuestionsData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, totalVotes: res.data.totalVotes } : q
        ),
      }));
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error submitting your vote.");
    }
  };


  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchQuestions(1, value);
  };

  const handlePageChange = (newPage) => {
    fetchQuestions(newPage, searchTerm);
  };

  const { questions, page, totalPages } = questionsData;

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
      </div>

      <h1 className="page-title">Questions</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Semantic Search */}
      {/* <SemanticSearch onSelectQuestion={(q) => setSelectedQuestion(q)} /> */}
      <SemanticSearch
        questions={questions}
        searchTerm={searchTerm}
        onSelectQuestion={(q) => setSelectedQuestion(q)}
      />

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
        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className="question-item">
              <div className="roew">
                <div className="merge">
                  <div className="user-avatar">
                    <FaRegCircleUser style={{ fontSize: "60px" }} />
                    <p className="question-user">{q.username}</p>
                    {/* 🕒 Show posted date */}
                    <p
                      className="question-date"
                      title={new Date(q.created_at).toLocaleString()}
                    >
                      Posted {format(q.created_at)}
                    </p>
                  </div>

                  <div className="question-content">
                    <h3 className="question-title">
                      <Link to={`/questions/${q.id}`}>{q.title}</Link>
                    </h3>

                    {/* 🧮 Voting Section */}
                    <div className="vote-section">
                      <button
                        className="vote-btn upvote"
                        onClick={() => handleVote(q.id, 1)}
                      >
                        👍
                      </button>
                      <span className="vote-count">{q.totalVotes || 0}</span>
                      <button
                        className="vote-btn downvote"
                        onClick={() => handleVote(q.id, -1)}
                      >
                        👎
                      </button>
                    </div>
                  </div>
                </div>
                <div className="question-arrow">
                  <Link to={`/questions/${q.id}`} className="arrow-link">
                    ➜
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No questions found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="page-btn"
        >
          Prev
        </button>

        <span className="page-info">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="page-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
