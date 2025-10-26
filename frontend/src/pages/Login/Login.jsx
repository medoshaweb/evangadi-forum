import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";
import About from "../About/About";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/questions", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error while typing
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  // ✅ Validation rules
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await API.post("/users/login", form);
      console.log("Frontend login response:", res.data);

      const { user, token, refreshToken } = res.data;
      const userData = { user, token, refreshToken };

      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/questions"), 1000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || err.message });
    }
  };

  return (
    <>
      <div className="login_page">
        <div className="login_left">
          <div className="login_form_container">
            <h2>Login to your account</h2>
            <p>
              Don’t have an account?{" "}
              <Link to="/signup" className="signup-link">
                Create a new account
              </Link>
            </p>
            <br />
            {errors.general && <p className="error">{errors.general}</p>}
            {success && <p className="success">{success}</p>}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="email_input">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="form-input"
                  required
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="password_input">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="form-input"
                  required
                />
                <button type="button" onClick={handleTogglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}

              {/* Forgot password */}
              <p className="forgot_password">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>

              {/* Submit */}
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
