import express from "express";
import {
    signupUser,
    loginUser,
    googleAuthCallback,
} from "../controllers/authController.js";

import passport from "passport";
const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    googleAuthCallback,
);

export default router;
