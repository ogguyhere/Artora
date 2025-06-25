# How Dashboards Work in React + Node.js
1. User Signs In
Frontend (React) sends credentials to backend (Node.js + Express).

2. Backend Validates User
If valid:
    Creates a JWT token (includes user info like ID, role: user or admin)
    Sends it back to frontend

3. Frontend Stores JWT
React stores the JWT in:
    localStorage (commonly)
    or cookie (if using HttpOnly + secure access)

4. Protected Routes
Frontend checks:
    “Is user logged in?”
    “Is user admin?”

# Backend (Node.js + Express + MongoDB)
    bcryptjs — to hash passwords
    jsonwebtoken — to create and verify tokens
    User model with a role field (user, admin, etc.)
    Middleware to protect routes

# Frontend (React)
    Login form
    Axios to send requests
    Store token in localStorage
    Conditional rendering based on role
    Protected routes using React Router



[React Login Form] → (POST /api/login) → [Node.js Auth]
                                           ↓
                                  Create JWT with role
                                           ↓
                            ← (token) ← Send JWT to React
                                           ↓
                  React saves it & shows dashboard based on role


