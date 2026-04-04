import React from "react";
import "./MessageBubble.css";

const MessageBubble = ({ role, content }) => {
    const isUser = role === "user";
    
    return (
        <div className={`message-bubble ${isUser ? "message-user" : "message-assistant"}`}>
            <div className="message-content">
                {content}
            </div>
        </div>
    );
};

export default MessageBubble;
