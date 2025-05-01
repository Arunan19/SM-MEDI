import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/admin side bar";
import "./regesteruser.css";

const RegisterUser = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    address: "",
    password: "",
    role: "Admin",
  });

  const [deleteUser, setDeleteUser] = useState({
    userId: "",
    adminUsername: "",
    password: "",
  });

  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }; 

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleDeleteInputChange = (e) => {
    setDeleteUser({ ...deleteUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("User added successfully!");
        fetchUsers();
        setShowRegisterPopup(false);
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          address: "",
          password: "",
          phone: "",
          role: "Admin",
        });
      } else {
        const errorMessage = await response.json();
        alert(errorMessage.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

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
        setShowDeletePopup(false);
        setDeleteUser({ userId: "", adminUsername: "", password: "" });
      } else {
        const errorMessage = await response.json();
        alert(errorMessage.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="register-container">
      <Sidebar />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th colSpan="8" className="table-header">
                <div className="table-header-content">
                  <h2>User Details      
                  <button className="open-popup-btn" onClick={() => setShowRegisterPopup(true)}>
                    Register User
                  </button></h2>
                </div>
              </th>
            </tr>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userid}>
                <td>{user.userid}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      setDeleteUser({ userId: user.userid, adminUsername: "", password: "" });
                      setShowDeletePopup(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register User Popup */}
      {showRegisterPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add User</h2>
            <form onSubmit={handleAddUser}>
              <div className="form-row">
                <label>First Name:</label>
                <input type="text" name="firstname" value={newUser.firstname} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Last Name:</label>
                <input type="text" name="lastname" value={newUser.lastname} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Email:</label>
                <input type="email" name="email" value={newUser.email} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Username:</label>
                <input type="text" name="username" value={newUser.username} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Address:</label>
                <input type="text" name="address" value={newUser.address} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Password:</label>
                <input type="password" name="password" value={newUser.password} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Phone:</label>
                <input type="phone" name="phone" value={newUser.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <label>Role:</label>
                <select name="role" value={newUser.role} onChange={handleInputChange}>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="MLT">MLT</option>
                  <option value="BCS">BCS</option>
                </select>
              </div>
              <button type="submit">Add</button>
              <button type="button" className="close-popup-btn" onClick={() => setShowRegisterPopup(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Popup */}
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Delete User</h2>
            <form onSubmit={handleDeleteUser}>
              <label>Username for Admin:</label>
              <input
                type="text"
                name="adminUsername"
                value={deleteUser.Username}
                onChange={handleDeleteInputChange}
                required
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={deleteUser.password}
                onChange={handleDeleteInputChange}
                required
              />

              <button type="submit">Confirm Delete</button>
              <button type="button" className="close-popup-btn" onClick={() => setShowDeletePopup(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
