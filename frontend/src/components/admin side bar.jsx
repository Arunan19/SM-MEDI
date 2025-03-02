import React from "react";
import "./admin side bar.css";  // Fixed import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faCalendarCheck, faBox, faUsers, faFileAlt, faUserInjured, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <button className="sidebar-item active"><FontAwesomeIcon icon={faUser} /> Profile</button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faUserPlus} /> Register User</button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faCalendarCheck} /> Attendance</button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faBox} /> Inventory</button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faUsers} /> Recruit Staff</button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faFileAlt} /> Reports</button>
      <button className="sidebar-item"><FontAwesomeIcon icon={faUserInjured} /> Patients</button>
      <button className="sidebar-item logout"><FontAwesomeIcon icon={faSignOutAlt} /> Logout</button>
    </div>
  );
};

export default Sidebar;
