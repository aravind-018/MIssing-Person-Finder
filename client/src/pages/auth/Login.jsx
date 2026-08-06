import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import { loginUser } from "../../services/authService";
import useBranding from "../../hooks/useBranding";

import "@/styles/Login.css";

import background from "../../assets/login-bg.jpg";

import FloatingParticles from "../../components/FloatingParticles";
import PatrolLogo from "../../components/common/PatrolLogo";
import FormInput from "../../components/common/FormInput";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const branding = useBranding();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      switch (data.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "officer":
          navigate("/officer/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Patrol Drone */}
      <PatrolLogo />

      {/* Dark Overlay */}
      <div className="overlay"></div>

      {/* Background Particles */}
      <FloatingParticles />

      {/* Login Card */}
      <div id="login-card" className="login-card">
        <h1 className="login-title">
          {branding.systemName || "GodsEye"}
        </h1>

        <p className="login-subtitle">
          {branding.applicationTagline || "Missing Person Identification System"}
        </p>

        {branding.organizationName && (
          <p className="login-org-name" style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "-0.5rem", marginBottom: "1rem" }}>
            {branding.organizationName} {branding.departmentName ? `• ${branding.departmentName}` : ""}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <FormInput
            label="Email"
            icon={<FaEnvelope />}
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            label="Password"
            icon={<FaLock />}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn">
            Login
          </button>

          {error && <p className="error">{error}</p>}

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register as Officer
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;