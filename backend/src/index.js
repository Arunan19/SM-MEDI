
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/AttendanceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes'); 

const app = express();
app.use(cors());
// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', inventoryRoutes);
app.use('/api/equipment', equipmentRoutes); 

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;