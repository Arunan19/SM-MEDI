import React, { useState } from "react";
import "./User Details.css";
import ChangePassword from "./ChangePassword";
import EditUserDetails from "./EditUserDetails";

const UserDetails = ({ user }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="user-card">
      <div className="user-info">
        <h3>{user?.firstname} {user?.lastname}</h3>
        <p><strong>User ID:</strong> {user?.userid}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Address:</strong> {user?.address || "N/A"}</p>
        <p><strong>Phone:</strong> {user?.phonenumber || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
      </div>
      <div className="user-actions">
        <button onClick={() => setShowPasswordModal(true)} className="action-button">
          Change Password
        </button>
        <button onClick={() => setShowEditModal(true)} className="action-button">
          Edit Details
        </button>
      </div>

      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowPasswordModal(false)}>✖</button>
            <ChangePassword />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowEditModal(false)}>✖</button>
            <EditUserDetails user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
