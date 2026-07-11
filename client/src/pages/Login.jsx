import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginUser } from "../services/authService";
import "../styles/Login.css";
import background from "../assets/login-bg.jpg";
import FloatingParticles from "../components/FloatingParticles";

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

      navigate("/dashboard");
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

          <div className="input-group">
            <label>Email</label>

            <div className="input-box">

  <div className="input-icon">
    <FaEnvelope />
  </div>

  <input
    type="email"
    placeholder="Enter Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

</div>
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="input-box">

  <div className="input-icon">
    <FaLock />
  </div>

  <input
    type="password"
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

</div>
          </div>

          <button className="login-btn">
            Login
          </button>

          {error && <p className="error">{error}</p>}

        </form>

      </div>

    </div>
  );
}

export default Login;