const db = require('../config/db');

// Get all lab tests
exports.getAllLabTests = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const query = `SELECT * FROM lab_tests`;
    const [labTests] = await connection.query(query);

    if (labTests.length === 0) {
      return res.status(404).json({ message: 'No lab tests found' });
    }

    res.status(200).json({
      message: 'Lab tests retrieved successfully',
      labTests,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Add a new lab test
exports.addLabTest = async (req, res) => {
  const connection = await db.getConnection();
  const { test_name, description, test_type, price, duration, added_by } = req.body;

  try {
    if (!test_name || !price || !test_type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO lab_tests (test_name, description, test_type, price, duration, added_by)
      VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [test_name, description, test_type, price, duration, added_by];

    await connection.query(query, values);

    res.status(201).json({ message: 'Lab test added successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Update an existing lab test
exports.updateLabTest = async (req, res) => {
  const connection = await db.getConnection();
  const { test_id } = req.params;
  const { test_name, description, test_type, price, duration } = req.body;

  try {
    const query = `
      UPDATE lab_tests SET 
        test_name = ?, description = ?, test_type = ?, 
        price = ?, duration = ?, updated_at = NOW()
      WHERE test_id = ?`;
    const values = [test_name, description, test_type, price, duration, test_id];

    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lab test not found' });
    }

    res.status(200).json({ message: 'Lab test updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};
