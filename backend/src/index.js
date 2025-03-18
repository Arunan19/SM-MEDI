require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const regesteruserRoutes = require("./routes/regesteruserRoutes");

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Ensure correct API paths
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/users", regesteruserRoutes); // Corrected route path

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log(`❌ Port ${PORT} is already in use. Killing process...`);
        process.exit(1);
    }
});

// Global Error Handling Middleware (Debugging)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
