

import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import SemanticSearch from "../../components/SemanticSearch";
import { FaRegCircleUser } from "react-icons/fa6";
import "./questions.css"
import { useAuth } from "../../context/AuthContext";
// import axios from "axios";


export default function Questions() {
  const { user } = useAuth();
  console.log("Current user in Questions page:", user);
  console.log("Loading state in Questions page:", user?.loading);
  const [questionsData, setQuestionsData] = useState({
    questions: [],
    page: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  // const [filteredQuestions, setFilteredQuestions] = useState([]);

  const fetchQuestions = async (page = 1, search = "") => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      const res = await API.get(`/questions?page=${page}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched questions:", res.data);
      setQuestionsData(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchQuestions(1, value);
  };

  const handlePageChange = (newPage) => {
    fetchQuestions(newPage, searchTerm);
  };

  const { questions, page, totalPages } = questionsData;

  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     try {
  //       const storedUser = JSON.parse(localStorage.getItem("user"));
  //       const token = storedUser?.token; // ✅ extract token
  //       const res = await API.get("/questions", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setQuestions(res.data);
  //       setFilteredQuestions(res.data);
  //     } catch (err) {
  //       console.error("Error fetching questions:", err);
  //     }
  //   };
  //   fetchQuestions();
  // }, []);

  // Search handler
  // useEffect(() => {
  //   const results = questions.filter((q) =>
  //     q.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredQuestions(results);
  //   setCurrentPage(1);
  // }, [searchTerm, questions]);

  // // Pagination logic
  // const indexOfLastQuestion = currentPage * questionsPerPage;
  // const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  // const currentQuestions = filteredQuestions.slice(
  //   indexOfFirstQuestion,
  //   indexOfLastQuestion
  // );
  // const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  //   return (
  //     <div className="questions-page container">
  //       {/* Header Section */}
  //       <div className="questions-header">
  //         <Link to="/ask" className="ask-btn">
  //           Ask Question
  //         </Link>
  //         <h2>
  //           Welcome: {user?.user?.firstName || user?.user?.username || "Guest"}
  //         </h2>
  //         {/* <h2>Welcome: {user?.username || "Guest"}</h2> */}
  //       </div>

  //       <h1 className="page-title">Questions</h1>

  //       {/* Search Input */}
  //       <div className="search-container">
  //         <input
  //           type="text"
  //           placeholder="Search questions..."
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //           className="search-input"
  //         />
  //       </div>

  //       {/* Semantic Search */}
  //       <SemanticSearch onSelectQuestion={(q) => setSelectedQuestion(q)} />

  //       {/* Selected Question (optional AI result) */}
  //       {selectedQuestion && (
  //         <div className="selected-question">
  //           <h2>Recommended / Selected Question</h2>
  //           <h3>{selectedQuestion.title}</h3>
  //           <p>{selectedQuestion.description}</p>
  //         </div>
  //       )}

  //       {/* All Questions */}
  //       <div className="questions-list">
  //         {currentQuestions.length > 0 ? (
  //           currentQuestions.map((q) => (
  //             <div key={q.id} className="question-item">
  //               <div className="roew">
  //                 <div className="merge">
  //                   <div className="user-avatar">
  //                     <FaRegCircleUser style={{ fontSize: "60px" }} />
  //                     <p className="question-user">{q.username}</p>
  //                   </div>

  //                   <div className="question-content">
  //                     <h3 className="question-title">
  //                       <Link to={`/questions/${q.id}`}>{q.title}</Link>
  //                     </h3>
  //                   </div>
  //                 </div>
  //                 <div className="question-arrow">
  //                   <Link to={`/questions/${q.id}`} className="arrow-link">
  //                     ➜
  //                   </Link>
  //                 </div>
  //               </div>
  //             </div>
  //           ))
  //         ) : (
  //           <p className="no-results">No questions found.</p>
  //         )}
  //       </div>
  //       {/* Pagination Controls */}
  //       {totalPages > 1 && (
  //         <div className="pagination">
  //           {Array.from({ length: totalPages }, (_, i) => (
  //             <button
  //               key={i + 1}
  //               className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
  //               onClick={() => handlePageChange(i + 1)}
  //             >
  //               {i + 1}
  //             </button>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

  return (
    <div className="questions-page container">
      {/* Header Section */}
      <div className="questions-header">
        <Link to="/ask" className="ask-btn">
          Ask Question
        </Link>
        <h2>
          Welcome: {user?.user?.firstName || user?.user?.username || "Guest"}
        </h2>
      </div>

      <h1 className="page-title">Questions</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Semantic Search */}
      <SemanticSearch onSelectQuestion={(q) => setSelectedQuestion(q)} />

      {/* Selected Question (optional AI result) */}
      {selectedQuestion && (
        <div className="selected-question">
          <h2>Recommended / Selected Question</h2>
          <h3>{selectedQuestion.title}</h3>
          <p>{selectedQuestion.description}</p>
        </div>
      )}

      {/* All Questions */}
      <div className="questions-list">
        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className="question-item">
              <div className="roew">
                <div className="merge">
                  <div className="user-avatar">
                    <FaRegCircleUser style={{ fontSize: "60px" }} />
                    <p className="question-user">{q.username}</p>
                  </div>

                  <div className="question-content">
                    <h3 className="question-title">
                      <Link to={`/questions/${q.id}`}>{q.title}</Link>
                    </h3>
                  </div>
                </div>
                <div className="question-arrow">
                  <Link to={`/questions/${q.id}`} className="arrow-link">
                    ➜
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No questions found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="page-btn"
        >
          Prev
        </button>

        <span className="page-info">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="page-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
