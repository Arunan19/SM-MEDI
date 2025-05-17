import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/MLT side bar ";
import "./Test request.css";

const TestRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignToMap, setAssignToMap] = useState({}); // Map of assign_to by request ID

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/requests");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.requests)) {
          throw new Error("Expected 'requests' array but got: " + JSON.stringify(data));
        }

        const filteredRequests = data.requests.filter((request) =>
          request.request_date.startsWith(today)
        );

        setRequests(filteredRequests);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [today]);

  const handleAccept = async (requestId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    const assignedTo = assignToMap[requestId];

    if (!assignedTo) {
      alert("Please specify who to assign the request to.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assigned_to: assignedTo }), // ✅ correct field name
      });

      const data = await response.json();

      if (response.ok) {
        alert("Request marked as collected and assigned.");
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        const newMap = { ...assignToMap };
        delete newMap[requestId];
        setAssignToMap(newMap);
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Accept error:", err);
      alert("An error occurred while accepting the request.");
    }
  };

  return (
    <div className="collection-requests-page">
      <Sidebar />
      <div className="collection-requests-container">
        <h2>Test Requests</h2>
        <h3>Test Requests for {today}</h3>

        {loading ? (
          <p>Loading requests...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : requests.length === 0 ? (
          <p>No Test requests found for today.</p>
        ) : (
          <div className="requests-list">
            {requests.map((req) => (
              <div className="request-card" key={req.id}>
                <div className="request-info">
                  <p><strong>Doctor ID</strong>: {req.user_id}</p>
                  <p><strong>No of Samples</strong>: {req.number_of_samples}</p>
                  <p><strong>Location</strong>: {req.location}</p>
                  <p><strong>Collection Time</strong>: {req.collection_time}</p>
                </div>

                <div className="assign-to-container">
                  <input
                    type="text"
                    placeholder="Assign to..."
                    value={assignToMap[req.id] || ""}
                    onChange={(e) =>
                      setAssignToMap({ ...assignToMap, [req.id]: e.target.value })
                    }
                  />
                </div>

                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestRequests;
