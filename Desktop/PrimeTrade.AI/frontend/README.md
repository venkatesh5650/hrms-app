# Primetrade.ai Frontend & Backend Assignment

## 🚀 Project Overview

A **Scalable Web App** built with **React.js (frontend)** and **Node.js/Express (backend)**.  
Features **user authentication, profile management, and task dashboard** with full CRUD operations.

**Live Demo:** _(if deployed, add link here)_  
**GitHub Repository:** [https://github.com/yourusername/project-name](https://github.com/yourusername/project-name)

---

## 🌟 Key Features

### Authentication & User Management

- Signup & Login with **JWT authentication**
- Profile fetching & update
- Password hashing using **bcrypt**
- Protected routes for dashboard and profile

### Task Dashboard

- Create, Read, Update, Delete tasks
- Search tasks by title
- Filter tasks by status (Todo, In Progress, Done)
- Logout functionality

### UI & UX

- Responsive design using **Bootstrap** + custom CSS
- Clean, modern, and intuitive layout
- Works seamlessly on **desktop & mobile devices**

---

## 🛠 Tech Stack

- **Frontend:** React.js, Bootstrap, TailwindCSS (optional), Axios, React Router
- **Backend:** Node.js, Express.js, SQLite, bcrypt, JWT
- **Other:** Postman / Swagger for API documentation

---

## ⚡ Setup Instructions

### Backend

1. Navigate to backend folder:

```bash
cd backend
Install dependencies:

npm install


Create a .env file:

PORT=4000
JWT_SECRET=your_secret_key


Run backend server:

npm start

Frontend

Navigate to frontend folder:

cd frontend


Install dependencies:

npm install


Run frontend:

npm start


Access the app at http://localhost:5174

🔗 API Endpoints (Sample)

Auth

POST /api/auth/signup – Signup new user

POST /api/auth/login – Login user & get JWT

GET /api/auth/profile – Fetch profile (protected)

Tasks

GET /api/tasks – Get all tasks (search/filter)

POST /api/tasks – Create a task

PUT /api/tasks/:id – Update a task

DELETE /api/tasks/:id – Delete a task

(Full API documented in backend/docs Postman collection)

📸 Screenshots

![Login Page](screenshots/login.png)
![Signup Page](screenshots/signup.png)
![Dashboard Page](screenshots/dashboard.png)

(Add 2–3 screenshots of login, dashboard, and task CRUD features here)

✅ Author

Name: Karthan Venkatesh

Role: Frontend Developer Intern

Email: karthanvenkateshvenkatesh@gmail.com

GitHub: https://github.com/venkatesh5650/

📚 References

React.js Documentation

Node.js & Express Documentation

SQLite Documentation
```
