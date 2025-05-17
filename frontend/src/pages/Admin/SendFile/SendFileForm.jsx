import React, { useState } from "react";
import Sidebar from "../../../components/admin side bar";
import "./SendFileForm.css";

const SendFilePage = () => {
  const [file, setFile] = useState(null);
  const [senderId, setSenderId] = useState('');      // Added state
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [showFileForm, setShowFileForm] = useState(false);

  const handleSendFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', senderId); // Use dynamic sender ID
    formData.append('receiverId', receiverId);
    formData.append('message', message);

    const res = await fetch('http://localhost:5000/api/send-file', {
        method: 'POST',
        body: formData,
      });

    const data = await res.json();
    if (data.success) {
      alert('File sent!');
      setShowFileForm(false);
    } else {
      alert('Error sending file.');
    }
  };

  return (
    <div className="send-file-container">
      <Sidebar />
      <div className="content">
        <div className="table-section">
          <div className="table-header">
            <h2>Send File</h2>
            <button onClick={() => setShowFileForm(true)}>Send File</button>
          </div>
        </div>

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

export default SendFilePage;
