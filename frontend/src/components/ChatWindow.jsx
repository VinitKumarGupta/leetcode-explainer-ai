import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

const ChatWindow = ({ activeChat, isLoading, onSend }) => {
    const [problemText, setProblemText] = useState("");
    const [language, setLanguage] = useState("Python");

    const handleSend = () => {
        if (!problemText.trim()) return;
        onSend(problemText, language);
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
                <div className="typing-indicator">
                    AI is thinking<span className="dots"></span>
                </div>
            )}
        </div>

        {!activeChat && (
            <div className="input-area">
                <textarea
                    className="chat-input"
                    rows="3"
                    placeholder="Paste your LeetCode problem or link here..."
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="action-row">
                    <select 
                        className="language-select"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="Python">Python</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Java">Java</option>
                        <option value="C++">C++</option>
                        <option value="Go">Go</option>
                    </select>
                    <button 
                        className="send-button"
                        onClick={handleSend}
                        disabled={isLoading || !problemText.trim()}
                    >
                        Get Explanation
                    </button>
                </div>
            </div>
        )}
    </div>
    );
};

export default ChatWindow;
