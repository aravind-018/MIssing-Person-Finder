import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaArrowLeft } from "react-icons/fa";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-icon">
          <FaExclamationTriangle />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          The requested surveillance record or page could not be located in the GodsEye system.
        </p>
        <div className="not-found-actions">
          <button
            type="button"
            className="not-found-btn secondary-btn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Go Back
          </button>
          <button
            type="button"
            className="not-found-btn primary-btn"
            onClick={() => navigate("/")}
          >
            <FaHome /> Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
