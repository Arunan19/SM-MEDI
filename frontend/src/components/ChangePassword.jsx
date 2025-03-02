import React, { useState } from "react";
import "./ChangePassword.css"; // Ensure correct import

const ChangePassword = () => {
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="password-section">
      <h3>Change Password</h3>
      <div className="input-group">
        <label>Current Password:</label>
        <input type="password" name="currentPassword" value={password.currentPassword} onChange={handlePasswordChange} />
      </div>
      <div className="input-group">
        <label>New Password:</label>
        <input type="password" name="newPassword" value={password.newPassword} onChange={handlePasswordChange} />
      </div>
      <div className="input-group">
        <label>Confirm New Password:</label>
        <input type="password" name="confirmPassword" value={password.confirmPassword} onChange={handlePasswordChange} />
      </div>
      <button className="reset-button" onClick={handleReset}>Reset</button>
    </div>
  );
};

export default ChangePassword;
