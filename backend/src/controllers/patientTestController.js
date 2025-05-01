const db = require('../config/db');

// Get all patient test records
exports.getAllPatientTests = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const query = `
      SELECT pt.patient_tests_id, pt.patient_id, p.first_name, p.last_name,
             pt.test_id, lt.test_name, pt.added_by
      FROM patient_tests pt
      LEFT JOIN patients p ON pt.patient_id = p.patient_id
      LEFT JOIN lab_tests lt ON pt.test_id = lt.test_id
    `;
    const [patientTests] = await connection.query(query);

    if (patientTests.length === 0) {
      return res.status(404).json({ message: 'No patient tests found' });
    }

    res.status(200).json({
      message: 'Patient test records retrieved successfully',
      patientTests,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Add a new patient test record
exports.addPatientTest = async (req, res) => {
  const connection = await db.getConnection();
  const { patient_id, test_id, added_by } = req.body;

  try {
    if (!patient_id || !test_id || !added_by) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO patient_tests (patient_id, test_id, added_by)
      VALUES (?, ?, ?)`;
    const values = [patient_id, test_id, added_by];

    await connection.query(query, values);

    res.status(201).json({ message: 'Patient test record added successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Update a patient test record
exports.updatePatientTest = async (req, res) => {
  const connection = await db.getConnection();
  const { patient_tests_id } = req.params;
  const { patient_id, test_id } = req.body;

  try {
    const query = `
      UPDATE patient_tests SET 
        patient_id = ?, test_id = ?
      WHERE patient_tests_id = ?`;
    const values = [patient_id, test_id, patient_tests_id];

    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient test record not found' });
    }

    res.status(200).json({ message: 'Patient test record updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};
