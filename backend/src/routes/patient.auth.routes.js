const express = require("express");
const { signUp, login, logout } = require("../controllers/patient.auth.js");
const authMiddleware = require("../middlewares/patient.auth.middleware.js");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

module.exports = router
