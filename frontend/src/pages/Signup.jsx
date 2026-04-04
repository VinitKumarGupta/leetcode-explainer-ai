import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Signup.css";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            await api.post("/auth/signup", {
                email,
                password,
            });

            // Redirect to login page on success so they can log in
            navigate("/login");
        } catch (err) {
            console.error("Signup Error:", err);
            setError(
                err.response?.data?.message || "Something went wrong during signup."
            );
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2 className="signup-title brand-gradient-text">
                    Explaina
                </h2>
                <p className="signup-subtitle">Create your account</p>
                
                {error && (
                    <div className="signup-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="signup-form">
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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>
                </form>

                <p className="signup-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
