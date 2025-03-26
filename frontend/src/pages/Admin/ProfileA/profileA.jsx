import React, { useEffect, useState } from "react";
import "./profileA.css";
import Sidebar from "../../../components/admin side bar";
import UserDetails from "../../../components/user details";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/arunan", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <h1 className="header-title">S.M. Medi Lab</h1>
        <div className="card-container">
          <UserDetails user={user} role={user.role} /> {/* Use correct prop name */}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
