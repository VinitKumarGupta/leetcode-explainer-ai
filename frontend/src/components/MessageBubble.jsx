import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./MessageBubble.css";

// Register languages
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("go", go);

const CodeBlock = ({ inline, className, children, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
    };

    if (!inline && match) {
        return (
            <div className="code-block-wrapper">
                <div className="code-block-header">
                    <span className="code-block-lang">{match[1]}</span>
                    <button
                        onClick={handleCopy}
                        className={`copy-btn ${isCopied ? "copied" : ""}`}
                    >
                        {isCopied ? "✓ Copied" : "Copy"}
                    </button>
                </div>
                <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        borderRadius: "0",
                        overflowX: "auto",
                        maxWidth: "100%",
                        background: "rgba(0, 0, 0, 0.35)",
                        fontFamily:
                            "'JetBrains Mono', ui-monospace, Consolas, 'Liberation Mono', Menlo, monospace",
                        fontSize: "0.85rem",
                        lineHeight: "1.6",
                    }}
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        );
    }

    return (
        <code
            className={className}
            style={{
                backgroundColor: "rgba(0, 210, 255, 0.08)",
                color: "#7dd3fc",
                padding: "0.15rem 0.4rem",
                borderRadius: "4px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85em",
            }}
            {...props}
        >
            {children}
        </code>
    );
};

const MessageBubble = ({ role, content }) => {
    const isUser = role === "user";

    return (
        <div
            className={`message-bubble ${isUser ? "message-user" : "message-assistant"}`}
        >
            <div
                className={`message-content ${isUser ? "user-content" : "assistant-content"}`}
            >
                {isUser ? (
                    content
                ) : (
                    <ReactMarkdown
                        components={{
                            code: CodeBlock,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
