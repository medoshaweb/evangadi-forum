
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
