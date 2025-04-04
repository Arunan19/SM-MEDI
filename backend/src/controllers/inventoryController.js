const db = require('../config/db'); // Import database connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all inventory items
exports.getAllInventory = async (req, res) => {
  const connection = await db.getConnection(); 

  try {
    const query = `SELECT * FROM inventory`;
    const [inventory] = await connection.query(query);

    if (inventory.length === 0) {
      return res.status(404).json({ message: 'No inventory items found' });
    }

    res.status(200).json({
      message: 'Inventory retrieved successfully',
      inventory,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Add a new inventory item
exports.addInventoryItem = async (req, res) => {
  const connection = await db.getConnection();
  const { item_name, category, quantity, supplier, purchase_date, expiry_date, added_by } = req.body;

  try {
    if (!item_name || !category || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `INSERT INTO inventory (item_name, category, quantity, supplier, purchase_date, expiry_date, added_by) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [item_name, category, quantity, supplier, purchase_date, expiry_date, added_by];

    await connection.query(query, values);

    res.status(201).json({ message: 'Inventory item added successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};

// Edit an inventory item
exports.updateInventoryItem = async (req, res) => {
  const connection = await db.getConnection();
  const { id } = req.params;
  const { item_name, category, quantity, supplier, purchase_date, expiry_date } = req.body;

  try {
    const query = `UPDATE inventory SET 
                    item_name = ?, category = ?, quantity = ?, supplier = ?, 
                    purchase_date = ?, expiry_date = ?, updated_at = NOW() 
                   WHERE id = ?`;
    const values = [item_name, category, quantity, supplier, purchase_date, expiry_date, id];

    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json({ message: 'Inventory item updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release();
  }
};
