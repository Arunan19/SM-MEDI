import React from "react";
import Sidebar from "../../../components/doctor side bar"; // Adjust path as needed
import "./make request.css";

const MakeRequest = () => {
  return (
    <div className="make-request-page">
      <Sidebar />
      <div className="make-request-container">
        <div className="request-card">
          <h2>Make Request</h2>
          <form>
            <label>No of Samples</label>
            <input type="number" placeholder="Enter number of samples" required />

            <label>Location</label>
            <input type="text" placeholder="Enter location" required />

            <label>Time to collect</label>
            <input type="time" required />

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeRequest;
