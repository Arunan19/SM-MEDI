import React, { useState } from "react";

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
    <div>
      <h2>Received Files</h2>

      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter your user ID"
      />
      <button onClick={handleFetchFiles}>Load Files</button>

      {loaded && files.length === 0 && <p>No files received.</p>}

      <ul>
        {files.map((file) => (
          <li key={file.id}>
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
  );
};

export default ReceivedFiles;
