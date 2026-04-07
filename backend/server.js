import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

// Load .env for local development. In Docker, env vars are injected by the container.
dotenv.config({ path: "../.env" });  // works when running from /backend locally
dotenv.config();                     // fallback: looks for .env in cwd

import connectDB from "./config/db.js";
import passport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Session middleware (required for Passport)
app.use(
    session({
        secret: process.env.JWT_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
    }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes all requests to /api/auth/* to the authRoutes module
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
    res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
