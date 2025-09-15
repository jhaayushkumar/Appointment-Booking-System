import express from "express";
import dotenv from "dotenv";
import { logger } from "./middlewares/logger.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/users", userRoutes);

export default app;
