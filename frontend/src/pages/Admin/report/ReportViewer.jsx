import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../../../components/admin side bar";
import "./ReportViewer.css";

const ReportAndFilePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [sampleRequestData, setSampleRequestData] = useState([]);
  const [filter, setFilter] = useState("today");

  const [file, setFile] = useState(null);
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [showFileForm, setShowFileForm] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/reports/attendance?filter=${filter}`)
      .then((res) => {
        setAttendanceData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching attendance data:", err);
        setAttendanceData([]);
      });

    axios
      .get(`http://localhost:5000/api/reports/sample-requests?filter=${filter}`)
      .then((res) => {
        setSampleRequestData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching sample request data:", err);
        setSampleRequestData([]);
      });
  }, [filter]);

  const exportAttendancePDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["First Name", "Last Name", "Status", "Date"]],
      body: attendanceData.map((row) => [
        row.firstname,
        row.lastname,
        row.status,
        row.date,
      ]),
    });
    doc.save(`attendance_report_${filter}.pdf`);
  };

  const exportSampleRequestPDF = () => {
    const doc = new jsPDF();
    doc.text("Sample Request Report", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["First Name", "Last Name", "Samples", "Location", "Time", "Date"]],
      body: sampleRequestData.map((row) => [
        row.firstname,
        row.lastname,
        row.number_of_samples,
        row.location,
        row.collection_time,
        new Date(row.request_date).toLocaleDateString(),
      ]),
    });
    doc.save(`sample_request_report_${filter}.pdf`);
  };

  const handleSendFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);
    formData.append("message", message);

    const res = await fetch("http://localhost:5000/api/send-file", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("File sent!");
      setShowFileForm(false);
    } else {
      alert("Error sending file.");
    }
  };

  return (
    <div className="flex">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h2 className="text-2xl font-bold mb-4">Reports and File Sending</h2>

        <div className="filter-controls">
          <div className="filter-section">
            <label htmlFor="filter" className="mr-2 font-medium">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border p-1"
            >
              <option value="today">Today</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <button
            onClick={() => setShowFileForm(true)}
            className="send-file-btn"
          >
            Send File
          </button>
        </div>

        {/* Attendance Report */}
        <div className="report-section">
          <div className="report-header">
            <h3 className="text-xl font-semibold">Attendance Report</h3>
            <button
              onClick={exportAttendancePDF}
              className="export-btn"
            >
              Export PDF
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length > 0 ? (
                  attendanceData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.firstname}</td>
                      <td>{row.lastname}</td>
                      <td>{row.status}</td>
                      <td>{row.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No attendance data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sample Request Report */}
        <div className="report-section">
          <div className="report-header">
            <h3 className="text-xl font-semibold">Sample Request Report</h3>
            <button
              onClick={exportSampleRequestPDF}
              className="export-btn"
            >
              Export PDF
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Samples</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sampleRequestData.length > 0 ? (
                  sampleRequestData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.firstname}</td>
                      <td>{row.lastname}</td>
                      <td>{row.number_of_samples}</td>
                      <td>{row.location}</td>
                      <td>{row.collection_time}</td>
                      <td>
                        {new Date(row.request_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No sample requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popup File Send Form */}
        {showFileForm && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>Send File</h3>
              <form onSubmit={handleSendFile}>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                <input
                  type="text"
                  placeholder="Sender ID"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Receiver ID"
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <div className="popup-buttons">
                  <button type="submit">Send File</button>
                  <button type="button" onClick={() => setShowFileForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAndFilePage;
