const express = require('express')
const {greet} = require("../controllers/doctor.controller.js");
const router = express.Router();

router.get("/", greet);

module.exports = router
