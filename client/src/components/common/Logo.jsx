import logo from "../../assets/logo.png";
import useBranding from "../../hooks/useBranding";
import "./Logo.css";

export default function Logo({
  size = 48,
  showText = true,
}) {
  const branding = useBranding();

  return (
    <div className="logo">
      <img
        src={logo}
        alt={branding.systemName || "GodsEye"}
        className="logo-image"
        style={{
          width: size,
          height: size,
        }}
      />

      {showText && (
        <div className="logo-text">
          <h2>{branding.systemName || "GodsEye"}</h2>
          <span>{branding.applicationTagline || "Missing Person Finder"}</span>
        </div>
      )}
    </div>
  );
}