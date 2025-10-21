import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/SignUp";
import Questions from "./pages/Questions/Questions";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail/QuestionDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import logo from "./assets/images/evangadi-logo-header.png";
import { useAuth } from "./context/AuthContext";
import "./App.css";

// ✅ Private route for authenticated users
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // wait until user loaded
  return user ? children : <Navigate to="/login" />;
}


export default function App() {
  const { user,loading, logout } = useAuth();
  // const { loading } = useAuth();
if (loading) return <div>Loading...</div>;

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <Link to="/">
            <img src={logo} alt="Evangadi Logo" />
          </Link>
        </div>
        <nav>
          <Link to="/">Home</Link>
          {user && <Link to="/">How it Works</Link>}
          {user ? (
            <>
              <span className="welcome">{`Welcome: ${
                user.firstName || user.username
              }`}</span>
              <button className="btn small" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Authenticated Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <PrivateRoute>
                <Questions />
              </PrivateRoute>
            }
          />
          <Route
            path="/ask"
            element={
              <PrivateRoute>
                <AskQuestion />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions/:id"
            element={
              <PrivateRoute>
                <QuestionDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
