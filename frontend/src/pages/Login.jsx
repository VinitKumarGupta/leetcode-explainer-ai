import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

            const { token, email: userEmail } = response.data;

            // Store token and email for future requests
            localStorage.setItem("token", token);
            localStorage.setItem("userEmail", userEmail);

            // Redirect to chat interface
            navigate("/chat");
        } catch (err) {
            console.error("Login Error:", err);
            setError(
                err.response?.data?.message ||
                    "Something went wrong during login.",
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title brand-gradient-text">Explaina</h2>
                <p className="login-subtitle">Sign in to your account</p>

                {error && <div className="login-error">{error}</div>}

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
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        Sign In
                    </button>
                </form>
                <p className="login-footer">
                    Don't have an account? <br />
                    <Link to="/signup">Signup here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
