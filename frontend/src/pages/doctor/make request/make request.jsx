import React, { useState } from "react";
import Sidebar from "../../../components/doctor side bar";
import "./make request.css";

const MakeRequest = () => {
  const [samples, setSamples] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID is required.");
      return;
    }

    // Convert time to HH:MM:SS format
    const formattedTime = time.length === 5 ? `${time}:00` : time;

    const requestData = {
      user_id: userId,
      number_of_samples: parseInt(samples),
      location,
      collection_time: formattedTime,
    };

    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      const data = await response.json();
      alert("Request submitted successfully!");
      // Optionally reset form
      setSamples("");
      setLocation("");
      setTime("");
      setUserId("");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to submit request.");
    }
  };

  return (
    <div className="make-request-page">
      <Sidebar />
      <div className="make-request-container">
        <div className="request-card">
          <h2>Make Request</h2>
          <form onSubmit={handleSubmit}>
            <label>User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your User ID"
              required
            />

            <label>No of Samples</label>
            <input
              type="number"
              value={samples}
              onChange={(e) => setSamples(e.target.value)}
              placeholder="Enter number of samples"
              required
            />

            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              required
            />

            <label>Time to collect</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeRequest;
