const db = require('../config/db');

// Create a new sample request
exports.createRequest = async (req, res) => {
    const connection = await db.getConnection();
    let { user_id, number_of_samples, location, collection_time } = req.body;
  
    try {
      if (!user_id || !number_of_samples || !location || !collection_time) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Convert to correct types
      user_id = parseInt(user_id);
      number_of_samples = parseInt(number_of_samples);
  
      // Validate TIME format (HH:MM:SS)
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timeRegex.test(collection_time)) {
        return res.status(400).json({ message: 'Invalid time format. Use HH:MM:SS' });
      }
  
      // Directly use collection_time without converting to Date
      const query = `
        INSERT INTO sample_requests (user_id, number_of_samples, location, collection_time)
        VALUES (?, ?, ?, ?)`;
  
      const values = [user_id, number_of_samples, location, collection_time];
      const [result] = await connection.query(query, values);
  
      res.status(201).json({ id: result.insertId, message: 'Request created' });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err.message });
    } finally {
      connection.release();
    }
  };
// Get all requests
exports.getAllRequests = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const query = 'SELECT * FROM sample_requests';
    const [requests] = await connection.query(query);

    if (requests.length === 0) {
      return res.status(404).json({ message: 'No sample requests found' });
    }

    res.status(200).json({
      message: 'Sample requests retrieved successfully',
      requests,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

exports.acceptRequestById = async (req, res) => {
    const connection = await db.getConnection();
  
    const requestId = req.params.id;
    const { assigned_to } = req.body;  // Get the 'assign_to' field from the request body
  
    if (!assigned_to) {
      return res.status(400).json({ message: "'assign_to' field is required" });
    }
  
    try {
      // Modify the query to update both 'status' and 'assign_to'
      const updateQuery = `
        UPDATE sample_requests
        SET status = 'Collected', assigned_to = ?
        WHERE id = ?
      `;
      const [result] = await connection.query(updateQuery, [assigned_to, requestId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Request not found or already updated' });
      }
  
      res.status(200).json({ message: 'Request marked as Collected and assigned successfully' });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'An error occurred', error: err.message });
    } finally {
      connection.release();
    }
  };
  
// Get a single request
exports.getRequestById = async (req, res) => {
  const connection = await db.getConnection();
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM sample_requests WHERE id = ?';
    const [request] = await connection.query(query, [id]);

    if (request.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      message: 'Request retrieved successfully',
      request: request[0],
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Update a request
exports.updateRequest = async (req, res) => {
  const connection = await db.getConnection();
  const { id } = req.params;
  const { number_of_samples, location, collection_time } = req.body;

  try {
    const query = `
      UPDATE sample_requests
      SET number_of_samples = ?, location = ?, collection_time = ?
      WHERE id = ?`;

    const values = [number_of_samples, location, collection_time, id];
    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Delete a request
exports.deleteRequest = async (req, res) => {
  const connection = await db.getConnection();
  const { id } = req.params;

  try {
    const query = 'DELETE FROM sample_requests WHERE id = ?';
    const [result] = await connection.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};
