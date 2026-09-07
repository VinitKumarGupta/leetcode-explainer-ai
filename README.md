# Explaina

An AI-assisted technical interview preparation tool that converts coding and algorithm problems into structured, interview-ready breakdowns.

---

## Overview

General-purpose conversational AI models typically return unpredictable formats, mix boilerplate code, or provide conversational filler. Explaina enforces a deterministic, single-turn prompt pipeline that parses Data Structures and Algorithms (DSA) problems and produces an 8-part breakdown:

1. **Intuition**: High-level concept and logic behind the solution.
2. **Brute Force Approach**: Naive baseline and its pitfalls.
3. **Optimized Approach**: Optimal algorithmic strategy and design pattern (e.g., Two Pointers, Sliding Window, DP).
4. **Time Complexity**: Plain-text asymptotic analysis $(O(n), O(n \log n))$ without rendering bugs.
5. **Space Complexity**: Auxiliary memory requirements.
6. **Edge Cases**: Crucial boundary conditions and constraints.
7. **Code Implementation**: Clean, runnable code in Python, JavaScript, Java, C++, or Go.
8. **Related Topics**: Core DSA patterns and follow-up problem classifications.

---

## System Architecture

```
                       +-------------------------+
                       |   Client (React / SPA)  |
                       +------------+------------+
                                    |
                               HTTP | Port 80
                                    v
                       +-------------------------+
                       |   Nginx (Reverse Proxy) |
                       +------------+------------+
                                    |
                         /api/*     | Internal Docker Bridge
                                    v
                       +-------------------------+
                       |  Express.js API Server  |
                       +------+-----------+------+
                              |           |
            Mongoose / TCP    |           | HTTPS / REST
                              v           v
            +--------------------+     +-----------------------+
            |   MongoDB Atlas    |     |   Groq Inference API  |
            +--------------------+     +-----------------------+
```

- **Frontend**: React 19 single-page application built with Vite, utilizing Tailwind CSS for layout, Axios for API calls, and Markdown syntax highlighting (`rehype-highlight`).
- **Backend**: Node.js / Express REST API serving authentication and chat endpoints.
- **Database**: MongoDB (Mongoose ODM) storing user profiles and query history.
- **Authentication**: Dual authentication via JSON Web Tokens (JWT) with bcrypt password hashing, alongside Google OAuth 2.0 via Passport.js.
- **Inference Pipeline**: LLM inference via Groq Cloud API with low-temperature configuration for deterministic outputs.

---

## Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD pipeline targeting GHCR and AWS EC2
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection handler
│   │   └── passportConfig.js     # Google OAuth 2.0 Passport strategy
│   ├── controllers/
│   │   ├── authController.js     # Signup, login, OAuth callback logic
│   │   └── chatController.js     # CRUD operations for DSA explanations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT bearer token verification
│   ├── models/
│   │   ├── User.js               # User authentication schema
│   │   └── Chat.js               # Chat history and explanation schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── chatRoutes.js         # /api/chat routes
│   ├── services/
│   │   └── aiService.js          # Groq API client and structured prompt engine
│   ├── Dockerfile                # Backend container specification
│   ├── package.json
│   └── server.js                 # Express server initialization
├── frontend/
│   ├── nginx.conf                # Nginx reverse proxy configuration
│   ├── src/
│   │   ├── components/           # UI components (ChatWindow, Sidebar, MessageBubble)
│   │   ├── pages/                # App views (ChatPage, Login, Signup)
│   │   └── services/api.js       # Axios client with auth interceptors
│   ├── Dockerfile                # Multi-stage frontend build with Nginx
│   └── package.json
├── docker-compose.yml            # Multi-container orchestration specification
└── README.md
```

---

## API Reference

### Authentication

| Method | Endpoint                    | Description                                              |
| ------ | --------------------------- | -------------------------------------------------------- |
| `POST` | `/api/auth/signup`          | Registers a new user (`email`, `password`).              |
| `POST` | `/api/auth/login`           | Authenticates user credentials and returns a signed JWT. |
| `GET`  | `/api/auth/google`          | Initiates Google OAuth 2.0 authentication flow.          |
| `GET`  | `/api/auth/google/callback` | Google OAuth redirect callback handler.                  |

### Chat & Explanations

| Method   | Endpoint            | Description                                                  |
| -------- | ------------------- | ------------------------------------------------------------ |
| `POST`   | `/api/chat/create`  | Submits a DSA problem query and returns generated analysis.  |
| `GET`    | `/api/chat/history` | Retrieves stored explanation history for authenticated user. |
| `GET`    | `/api/chat/:id`     | Retrieves a specific explanation by ID.                      |
| `PUT`    | `/api/chat/:id`     | Updates an explanation title.                                |
| `DELETE` | `/api/chat/:id`     | Deletes an explanation record.                               |

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (Local or Atlas)
- Groq API Key
- Google OAuth credentials (optional, required for Google sign-in)

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leetcode-explainer
JWT_SECRET=your_jwt_secret_key
MODEL_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=qwen/qwen3.8-27b

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### Local Development

1. **Install Dependencies**:

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

2. **Run Services**:

    Start backend server:

    ```bash
    cd backend
    npm run dev
    ```

    Start frontend development server:

    ```bash
    cd frontend
    npm run dev
    ```

3. **Access**:
   Open `http://localhost:5173` in your browser.

---

## Production Deployment

### Docker Compose

The project includes container configurations for production deployment:

```bash
docker compose up -d --build
```

This starts:

- `frontend`: Multi-stage build running Nginx on port `80`, handling client-side routing and proxying `/api/*` requests.
- `backend`: Node.js container exposing internal port `5000`.

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automates deployment on push to `deployment-v1`:

1. Builds backend and frontend container images.
2. Pushes images to GitHub Container Registry (`ghcr.io`).
3. Connects to the host server via SSH (`appleboy/ssh-action`).
4. Injects secret values into the host environment, pulls updated container images, and executes `docker compose up -d`.
