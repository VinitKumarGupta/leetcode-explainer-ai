import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// Page Imports
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";

// Protected Route — redirects to /login if no JWT token exists
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Default route strictly redirects to signup */}
                <Route path="/" element={<Navigate to="/signup" replace />} />

                {/* Application Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all route to prevent 404s, routes back to signup */}
                <Route path="*" element={<Navigate to="/signup" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
