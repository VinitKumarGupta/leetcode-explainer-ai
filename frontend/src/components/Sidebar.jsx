import React from "react";
import "./Sidebar.css";

const Sidebar = ({
    chats,
    activeChat,
    onSelectChat,
    onNewChat,
    onDeleteChat,
    isOpen,
    onClose,
}) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <h2 className="brand-gradient-text">Explaina</h2>
                <button
                    className="sidebar-close-btn"
                    onClick={onClose}
                    aria-label="Close sidebar"
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            <button className="new-chat-button" onClick={onNewChat}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                New Problem
            </button>
            <div className="chat-history-list">
                {chats.length === 0 && (
                    <p className="no-chats-msg">No past chats yet.</p>
                )}

                {chats.map((chat) => (
                    <div
                        key={chat._id}
                        className={`chat-history-item ${activeChat?._id === chat._id ? "active" : ""}`}
                        onClick={() => onSelectChat(chat)}
                    >
                        <span className="chat-title-text" title={chat.title}>
                            {chat.title || "New Chat..."}
                        </span>
                        <span
                            className="delete-icon"
                            title="Delete Chat"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat._id);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </span>
                    </div>
                ))}
            </div>
            <div className="sidebar-footer">
                Made with <span className="heart-glow">❤️</span> by{" "}
                <a
                    href="https://github.com/VinitKumarGupta"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Vinit Gupta
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
