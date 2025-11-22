const express = require('express');
const patientAuth = require('../middlewares/patient.auth.middleware.js');
const { 
  getAllDoctors,
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
  getMyProfile,
  updateMyProfile
} = require("../controllers/patient.controller.js");

const router = express.Router();

router.use(patientAuth);

router.get("/doctors", getAllDoctors);
router.get("/appointments", getMyAppointments);
router.post("/appointments", bookAppointment);
router.delete("/appointments/:id", cancelAppointment);
router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);

module.exports = router;
