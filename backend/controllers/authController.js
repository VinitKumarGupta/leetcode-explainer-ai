import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate email and password presence
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // 5. Return success message
        res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
