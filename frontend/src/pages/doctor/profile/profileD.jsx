import React, { useEffect, useState } from "react";
import "./ProfileD.css";
import Sidebar from "../../../components/doctor side bar";
import UserDetails from "../../../components/user details";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const token = localStorage.getItem("token"); // Get token from localStorage

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/arunan", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }

        const doctorData = await response.json();
        setDoctor(doctorData);
      } catch (error) {
        console.error("Error fetching doctor:", error.message);
      }
    };

    fetchDoctor();
  }, []);

  if (!doctor) {
    return <p>Loading doctor details...</p>;
  }

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <h1 className="header-title">S.M. Medi Lab - Doctor Profile</h1>
        <div className="card-container">
          <UserDetails user={doctor} role={doctor.role} />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
