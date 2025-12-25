# 🌟  HRMS – Human Resource Management System (Full Stack)
## 🚀 Full Stack Automation for Employee & Team Management

📌 Built using React.js | Node.js | Express | MySQL | JWT Authentication



### 📌 Project Overview

 HRMS is a secure Human Resource Management System built to help small and mid-sized organisations:

- ✔ Manage employees
- ✔ Organise teams
- ✔ Track employee/team assignments
- ✔ Maintain an audit log of all actions (for compliance & transparency)

This project demonstrates production-grade skills in:

Secure authentication (JWT + bcrypt)

Many-to-many relationships in SQL

Logging & audit-friendly backend architecture

Multi-tenant data isolation

Clean, modern UI with React



### 🎯 Features


| Category                   | Details                                                       |
| -------------------------- | ------------------------------------------------------------- |
| Authentication             | Organisation signup, secure login, JWT-based protected routes |
| HR Operations              | Add, Update, Delete employees & teams                         |
| Team Assignment            | Employees can belong to multiple teams (M:M relation)         |
| Logs & Auditing            | Every critical operation is logged for compliance             |
| Dashboard Overview         | Quick stats + recent activity logs                            |
| Multi-Organisation Support | Each org sees only their own data                             |
| Fully Deployed             | Frontend + Backend hosted live                                |


### 🏛️ Architecture

Frontend:  React.js (Axios, Context API)  
Backend:   Node.js + Express.js  
Database:  MySQL + Sequelize ORM  
Auth:      JWT + bcrypt  
Hosting:   Vercel (Frontend), Render/MySQL Local (Backend)


### 🔐 Tech Stack Diagram
```
[ React UI ]  ←→  [ Express REST API ]  ←→  [ MySQL Database ]
         JWT Authentication + CORS Security
```

### 🌍 Live Demo Links

| Service     | Link                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------- |
| Frontend    | 🔗 [https://hrms-app-five.vercel.app](https://hrms-app-five.vercel.app)                 |
| Backend API | 🔗 [https://hrms-backend-dw0e.onrender.com/api](https://hrms-backend-dw0e.onrender.com/api) |
| Demo Login  | 📧 [demo@gmail.com](mailto:demo@gmail.com) / 🔑 demo@5650                                   |


### 🧑‍💼 Demo Flow (Suggested for Judges/Interviewers)

1️⃣ Login using demo credentials
2️⃣ Add employees → check logs
3️⃣ Create a team → assign multiple employees
4️⃣ Go to dashboard and logs → verify automatically updated tracking
5️⃣ Logout → log entry created

✔ Shows M2M relationship, CRUD, security, and audit logs in one flow


### 📸 UI Screenshots

You can upload 4–6 images under /screenshots then reference them here:

### Login Page
![Login](screenshots/login.png)
### CreateOrganisationPage
![CreateOrg](screenshots/createOrg.png)
### Dashboard Page
![Dashboard](screenshots/dashboard.png)
### TeamsPage
![Teams](screenshots/teams.png)
### Logs Page
![Logs](screenshots/logs.png)
### Employee Page
![employeesPage](screenshots/employeesPage.png)

## 🧩 Installation Guide (Local Development)
### 1️⃣ Clone the repository
```
git clone https://github.com/venkatesh5650/hrms-app.git
cd hrms-app
```
### 2️⃣ Backend Setup
```
cd hrms-backend
npm install
```
### Create .env:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=hrms_db
JWT_SECRET=SOME_LONG_SECRET_KEY
```

### Run database setup:
```
npm run seed
npm run dev
```
### Backend runs at:
```
http://localhost:5000
```
### 3️⃣ Frontend Setup
```
cd ../frontend
npm install
```
### Create .env:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```
### Run app
```
npm start
```
### Frontend runs at:
```
http://localhost:3000
```

### 📌 Database Schema (Core Tables)

| Table          | Purpose                  |
| -------------- | ------------------------ |
| organisations  | Company-level separation |
| users          | Logged-in admin users    |
| employees      | Employee records         |
| teams          | Organizational teams     |
| employee_teams | Many-to-many join table  |
| logs           | Audit tracking           |



