import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const { token } = response.data;

            // Store token for future requests
            localStorage.setItem("token", token);

            // Redirect to chat interface
            navigate("/chat");
        } catch (err) {
            console.error("Login Error:", err);
            setError(
                err.response?.data?.message || "Something went wrong during login."
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">
                    AI LeetCode Explainer
                </h2>
                
                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

