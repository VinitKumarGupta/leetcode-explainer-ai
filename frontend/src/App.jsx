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

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Default route strictly redirects to login */}
                <Route path="/" element={<Navigate to="/signup" replace />} />

                {/* Application Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/chat" element={<ChatPage />} />

                {/* Catch-all route to prevent 404s, routes back to login */}
                <Route path="*" element={<Navigate to="/signup" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
