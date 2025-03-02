import React from "react";
import "./BSC Side bar.css"; // Ensure correct import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBox, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const BSCSidebar = () => {
  return (
    <div className="sidebar">
      <button className="sidebar-item active">
        <FontAwesomeIcon icon={faUser} /> Profile
      </button>
      <button className="sidebar-item">
        <FontAwesomeIcon icon={faBox} /> Collection Requests
      </button>
      <button className="sidebar-item logout">
        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
      </button>
    </div>
  );
};

export default BSCSidebar;
