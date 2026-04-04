import React from "react";
import ReactMarkdown from "react-markdown";
import "./MessageBubble.css";

const MessageBubble = ({ role, content }) => {
    const isUser = role === "user";
    
    return (
        <div className={`message-bubble ${isUser ? "message-user" : "message-assistant"}`}>
            <div className={`message-content ${isUser ? "user-content" : "assistant-content"}`}>
                {isUser ? (
                    content
                ) : (
                    <ReactMarkdown>{content}</ReactMarkdown>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
