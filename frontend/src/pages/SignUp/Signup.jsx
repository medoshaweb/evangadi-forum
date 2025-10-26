import React, { useState } from "react";
import "./signup.css";
import { useNavigate, Link } from "react-router-dom";
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

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear field error as user types
  };

  // ✅ Client-side validation rules
  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
      setErrors({ general: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="signup-page">
      <div className="page-wrapper">
        <div className="signup-container">
          <h5>Join the network</h5>
          <p className="signin-text">
            Already have an account?{" "}
            <Link
              to="/login"
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

          {errors.general && <p className="error">{errors.general}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}

            {/* First and Last Name */}
            <div className="nameinputs">
              <div>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>

              <div>
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>
            </div>

            {/* Username */}
            <input
              name="username"
              placeholder="User Name"
              value={form.username}
              onChange={handleChange}
              required
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}

            {/* Password */}
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
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}

            {/* Submit */}
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
