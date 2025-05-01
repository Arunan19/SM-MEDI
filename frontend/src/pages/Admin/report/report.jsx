import React, { useState, useEffect } from 'react';
import './Report.css';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newReport, setNewReport] = useState({
    patient_id: '',
    test_id: '',
    result: '',
    date: '',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewReport({ ...newReport, [e.target.name]: e.target.value });
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });
      if (response.ok) {
        fetchReports();
        setShowPopup(false);
        setNewReport({ patient_id: '', test_id: '', result: '', date: '' });
      }
    } catch (error) {
      console.error('Error adding report:', error);
    }
  };

  return (
    <div className="report-page-container">
      <div className="content">
        <div className="table-section">
          <div className="table-header">
            <h2>Test Reports</h2>
            <button onClick={() => setShowPopup(true)}>+ Add Report</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Test ID</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.patient_id}</td>
                  <td>{report.test_id}</td>
                  <td>{report.result}</td>
                  <td>{report.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>Add New Report</h3>
              <form onSubmit={handleAddReport}>
                <input
                  type="text"
                  name="patient_id"
                  placeholder="Patient ID"
                  value={newReport.patient_id}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="test_id"
                  placeholder="Test ID"
                  value={newReport.test_id}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="result"
                  placeholder="Result"
                  value={newReport.result}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={newReport.date}
                  onChange={handleInputChange}
                  required
                />
                <div className="popup-buttons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
