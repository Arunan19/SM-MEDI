import React, { useEffect, useState } from "react";
import "./profileA.css";
import Sidebar from "../../../components/admin side bar";
import UserDetails from "../../../components/user details";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetch("/api/user/admin/profile", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Ensure token is sent
      }
    })
      .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then(text => {
            console.error('Server error:', text);
            throw new Error(`Server error: ${response.status}`);
          });
        }
      })
      .then(data => {
        console.log('Fetched admin data:', data);
        setAdmin(data);
      })
      .catch(error => console.error("Error fetching admin data:", error));
  }, []);

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <h1 className="header-title">S.M. Medi Lab</h1>
        <div className="card-container">
          <UserDetails user={admin} role="Admin" />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
