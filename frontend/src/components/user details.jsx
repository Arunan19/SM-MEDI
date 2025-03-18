import React, { useState, useEffect } from "react";
import "./User Details.css";
import ChangePassword from "./ChangePassword";
import EditUserDetails from "./EditUserDetails";

const UserDetails = ({ user }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userDetails, setUserDetails] = useState(user);

  // Update state when user prop changes
  useEffect(() => {
    setUserDetails(user);
  }, [user]);

  const handleSaveDetails = (updatedUser) => {
    setUserDetails(updatedUser);
    setShowEditModal(false);
  };

  return (
    <div className="user-card">
      <div className="user-image">
        <img 
          src={userDetails?.profileImage || "https://via.placeholder.com/100"} 
          alt="User Profile" 
        />
      </div>
      <div className="user-info">
        <h3>{userDetails?.firstname} {userDetails?.lastname}</h3>
        <p><strong>User ID:</strong> {userDetails?.userid}</p>
        <p><strong>Role:</strong> {userDetails?.role}</p>
        <p><strong>Address:</strong> {userDetails?.address || "N/A"}</p>
        <p><strong>Phone:</strong> {userDetails?.phonenumber || "N/A"}</p>
        <p><strong>Email:</strong> {userDetails?.email || "N/A"}</p>
      </div>
      <div className="user-actions">
        <button onClick={() => setShowPasswordModal(true)} className="action-button">
          Change Password
        </button>
        <button onClick={() => setShowEditModal(true)} className="action-button">
          Edit Details
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowPasswordModal(false)}>✖</button>
            <ChangePassword />
          </div>
        </div>
      )}

      {/* Edit User Details Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowEditModal(false)}>✖</button>
            <EditUserDetails user={userDetails} onSave={handleSaveDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
