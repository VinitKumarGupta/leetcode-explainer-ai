import express from "express";
import { createChat, getAllChats, deleteChat, renameChat } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createChat);
router.get("/all", protect, getAllChats);
router.delete("/:id", protect, deleteChat);
router.patch("/:id/rename", protect, renameChat);

export default router;
