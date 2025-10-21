import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/evangadi-logo-header.png";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="brand">
        <Link to="/">
          <img src={logo} alt="Evangadi Logo" />
        </Link>
      </div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/">How it Works</Link>

        {user ? (
          <>
            <span className="welcome">{`Welcome: ${user.firstName}`}</span>
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
  );
}
