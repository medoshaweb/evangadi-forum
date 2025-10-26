import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";

export default function QuestionDetail() {
  const { id } = useParams();
  const [payload, setPayload] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const fetchQuestion = async () => {
    try {
      const res = await API.get(`/questions/${id}`);
      setPayload(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const postAnswer = async (e) => {
    e.preventDefault();
    setError("");
    if (!answer.trim()) return setError("Answer cannot be empty");

    try {
      const res = await API.post(`/answers/${id}`, { answerText: answer });
      // Append the new answer to the list
      setPayload((prev) => ({
        ...prev,
        answers: [...(prev.answers || []), res.data],
      }));
      setAnswer("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (!payload) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>{payload.question.title}</h2>
      <div className="meta">
        Asked by: <strong>{payload.question.username}</strong>
      </div>
      <p className="description">{payload.question.description}</p>

      <section className="answers">
        <h3>Answers</h3>
        {!payload.answers || payload.answers.length === 0 ? (
          <p>No answers yet.</p>
        ) : (
          <ul>
            {payload.answers.map((a) => (
              <li key={a.id} className="answer">
                <div className="meta">{a.username} said:</div>
                <p>{a.answer || a.body || a.answerText}</p>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={postAnswer}
          className="answer-form"
        >
          <label>Your answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
          />
          {error && <div className="error">{error}</div>}
          <button className="btn">Post Answer</button>
        </form>
      </section>
    </div>
  );
}
