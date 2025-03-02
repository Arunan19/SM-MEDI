import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Doctor Side bar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faFileAlt, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="sidebar">
      <button className="sidebar-item" onClick={() => navigate("/profile")}>
        <FontAwesomeIcon icon={faUser} className="icon" /> Profile
      </button>
      <button className="sidebar-item" onClick={() => navigate("/make-request")}>
        <FontAwesomeIcon icon={faClipboardList} className="icon" /> Make Request
      </button>
      <button className="sidebar-item" onClick={() => navigate("/reports")}>
        <FontAwesomeIcon icon={faFileAlt} className="icon" /> Reports
      </button>
      <button className="sidebar-item logout" onClick={() => navigate("/logout")}>
        <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
