import React, { useState } from "react";
import "./EditUserDetails.css";

const EditUserDetails = ({ user }) => {
  const [userData, setUserData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    phone: user.phonenumber || "",
    email: user.email || "",
    address: user.address || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setMessage(""); // Clear any previous messages
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await fetch(`http://localhost:5000/api/users/${user.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        setMessage(errorData.message || "Failed to update user details.");
        return;
      }

      const successData = await response.json();
      console.log("Success response from server:", successData);
      setMessage("User details updated successfully!");
    } catch (error) {
      console.error("Error updating user details:", error);
      setMessage("An error occurred while updating user details.");
    }
  };

  return (
    <div className="edit-user-section">
      <h3>Edit User Details</h3>
      {message && <p className="message">{message}</p>}
      <div className="input-group">
        <label>First Name:</label>
        <input type="text" name="firstname" value={userData.firstname} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Last Name:</label>
        <input type="text" name="lastname" value={userData.lastname} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Phone Number:</label>
        <input type="text" name="phone" value={userData.phone} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Email:</label>
        <input type="email" name="email" value={userData.email} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Address:</label>
        <input type="text" name="address" value={userData.address} onChange={handleChange} />
      </div>
      <button className="save-button" onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditUserDetails;
