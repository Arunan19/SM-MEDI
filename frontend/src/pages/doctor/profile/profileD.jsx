import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/doctor side bar";
import UserDetails from "../../../components/user details";
import ChangePassword from "../../../components/ChangePassword";    
import "./ProfileD.css";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/doctor/1")
      .then((response) => {
        console.log("Doctor data fetched:", response.data); // Log the fetched data
        setDoctor(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error); // Log the error
        console.error("Error details:", error.response ? error.response.data : error.message); // Log detailed error
      });
  }, []);

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        {doctor ? <UserDetails doctor={doctor} /> : <p>Loading...</p>} {/* Add a loading state */}
        <ChangePassword />
      </div>
    </div>
  );
};

export default DoctorProfile;
