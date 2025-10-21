import  "./Footer.css";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import image from "../../assets/images/evangadi-logo-footer.png";

const Footer = () => {
  return (
    <footer className="evangadi-footer">
      <div className="footer-container">
        {/* Column 1: Logo and Social Icons */}
        <div className="footer-column">
          <img src={image} className="footer-logo" alt="footer-logo" />

          <div className="social-icons">
            <a
              href="https://www.facebook.com/evangaditech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/evangaditech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiInstagramFill />
            </a>
            <a
              href="https://www.youtube.com/@EvangadiTech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h4 className="footer-heading">Useful Links</h4>
          <a href="/how-it-works" className="footer-link">
            How it works
          </a>
          <a
            href="https://www.evangadi.com/legal/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Terms of Service
          </a>
          <a
            href="https://www.evangadi.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Privacy policy
          </a>
        </div>

        {/* Column 3 */}
        <div className="footer-column contact">
          <h5 className="footer-heading">Contact Info</h5>
          <p className="contact-item">Evangadi Networks</p>
          <a
            href="mailto:support@evangadi.com"
            className="footer-link contact-item"
          >
            support@evangadi.com
          </a>
          <p className="contact-item">+1-209-386-2702</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
