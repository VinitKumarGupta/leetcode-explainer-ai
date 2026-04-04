import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

const ChatWindow = ({ activeChat, isLoading, onSend }) => {
    const [problemText, setProblemText] = useState("");

    const handleSend = () => {
        if (!problemText.trim()) return;
        onSend(problemText);
        setProblemText(""); // Clear once passed up
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="main-area">
            <div className="messages-area">
                {activeChat ? (
                    activeChat.messages.map((msg, index) => (
                        <MessageBubble key={index} role={msg.role} content={msg.content} />
                    ))
                ) : (
                    <div className="welcome-message">
                        <h2>Welcome to AI LeetCode Explainer</h2>
                        <p>Paste a Data Structure or Algorithm problem below to get started!</p>
                    </div>
                )}
                
                {isLoading && (
                    <div className="loading-indicator">
                        Generating AI Explanation...
                    </div>
                )}
            </div>

            <div className="input-area">
                <textarea
                    className="chat-input"
                    rows="3"
                    placeholder="Paste your LeetCode problem here..."
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button 
                    className="send-button"
                    onClick={handleSend}
                    disabled={isLoading || !problemText.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
