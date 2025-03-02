import React from "react";
import Sidebar from "../../../components/BSC side bar"; // Adjust path as needed
import "./collection request.css";

const CollectionRequests = () => {
  return (
    <div className="collection-requests-page">
      <Sidebar />
      <div className="collection-requests-container">
        <div className="request-card">
          <h2>Collection Requests</h2>
          <div className="request-info">
            <p><strong>Doctor ID</strong>: D001</p>
            <p><strong>Name</strong>: Thamraj Suresh</p>
            <p><strong>No of Samples</strong>: 25</p>
            <p><strong>Location</strong>: Suthumalai North, Manipay, Jaffna.</p>
          </div>
          <button className="accept-btn">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default CollectionRequests;
