import React from "react";
import "./Home.css";
import Questions from "../Questions/Questions.jsx";
// import Layout from "../../Layout/Layout.jsx";
import { Link } from "react-router-dom";

export default function Home({ user }) {
  const userName = String(user?.username || user?.firstName || "User");

  return (
    <>
      <div className="home_container">
        {/* <div className="ask_welcome_holder">
          <div className="ask_question">
            <Link to="/ask" style={{ textDecoration: "none" }}>
              <button className="ask_btn">
                <span></span>
              </button>
            </Link>
          </div>
          <div className="welcome_message">
            <h2>Welcome, {userName}!</h2>
          </div>
        </div> */}

        <div className="questions_list">
          <Questions />
        </div>
      </div>
    // </>
  );
}
