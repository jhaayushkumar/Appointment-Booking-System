const express = require('express')
const { getHello } = require("../controllers/patient.controller.js");

const router = express.Router();

router.get("/", getHello);

module.exports = router
