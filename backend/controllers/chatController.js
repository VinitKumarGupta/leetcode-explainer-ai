import Chat from "../models/Chat.js";
import { generateExplanation } from "../services/aiService.js";

export const createChat = async (req, res) => {
    try {
        const { problemText, language } = req.body;

        // 1. Validate problemText exists
        if (!problemText) {
            return res.status(400).json({ message: "problemText is required" });
        }

        // 2. Call generateExplanation from Gemini API
        const explanation = await generateExplanation(problemText, language);

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

export const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedChat = await Chat.findOneAndDelete({ _id: id, userId: req.userId });
        
        if (!deletedChat) {
            return res.status(404).json({ message: "Chat not found or unauthorized to delete" });
        }
        
        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Delete Chat Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const renameChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const updatedChat = await Chat.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { $set: { title: title.substring(0, 50) } },
            { new: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

        res.status(200).json(updatedChat);
    } catch (error) {
        console.error("Rename Chat Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
