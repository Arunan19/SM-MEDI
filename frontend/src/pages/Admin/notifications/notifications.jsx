import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/admin side bar';
import './Notifications.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipient_id: '',
    recipient_role: 'Admin'
  });

  const notificationsPerPage = 15;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications');
      const data = await response.json();
      setNotifications(data.notifications.reverse()); // newest first
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNotification.title,
          message: newNotification.message,
          recipient_id: newNotification.recipient_id || null,
          recipient_role: newNotification.recipient_role || null
        })
      });

      if (response.ok) {
        fetchNotifications();
        setShowPopup(false);
        setNewNotification({
          title: '',
          message: '',
          recipient_id: '',
          recipient_role: 'Admin'
        });
        setCurrentPage(1); // Go to first page
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="notifications-page-container">
      <Sidebar />
      <div className="content">
        <div className="table-section">
          <div className="table-header">
            <h2>Notifications</h2>
            <button onClick={() => setShowPopup(true)}>+ Add Notification</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentNotifications.map((note, index) => (
                <tr key={index}>
                  <td>{note.title}</td>
                  <td>{note.message}</td>
                  <td>{new Date(note.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>Add New Notification</h3>
              <form onSubmit={handleAddNotification}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newNotification.title}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  value={newNotification.message}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="recipient_id"
                  placeholder="Recipient ID (optional)"
                  value={newNotification.recipient_id}
                  onChange={handleInputChange}
                />
                <select
                  name="recipient_role"
                  value={newNotification.recipient_role}
                  onChange={handleInputChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="MLT">MLT</option>
                  <option value="BCS">BCS</option>
                  <option value="Doctor">Doctor</option>
                  <option value="All">All</option>
                </select>
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

export default NotificationsPage;
