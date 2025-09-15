import express from "express";
import { getHello } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getHello);

export default router;
