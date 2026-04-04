import React, { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import "./ChatPage.css";

const ChatPage = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    React.useEffect(() => {
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

    const handleSend = async (problemText, language) => {
        setIsLoading(true);

        const tempChat = {
            _id: "temp",
            messages: [{ role: "user", content: problemText }],
        };
        setActiveChat(tempChat);

        try {
            const response = await api.post("/chat/create", {
                problemText,
                language,
            });
            const newChat = response.data;

            setActiveChat((prev) => (prev && prev._id === "temp" ? newChat : prev));
            setChats((prevChats) => [newChat, ...prevChats]);
        } catch (err) {
            console.error("Failed to generate explanation:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        if (!isLoading) {
            setActiveChat(null);
        }
    };

    const handleSelectChat = (chat) => {
        setActiveChat(chat);
        setSidebarOpen(false);
    };

    const handleRenameChat = async (chatId, title) => {
        try {
            const response = await api.patch(`/chat/${chatId}/rename`, {
                title,
            });
            const updatedChat = response.data;
            setChats(chats.map((c) => (c._id === chatId ? updatedChat : c)));
            if (activeChat?._id === chatId) {
                setActiveChat(updatedChat);
            }
        } catch (err) {
            console.error("Failed to rename chat:", err);
        }
    };

    const handleDeleteChat = async (chatId) => {
        try {
            await api.delete(`/chat/${chatId}`);
            setChats(chats.filter((c) => c._id !== chatId));
            if (activeChat?._id === chatId) {
                setActiveChat(null);
            }
        } catch (err) {
            console.error("Failed to delete chat:", err);
        }
    };

    return (
        <div className="chat-container">
            {/* Mobile hamburger button */}
            {!sidebarOpen && (
                <button
                    className="mobile-menu-btn"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open sidebar"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
            )}

            {/* Mobile overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
            />

            <Sidebar
                chats={chats}
                activeChat={activeChat}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onRenameChat={handleRenameChat}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoading={isLoading}
            />
            <ChatWindow
                activeChat={activeChat}
                isLoading={isLoading}
                onSend={handleSend}
            />
        </div>
    );
};

export default ChatPage;
