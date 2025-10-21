import React, { useState } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import About from "../About/About";

export default function Signup({ onSwitch }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters");
    try {
      await API.post("/users/signup", form);
      setSuccess("Signup successful! Logging you in...");
      const res = await API.post("/users/login", {
        email: form.email,
        password: form.password,
      });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="page-wrapper">
        <div className="signup-container">
          <h5>Join the network</h5>
          <p className="signin-text">
            Already have an account?{" "}
            <Link to="/login"
              onClick={onSwitch}
              style={{
                cursor: "pointer",
                color: "#ff8c00",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="nameinputs">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <input
              name="username"
              placeholder="User Name"
              value={form.username}
              onChange={handleChange}
              required
            />

            <div className="passwordinput">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="password-toggle"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className="submitbtn">
              Agree and Join
            </button>

            <p className="terms">
              I agree to the{" "}
              <Link
                to="../PrivacyPolicy/PrivacyPolicy.jsx"
                style={{
                  cursor: "pointer",
                  color: "#ff8c00",
                  textDecoration: "none",
                }}
              >
                privacy policy
              </Link>{" "}
              and{" "}
              <Link
                to="/terms"
                style={{
                  cursor: "pointer",
                  color: "#ff8c00",
                  textDecoration: "none",
                }}
              >
                terms of service
              </Link>
              .
            </p>
            <p className="signintext">
              <a
                onClick={onSwitch}
                style={{
                  cursor: "pointer",
                  color: "#ff8c00",
                  textDecoration: "none",
                }}
              >
                Already have an account?
              </a>
            </p>
          </form>
        </div>
        <div className="about-container">
          <About />
        </div>
      </div>
    </div>
  );
}
