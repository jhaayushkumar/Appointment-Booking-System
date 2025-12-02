const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { logger } = require("./middlewares/logger.js");
const patientRoutes = require("./routes/patient.routes.js");
const patientAuthRoutes = require("./routes/patient.auth.routes.js");
const doctorRoutes = require("./routes/doctor.routes.js");
const doctorAuthRoutes = require("./routes/doctor.auth.routes.js");

dotenv.config();
const app = express();

// CORS configuration to allow all Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Allow all Vercel deployments (production and preview)
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Appointment Booking System API is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/api/patients", patientRoutes);
app.use("/api/auth/patient", patientAuthRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth/doctor", doctorAuthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app
