import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

import "./askQuestion.css"

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    if (title.length > 200) return setError("Title maximum is 200 characters");
    if (!description.trim()) return setError("Description is required");
    setError("");

    try {
      await API.post("/questions", { title, description });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="allContainer">
      <div className="question__container">
        <div className="question__wrapper">
          <h3 className="question__header__title">
            <span className="highlight">Steps To Write A Good Question</span>
          </h3>

          <div className="questionContainer">
            <h2 className="questionTitle">How to Ask a Good Question</h2>
            <div className="questionList">
              <ul className="questionListUl">
                
                <li>Summarize your problem in a one-line title.</li>
                  
                <li>Describe your problem in more detail.</li>
                <li>
                
                  Explain what you have tried and what you expected to happen.
                </li>
                
                <li>Review your question and post it to the site.</li>
              </ul>
            </div>
          </div>
        </div>
        <h4 className="highlight">Post Your Question</h4>
        <div className="question__header__titleTwo">
          <form onSubmit={handleSubmit} className="question_form">
            <label>Title (max 200 characters)</label>
            <input
              className="question_title2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Title"
              required
            />

            <label>Description</label>
            <textarea
              className="question_description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              placeholder="Question Description..."
            />

            {error && <div className="error">{error}</div>}
            <button className="question_button1">Post Question</button>
          </form>
        </div>
      </div>
    </div>
  );
}
