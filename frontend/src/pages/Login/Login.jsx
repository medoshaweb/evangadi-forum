import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";  
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";
import About from "../About/About";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth(); // ✅ get login from context

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/questions", { replace: true }); // replace prevents back navigation
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/users/login", form);
      console.log("Frontend login response:", res.data);

      // Destructure both tokens and user
      const { user, token, refreshToken } = res.data;

      // ✅ Wrap everything under one consistent structure
      const userData = { user, token, refreshToken };

      // Store user info with access and refresh tokens
      localStorage.setItem("user", JSON.stringify(userData));

      // Optional: store user in context
      login(userData);

      navigate("/questions"); // redirect to questions
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      <div className="login_page">
        <div className="login_left">
          <div className="login_form_container">
            <h2>Login to your account</h2>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Create a new account
              </Link>
            </p>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
              <div className="password_input">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <button type="button" onClick={handleTogglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="forgot_password">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
              <button type="submit" className="submit_btn">
                Login
              </button>
            </form>
          </div>
        </div>

        <div className="login_right">
          <About />
        </div>
      </div>
    </>
  );
}
