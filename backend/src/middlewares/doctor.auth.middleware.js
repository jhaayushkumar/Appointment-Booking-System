const jwt = require("jsonwebtoken");

const doctorAuth = (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({ message: "Access forbidden." });
    }
    
    if (decoded.role !== 'doctor') {
      return res.status(403).json({ message: "Access forbidden. Doctor role required." });
    }
    
    req.doctor = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = doctorAuth;
