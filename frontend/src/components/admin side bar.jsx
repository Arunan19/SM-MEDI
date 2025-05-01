import React from "react";
import "./admin side bar.css";  // Fixed import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faCalendarCheck, faBox, faUsers, faFileAlt, faUserInjured, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Add this line

const Sidebar = () => {
  const navigate = useNavigate(); // Add this line

  return (
    <div className="sidebar">
      <button className="sidebar-item active" onClick={() => navigate("/admin")}>
              <FontAwesomeIcon icon={faUser} className="icon" /> Profile
      </button>
      <button className="sidebar-item" onClick={() => navigate("/registeruser")}>
              <FontAwesomeIcon icon={faUser} className="icon" /> Register User
      </button>
      <button className="sidebar-item"onClick={() => navigate("/attendance")}>
        <FontAwesomeIcon icon={faCalendarCheck} className="icon"/> Attendance
      </button>
      <button className="sidebar-item"onClick={() => navigate("/inventory")}>
        <FontAwesomeIcon icon={faBox} className="icon"/> Inventory
        </button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faUsers} /> Recruit Staff</button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faFileAlt} /> Reports</button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faUserInjured} /> Patients</button>
      <button className="sidebar-item logout"><FontAwesomeIcon icon={faSignOutAlt} /> Logout</button>
    </div>
  );
};

export default Sidebar;
