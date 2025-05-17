import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/BSC side bar';
import './NotificationsPage.css';

const NotificationPage = () => {
  const [userId, setUserId] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications`, {
        params: { userid: userId.trim(), role: 'BCS' },
      });
      setNotifications(Array.isArray(response.data.notifications) ? response.data.notifications : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-container">
      <Sidebar />
      <div className="notification-content">
        <h2>BCS Notifications</h2>

        <form onSubmit={fetchNotifications} className="notification-form">
          <div className="form-row">
            <label htmlFor="userid">Enter User ID:</label>
            <input
              id="userid"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="Enter your user ID"
            />
            <button type="submit">Fetch</button>
          </div>
        </form>

        {loading && <div className="loading">Loading...</div>}
        {error && <p className="error-message">{error}</p>}

        <div className="notification-list">
          {notifications.length === 0 && !loading && <p>No notifications found.</p>}
          {notifications.map((note) => (
            <div className="notification-card" key={note.notification_id}>
              <h3>{note.title}</h3>
              <p>{note.message}</p>
              <small>{new Date(note.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;