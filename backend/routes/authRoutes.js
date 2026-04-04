import express from "express";
import { signupUser, loginUser } from "../controllers/authController.js";
import protect from "./middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/chat", protect, createChat);

export default router;
