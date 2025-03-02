import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      console.log("Response Data:", response.data); // Debugging statement

      localStorage.setItem("token", response.data.token);
      alert("Login successful!");

      const { role } = response.data;
      console.log("User Role:", role); // Debugging statement

      switch (role) {
        case "Admin":
          window.location.href = "/admin";
          break;
        case "doctor":
          window.location.href = "/profileD";
          break;
        case "BCS":
          window.location.href = "/profileB";
          break;
        case "MLT":
          window.location.href = "/profileM";
          break;
        default:
          window.location.href = "/dashboard";
          break;
      }
    } catch (err) {
      console.error("Login Error:", err); // Debugging statement
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Welcome</p>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
