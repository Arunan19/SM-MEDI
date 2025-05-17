import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/MLT side bar ";
import UserDetails from "../../../components/user details";
import "./profileM.css";

const MLTProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch("http://localhost:5000/api/users/arunan", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="bsc-container">
      <Sidebar />
      <div className="profile-content">
      <h1 className="header-titleB">S.M. Medi Lab</h1>
        <div className="card-container">
          <UserDetails user={user} role={user.Role} />
        </div>
      </div>
    </div>
  );
};

export default MLTProfile;
