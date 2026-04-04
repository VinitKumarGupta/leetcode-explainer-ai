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
            <div
                style={{
                    position: "relative",
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                }}
            >
                <button
                    onClick={handleCopy}
                    style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#333",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        opacity: 0.9,
                        zIndex: 1,
                    }}
                >
                    {isCopied ? "Copied!" : "Copy"}
                </button>
                <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        paddingTop:
                            "2.5rem" /* Extra padding so text doesn't hide behind button */,
                        borderRadius: "8px",
                        overflowX: "auto",
                        maxWidth: "100%",
                        fontFamily:
                            'ui-monospace, Consolas, "Liberation Mono", Menlo, monospace',
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
                backgroundColor: "#e9ecef",
                padding: "0.2rem 0.4rem",
                borderRadius: "4px",
                fontFamily: "monospace",
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
