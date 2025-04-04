const db = require('../config/db'); // Import database connection

// Get all equipment
exports.getAllEquipment = async (req, res) => {
  const connection = await db.getConnection(); 

  try {
    const query = `SELECT * FROM equipment`;
    const [equipment] = await connection.query(query);

    if (equipment.length === 0) {
      return res.status(404).json({ message: 'No equipment found' });
    }

    res.status(200).json({
      message: 'Equipment retrieved successfully',
      equipment,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Add new equipment
exports.addEquipment = async (req, res) => {
  const connection = await db.getConnection();
  const { equipment_name, equipment_type, brand, model, quantity, purchase_date, status, last_serviced, added_by } = req.body;

  try {
    if (!equipment_name || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `INSERT INTO equipment (equipment_name, equipment_type, brand, model, quantity, purchase_date, status, last_serviced, added_by) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [equipment_name, equipment_type, brand, model, quantity, purchase_date, status, last_serviced, added_by];

    await connection.query(query, values);

    res.status(201).json({ message: 'Equipment added successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
  const connection = await db.getConnection();
  const { id } = req.params;
  const { equipment_name, equipment_type, brand, model, quantity, purchase_date, status, last_serviced } = req.body;

  try {
    const query = `UPDATE equipment SET 
                    equipment_name = ?, equipment_type = ?, brand = ?, model = ?, 
                    quantity = ?, purchase_date = ?, status = ?, last_serviced = ?, updated_at = NOW() 
                   WHERE equipment_id = ?`;
    const values = [equipment_name, equipment_type, brand, model, quantity, purchase_date, status, last_serviced, id];

    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.status(200).json({ message: 'Equipment updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};
