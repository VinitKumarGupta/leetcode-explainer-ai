import React from "react";
import "./Sidebar.css";

const Sidebar = ({ chats, onSelectChat }) => {
    return (
        <div className="sidebar">
            <h3>Chat History</h3>
            <div className="chat-history-list">
                {chats.length === 0 && <p className="no-chats-msg">No past chats.</p>}
                
                {chats.map((chat) => (
                    <div 
                        key={chat._id} 
                        className="chat-history-item"
                        onClick={() => onSelectChat(chat)}
                    >
                        {chat.title || "New Chat..."}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
