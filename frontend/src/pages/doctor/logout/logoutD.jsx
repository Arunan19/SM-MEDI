import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/doctor side bar";
import ConfirmLogout from "../../../components/ConfirmLogout"; // Import reusable logout box
import "./LogoutD.css";

const LogoutD = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/"); // Redirect to login page
  };

  const handleCancel = () => {
    navigate("/profile"); // Redirect back to profile
  };

  return (
    <div className="container">
      <Sidebar active="Logout" />
      <div className="content">
        <ConfirmLogout onConfirm={handleLogout} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default LogoutD;
