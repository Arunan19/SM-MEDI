require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json()); // Ensure JSON body parsing
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // Ensure correct base path

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log(`❌ Port ${PORT} is already in use. Killing process...`);
        process.exit(1);
    }
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
