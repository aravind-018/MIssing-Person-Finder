import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

function ThemeToggle({ variant = "group", className = "" }) {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  if (variant === "compact") {
    return (
      <button
        type="button"
        className={`theme-toggle-compact-btn ${className}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
        title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      >
        {isDark ? <FaSun /> : <FaMoon />}
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      </button>
    );
  }

  return (
    <div
      className={`theme-toggle-group ${className}`}
      role="radiogroup"
      aria-label="Theme Selection"
    >
      <button
        type="button"
        className={`theme-toggle-option ${theme === "light" ? "active light-active" : ""}`}
        onClick={() => setTheme("light")}
        role="radio"
        aria-checked={theme === "light"}
        aria-label="Light Theme"
      >
        <FaSun />
        <span>Light</span>
      </button>

      <button
        type="button"
        className={`theme-toggle-option ${theme === "dark" ? "active dark-active" : ""}`}
        onClick={() => setTheme("dark")}
        role="radio"
        aria-checked={theme === "dark"}
        aria-label="Dark Theme"
      >
        <FaMoon />
        <span>Dark</span>
      </button>
    </div>
  );
}

export default ThemeToggle;
