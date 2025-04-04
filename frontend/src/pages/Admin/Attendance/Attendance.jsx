import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/admin side bar";
import "./Attendance.css";

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [manualAttendance, setManualAttendance] = useState({
    employeeId: "",
    date: "",
    status: "Present",
  });

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/attendance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch attendance records");
      }

      const data = await response.json();
      setAttendanceRecords(data.attendance);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const handleManualAttendanceChange = (e) => {
    setManualAttendance({ ...manualAttendance, [e.target.name]: e.target.value });
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(manualAttendance),
      });

      if (response.ok) {
        alert("Attendance marked successfully!");
        fetchAttendanceRecords();
        setManualAttendance({ employeeId: "", date: "", status: "Present" });
      } else {
        alert("Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const handleMarkAbsent = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/attendance/auto-mark-absent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Absent marked successfully!");
        fetchAttendanceRecords();
      } else {
        alert("Failed to mark absent");
      }
    } catch (error) {
      console.error("Error marking absent:", error);
    }
  };

  return (
    <div className="attendance-container">
      <Sidebar />
      <div className="table-container">
        <h2>Mark Attendance</h2>
        <form onSubmit={handleMarkAttendance} className="attendance-form">
          <label>Employee ID:</label>
          <input type="text" name="userid" value={manualAttendance.userid} onChange={handleManualAttendanceChange} required />

          <label>Date:</label>
          <input type="date" name="date" value={manualAttendance.date} onChange={handleManualAttendanceChange} required />

          <label>Status:</label>
          <select name="status" value={manualAttendance.status} onChange={handleManualAttendanceChange}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
          </select>

          <button type="submit">Mark Attendance</button>
        </form>

        <button onClick={handleMarkAbsent} className="mark-absent-btn">Mark Absent</button>

        <table>
          <thead>
            <tr>
              <th colSpan="5" className="table-header">
                <div className="table-header-content">
                  <h2>Attendance Records</h2>
                </div>
              </th>
            </tr>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.Attendance_id}>
                <td>{record.employeeId}</td> {/* Use 'username' instead of 'employeeId' */}
                <td>{record.firstname}</td> {/* Ensure 'firstname' matches backend */}
                <td>{record.lastname}</td> {/* Ensure 'lastname' matches backend */}
                <td>{record.date}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
