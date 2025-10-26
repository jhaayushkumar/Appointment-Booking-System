const express = require("express");
const { signUp, login, logout } = require("../controllers/patient.auth.controller.js");
const patientAuth = require("../middlewares/patient.auth.middleware.js");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", patientAuth, (req, res) => {
  return res.status(200).json({ patient: req.patient });
});

module.exports = router
