import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginUser } from "../../services/authService";
import "@/styles/Login.css";
import background from "../../assets/login-bg.jpg";
import FloatingParticles from "../../components/FloatingParticles";
import FormInput from "../../components/common/FormInput";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    <div className="overlay"></div>

<FloatingParticles />

      <div className="login-card">

        <h1 className="login-title">
    Gods<span>Eye</span>
</h1>

        <p className="login-subtitle">
          Missing Person Identification System
        </p>

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