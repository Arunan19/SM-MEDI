import React from "react";
import Sidebar from "../../../components/BSC side bar";
import UserDetails from "../../../components/user details";
import ChangePassword from "../../../components/ChangePassword";
import "./profileB.css";

const BSCProfile = () => {
  const userData = {
    id: "BSC001",
    name: "Kajan Sathishkumar",
    address: "Suthumalai west, Manipay, Jaffna",
    phone: "0711405879",
    email: "kajith9@gmail.com",
    role: "BSC",
    profileImage: "",
  };

  return (
    <div className="bsc-container">
      <Sidebar />
      <div className="profile-content">
        <UserDetails user={userData} />
        <ChangePassword />
      </div>
    </div>
  );
};

export default BSCProfile;
