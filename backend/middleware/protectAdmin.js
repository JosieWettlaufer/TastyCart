const jwt = require('jsonwebtoken');
require('dotenv');
const { User } = require('../models/User'); // Adjust the path to your User model if needed

const protectAdmin = async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Assigns decoded user id to req to use in future methods

        // Set userId explicitly from the decoded token
        req.userId = decoded.id;  // Use decoded.id since that's what you set in the token

        // Check if user exists and if they have an admin role
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admin access only" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = protectAdmin;
