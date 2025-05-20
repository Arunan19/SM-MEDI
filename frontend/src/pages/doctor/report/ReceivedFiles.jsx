import React, { useState } from "react";
import Sidebar from "../../../components/doctor side bar"; // adjust the path based on your structure
import "./report.css"; // adjust the path if needed

const ReceivedFiles = () => {
  const [userId, setUserId] = useState("");
  const [files, setFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const handleFetchFiles = () => {
    if (!userId) {
      alert("Please enter a user ID.");
      return;
    }

    fetch(`http://localhost:5000/api/sent-files/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch files");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setFiles(data.files);
          setLoaded(true);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Error fetching files");
      });
  };

  return (
    <div className="received-files-container">
      <Sidebar />
      <div className="received-files-content">
        <h2>Received Files</h2>

        <div className="input-section">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
          />
          <button onClick={handleFetchFiles}>Load Files</button>
        </div>

        {loaded && files.length === 0 && <p>No files received.</p>}

        <ul className="file-list">
          {files.map((file) => (
            <li key={file.id} className="file-item">
              <p><strong>From:</strong> {file.sender_id}</p>
              <p><strong>Message:</strong> {file.message}</p>
              <a
                href={file.file_path}
                download={file.file_name}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download {file.file_name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReceivedFiles;
