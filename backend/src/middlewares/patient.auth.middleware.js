const jwt = require("jsonwebtoken");

const patientAuth = (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || (decoded.role !== "patient" && !decoded.isPatient)) {
      return res.status(403).json({ message: "Access forbidden. Patients only." });
    }
    req.patient = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = patientAuth;