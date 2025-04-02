const jwt = require("jsonwebtoken");
require("dotenv");
const { User } = require("../models/User"); 

//METHOD: Authentication middleware for user and admin routes
const protectRoutes = async (req, res, next) => {

  //get token from authorization header
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  //If no token return error
  if (!token) return res.status(401).json({ message: "Unauthorized access" });

  try {
    //Verify token (Note: could not get environment variable to work)
    const decoded = jwt.verify(token, "your_super_secret_key");
    req.user = decoded; // Assigns decoded user id to req to use in future methods

    // Set userId explicitly from the decoded token
    req.userId = decoded.id; 

    //If route contains /admin perform additional check
    if (req.originalUrl.includes("/admin")) {

      // Check if user exists and if they have an admin role
      const user = await User.findById(req.userId);

      if (!user || user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Admin access only" });
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protectRoutes;
