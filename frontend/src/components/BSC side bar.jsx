import React from "react";
import "./BSC Side bar.css"; // Ensure correct import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBox, faSignOutAlt, faUsers } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

const BSCSidebar = () => {
  const navigate = useNavigate(); 

  return (
    <div className="sidebar">
      <button className="sidebar-item active" onClick={() => navigate("/bsc-profile")}>
        <FontAwesomeIcon icon={faUser} /> Profile
      </button>
      <button className="sidebar-item"onClick={() => navigate("/collection-requests")}>
        <FontAwesomeIcon icon={faBox} /> Collection Requests
      </button>
      <button className="sidebar-item"onClick={() => navigate("/notificationBCS")}>
        <FontAwesomeIcon icon={faUsers} /> Notifications
      </button>
      <button className="sidebar-item logout"onClick={() => navigate("/logoutB")}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
      </button>
    </div>
  );
};

export default BSCSidebar;

      