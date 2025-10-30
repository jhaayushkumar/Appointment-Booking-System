const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const { logger } = require("./middlewares/logger.js");
const patientRoutes = require("./routes/patient.routes.js");
const patientAuthRoutes = require("./routes/patient.auth.routes.js");
const doctorRoutes = require("./routes/doctor.routes.js");
const doctorAuthRoutes = require("./routes/doctor.auth.routes.js");

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/auth/patient", patientAuthRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth/doctor", doctorAuthRoutes);

module.exports = app
