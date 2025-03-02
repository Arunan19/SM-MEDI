import React from "react";
import "./ConfirmLogout.css"; // Import styles

const ConfirmLogout = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirm-logout">
      <h3>Confirm Logout</h3>
      <div className="button-group">
        <button className="yes-btn" onClick={onConfirm}>Yes</button>
        <button className="no-btn" onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default ConfirmLogout;
