import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSending(true);

    try {
      // Make sure the full backend URL is correct
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json(); // parse JSON response

      if (!res.ok) {
        throw new Error(data.message || "Error sending reset email");
      }

      setMessage(
        data.message || "If that email exists, a reset link has been sent."
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="forgot-container" style={styles.container}>
      <h2 style={styles.title}>Forgot Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Email address</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={styles.input}
        />
        <button type="submit" disabled={sending} style={styles.button}>
          {sending ? "Sending..." : "Send reset link"}
        </button>
      </form>

      {message && (
        <p style={{ ...styles.message, color: "green" }}>{message}</p>
      )}
      {error && <p style={{ ...styles.message, color: "red" }}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "30px",
    background: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    marginTop: "15px",
    fontWeight: "bold",
  },
};
