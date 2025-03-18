import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/admin side bar";
import "./regesteruser.css";

const RegisterUser = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    address: "", // ✅ Added Address field
    password: "",
    role: "Admin",
  });
  const [deleteUser, setDeleteUser] = useState({
    userId: "",
    adminUsername: "",
    password: "",
  });
  const [filterRole, setFilterRole] = useState(""); // Add state for filter role

  // Fetch users from the backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleDeleteInputChange = (e) => {
    setDeleteUser({ ...deleteUser, [e.target.name]: e.target.value });
  };

  // Add user function
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("User added successfully!");
        fetchUsers();
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          address: "",
          password: "",
          role: "Admin",
        });
      } else {
        const errorMessage = await response.json();
        alert(errorMessage.message);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Delete user function
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteUser),
      });

      if (response.ok) {
        alert("User deleted successfully!");
        fetchUsers();
        setDeleteUser({ userId: "", adminUsername: "", password: "" });
      } else {
        const errorMessage = await response.json();
        alert(errorMessage.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Filter users by role
  const filteredUsers = filterRole
    ? users.filter((user) => user.role === filterRole)
    : users;

  return (
    <div className="register-container"> {/* Ensure this class name matches the CSS */}
      <Sidebar />
      <div className="content">
        <h1 className="title">Register User</h1>

        <div className="forms-container">
          {/* Add User Form */}
          <div className="form-container add-form">
            <h2>Add User</h2>
            <form onSubmit={handleAddUser}>
              <label>First Name:</label>
              <input type="text" name="firstName" value={newUser.firstName} onChange={handleInputChange} required />

              <label>Last Name:</label>
              <input type="text" name="lastName" value={newUser.lastName} onChange={handleInputChange} required />

              <label>Email:</label>
              <input type="email" name="email" value={newUser.email} onChange={handleInputChange} required />

              <label>Username:</label>
              <input type="text" name="username" value={newUser.username} onChange={handleInputChange} required />

              <label>Address:</label> {/* ✅ Added Address */}
              <input type="text" name="address" value={newUser.address} onChange={handleInputChange} required />

              <label>Password:</label>
              <input type="password" name="password" value={newUser.password} onChange={handleInputChange} required />

              <label>Role:</label>
              <select name="role" value={newUser.role} onChange={handleInputChange}>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="MLT">MLT</option>
                <option value="BCS">BCS</option>
              </select>

              <button type="submit">Add</button>
            </form>
          </div>

          {/* Delete User Form */}
          <div className="form-container delete-form">
            <h2>Delete User</h2>
            <form onSubmit={handleDeleteUser}>
              <label>User ID:</label>
              <input type="text" name="userId" value={deleteUser.userId} onChange={handleDeleteInputChange} required />

              <label>Username for Admin:</label>
              <input type="text" name="adminUsername" value={deleteUser.adminUsername} onChange={handleDeleteInputChange} required />

              <label>Password:</label>
              <input type="password" name="password" value={deleteUser.password} onChange={handleDeleteInputChange} required />

              <button type="submit">Delete</button>
            </form>
          </div>
        </div>

        {/* User Table */}
        <div className="table-container">
          <h2>User Details</h2>
          <div className="filter-container">
            <label>Filter by Role:</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="MLT">MLT</option>
              <option value="BCS">BCS</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Address</th> {/* ✅ Address Column Added */}
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredUsers) &&
                filteredUsers.map((user) => (
                  <tr key={user.UserId}>
                    <td>{user.userid}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.address}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default RegisterUser;
