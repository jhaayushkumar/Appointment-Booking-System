const express = require("express");
const router = express.Router();

const {signUp,login,logout} = require("../controllers/doctor.auth");
const doctorAuth = require("../middlewares/doctor.auth.middleware");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);


router.get("/me", doctorAuth, (req, res) => {
  return res.status(200).json({ doctor: req.doctor });
});

module.exports = router;