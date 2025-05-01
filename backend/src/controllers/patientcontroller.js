const db = require('../config/db'); // Import database connection

// Get all patients
exports.getAllPatients = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const query = `SELECT * FROM patients`;
    const [patients] = await connection.query(query);

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    res.status(200).json({
      message: 'Patients retrieved successfully',
      patients,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Add a new patient
exports.addPatient = async (req, res) => {
  const connection = await db.getConnection();
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    contact_number,
    email,
    address,
    added_by,
  } = req.body;

  try {
    if (!first_name || !last_name || !gender) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO patients 
      (first_name, last_name, date_of_birth, gender, contact_number, email, address, added_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [first_name, last_name, date_of_birth, gender, contact_number, email, address, added_by];

    await connection.query(query, values);

    res.status(201).json({ message: 'Patient added successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Update patient details
exports.updatePatient = async (req, res) => {
  const connection = await db.getConnection();
  const { patient_id } = req.params;
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    contact_number,
    email,
    address,
  } = req.body;

  try {
    const query = `
      UPDATE patients SET 
        first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, 
        contact_number = ?, email = ?, address = ?, updated_at = NOW() 
      WHERE patient_id = ?`;

    const values = [
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact_number,
      email,
      address,
      patient_id,
    ];

    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};
