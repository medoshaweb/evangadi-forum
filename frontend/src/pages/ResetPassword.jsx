import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 8)
      return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset password</h2>
      <form onSubmit={handleSubmit}>
        <label>New password</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
        />
        <label>Confirm password</label>
        <input
          type="password"
          value={confirm}
          required
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save new password"}
        </button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
