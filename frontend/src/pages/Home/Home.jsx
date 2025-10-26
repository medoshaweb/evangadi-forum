import React from "react";
import "./Home.css";
import Questions from "../Questions/Questions.jsx";
// import Layout from "../../Layout/Layout.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  // Removed unused variable 'userName'

  return (
    <>
      <div className="home_container">
        <div className="questions_list">
          <Questions />
        </div>
      </div>
      //{" "}
    </>
  );
}
