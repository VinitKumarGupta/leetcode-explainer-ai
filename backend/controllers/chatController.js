import Chat from "../models/Chat.js";
import { generateExplanation } from "../services/geminiService.js";

export const createChat = async (req, res) => {
    try {
        const { problemText } = req.body;

        // 1. Validate problemText exists
        if (!problemText) {
            return res.status(400).json({ message: "problemText is required" });
        }

        // 2. Call generateExplanation from Gemini API
        const explanation = await generateExplanation(problemText);

        // 3. Create new Chat document
        const newChat = new Chat({
            userId: req.userId, // This comes from the authMiddleware
            title: problemText.substring(0, 50),
            messages: [
                {
                    role: "user",
                    content: problemText,
                },
                {
                    role: "assistant",
                    content: explanation,
                },
            ],
        });

        // 4. Save chat to MongoDB
        await newChat.save();

        // 5. Return the created chat
        res.status(201).json(newChat);
    } catch (error) {
        console.error("Create Chat Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        console.error("Get All Chats Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
