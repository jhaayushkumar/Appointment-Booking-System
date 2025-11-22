const express = require('express');
const doctorAuth = require('../middlewares/doctor.auth.middleware.js');
const {
  getMyAppointments,
  updateAppointmentStatus,
  createSlot,
  getMySlots,
  deleteSlot,
  getMyProfile,
  updateMyProfile,
  getMyPatients
} = require("../controllers/doctor.controller.js");

const router = express.Router();

router.use(doctorAuth);

router.get("/appointments", getMyAppointments);
router.put("/appointments/:id", updateAppointmentStatus);
router.post("/slots", createSlot);
router.get("/slots", getMySlots);
router.delete("/slots/:id", deleteSlot);
router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.get("/patients", getMyPatients);

module.exports = router;
