import logo from "../../assets/logo.png";
import "./Logo.css";

export default function Logo({
  size = 48,
  showText = true,
}) {
  return (
    <div className="logo">
      <img
        src={logo}
        alt="GodsEye"
        className="logo-image"
        style={{
          width: size,
          height: size,
        }}
      />

      {showText && (
        <div className="logo-text">
          <h2>GodsEye</h2>
          <span>Missing Person Finder</span>
        </div>
      )}
    </div>
  );
}