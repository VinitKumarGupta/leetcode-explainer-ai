import React, { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import "./ChatPage.css";

const ChatPage = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await api.get("/chat/all");
                setChats(response.data);
            } catch (err) {
                console.error("Failed to fetch chats:", err);
            }
        };
        fetchChats();
    }, []);

    const handleSend = async (problemText) => {
        setIsLoading(true);
        
        const tempChat = {
            _id: "temp",
            messages: [
                { role: "user", content: problemText }
            ]
        };
        setActiveChat(tempChat);

        try {
            const response = await api.post("/chat/create", { problemText });
            const newChat = response.data;
            
            setActiveChat(newChat);
            setChats([newChat, ...chats]); 
        } catch (err) {
            console.error("Failed to generate explanation:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <Sidebar chats={chats} onSelectChat={setActiveChat} />
            <ChatWindow 
                activeChat={activeChat} 
                isLoading={isLoading} 
                onSend={handleSend} 
            />
        </div>
    );
};

export default ChatPage;
