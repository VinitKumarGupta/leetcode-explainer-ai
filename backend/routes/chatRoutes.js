import express from "express";
import { createChat, getAllChats } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createChat);
router.get("/all", protect, getAllChats);

export default router;
