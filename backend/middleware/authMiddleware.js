import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Read token from request header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2. If no token: return 401
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // 3. Verify token using jsonwebtoken
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Get userId from decoded token & 5. Attach userId to request object
        req.userId = decoded.userId;

        // 6. Call next()
        next();
    } catch (error) {
        // 7. If token invalid: return 401
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};
