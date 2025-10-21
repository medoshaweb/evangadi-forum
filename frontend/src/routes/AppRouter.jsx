import { Routes, Route } from "react-router-dom";
import Terms from "../components/Footer/Terms.jsx";
import QuestionAndAnswer from "../Pages/QuestionAndAnswer/QuestionAndAnswer.jsx";
import AskQuestion from "../pages/AskQuestion/AskQuestion.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy.jsx";
import Home from "../pages/Home/Home.jsx";
import AuthLayout from "../pages/AuthLayout/AuthLayout.jsx";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ask" element={<PrivateRoute>
                      <AskQuestion />
                    </PrivateRoute>} />
      <Route path="/questions/${id}" element={<PrivateRoute>
                      <QuestionDetail />
                    </PrivateRoute>} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/auth" element={<AuthLayout />} />
    </Routes>
  );
}

export default AppRouter;
