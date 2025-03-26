import React, { useState } from "react";
import "./ChangePassword.css"; // Ensure the CSS file is correctly linked

const ChangePassword = () => {
  const [password, setPassword] = useState({
    username: "", // Added username field
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
    setSuccess(""); // Clear success message on input change
  };

  const handleSubmit = async () => {
    if (password.newPassword !== password.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Assuming user is authenticated

      const response = await fetch("http://localhost:5000/api/change-password/after-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure token is included
        },
        body: JSON.stringify({
          username: password.username, // Include username
          oldPassword: password.currentPassword,
          newPassword: password.newPassword,
          confirmPassword: password.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setSuccess("Password changed successfully!");
      handleReset();
    } catch (error) {
      console.error("Error changing password:", error);
      setError("An error occurred while changing the password.");
    }
  };

  const handleReset = () => {
    setPassword({ username: "", currentPassword: "", newPassword: "", confirmPassword: "" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="password-section">
      <h3>Change Password</h3>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="input-group">
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={password.username}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="input-group">
        <label>Current Password:</label>
        <input
          type="password"
          name="currentPassword"
          value={password.currentPassword}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="input-group">
        <label>New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={password.newPassword}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="input-group">
        <label>Confirm New Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={password.confirmPassword}
          onChange={handlePasswordChange}
        />
      </div>

      <button className="submit-button" onClick={handleSubmit}>Change Password</button>
    </div>
  );
};

export default ChangePassword;
