import React, { useState } from "react";
import "./EditUserDetails.css"; 

const EditUserDetails = ({ user, onSave }) => {
  const [userData, setUserData] = useState({
    first_name: user.firstname || "",
    last_name: user.lastname || "",
    phone: user.phonenumber || "",
    email: user.email || "",
    address: user.address || "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(userData);
  };

  return (
    <div className="edit-user-section">
      <h3>Edit User Details</h3>
      <div className="input-group">
        <label>First Name:</label>
        <input type="text" name="first_name" value={userData.first_name} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Last Name:</label>
        <input type="text" name="last_name" value={userData.last_name} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Phone Number:</label>
        <input type="text" name="phonenumber" value={userData.phone} onChange={handleChange} />
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
