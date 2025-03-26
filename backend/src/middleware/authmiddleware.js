const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    console.log("Received Headers:", req.headers); // Debugging: Log headers

    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader); // Debugging: Log Authorization header

    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access Denied. Token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token Payload:", decoded);

        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        console.error("Token Verification Error:", err.message);
        return res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = authenticateToken;
