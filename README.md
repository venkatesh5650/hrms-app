# 🌟 Enterprise HRMS — Human Resource Management Platform
## 🚀 Enterprise-grade, secure, role-based HR automation platform

📌 Built using React.js | Node.js | Express | MySQL | Sequelize | JWT Authentication



### 📌 Project Overview

Enterprise HRMS is a full-stack Human Resource Management Platform designed to model real-world corporate HR workflows with strong security, governance, and auditability.
The system follows a centralized, approval-based HR lifecycle:

- HR initiates employee creation and updates
- Managers approve or reject requests with reasons
- Admins control login access and system governance
- Employees have read-only access to their own data
- Every action is logged for compliance and traceability

This project demonstrates production-grade engineering practices, not just CRUD operations.

### 🎯 Key Highlights

- Role-based access control (Admin, HR, Manager, Employee, Demo)
- Approval-based employee lifecycle
- Centralized HR governance
- JWT authentication + token revocation
- Multi-tenant organization isolation
- Audit logging for compliance
- Interview-safe demo mode
- Secure, scalable backend architecture


### 👥 Role-Based Access Control


| Role     | Capabilities                                             |
| -------- | -------------------------------------------------------- |
| Admin    | System administration, analytics, user & login approvals |
| HR       | Initiates employee lifecycle, manages teams              |
| Manager  | Approves/rejects employee creation                       |
| Employee | View-only access to own profile and assignments          |
| Demo     | Read-only system exploration                             |

### 🔄 Application Workflow

- 1.HR creates an employee request.
- 2.Manager approves or rejects the request.
- 3.Admin approves login access.
- 4.Employee gains view access.
- 5.All actions are logged.


### 🎯 Features

| Category        | Details                                            |
| --------------- | -------------------------------------------------- |
| Authentication  | Secure login, JWT protected routes, bcrypt hashing |
| Authorization   | Strict RBAC enforced via middleware                |
| HR Operations   | HR-driven employee lifecycle                       |
| Approval Flow   | Manager approval, Admin login approval             |
| Audit Logging   | Every action stored for compliance                 |
| Multi-Tenant    | Organization-level data isolation                  |
| Team Management | Many-to-many employee-team mapping                 |
| Demo Safety     | Read-only demo user                                |
| Deployment      | Cloud hosted frontend & backend                    |


### 🏛️ Architecture

Frontend: React.js, Axios, Context API
Backend: Node.js, Express.js
Database: MySQL with Sequelize ORM
Auth: JWT + bcrypt + token revocation
Hosting: Vercel (Frontend), Render (Backend)


### 🔐 Tech Stack Diagram
```
[ React UI ] ←→ [ Express REST API ] ←→ [ MySQL Database ]
        JWT Auth + RBAC Middleware + Audit Logging
```

### 🌍 Live Demo Links

| Service     | Link                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------- |
| Frontend    | 🔗 [https://hrms-app-five.vercel.app](https://hrms-app-five.vercel.app)                 |
| Backend API | 🔗 [https://hrms-backend-dw0e.onrender.com/api](https://hrms-backend-dw0e.onrender.com/api) |


### 🧑‍💼 Demo Flow (Suggested for Judges/Interviewers)

- 1️⃣ Login using demo credentials
- 2️⃣ Browse employees, teams, and logs
- 3️⃣ View approval flows and history
- 4️⃣ Attempt restricted actions → observe alerts
- 5️⃣ Logout → logout logged




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
DATABASE_URL=mysql://root:ncEDfaKGFqZegyfODtyhOSdPYlGOkMBk@yamabiko.proxy.rlwy.net:55745/hrms_db
JWT_SECRET=836268781fb30f46e32339fb3a3eaeedac0fb48ccf8226db50d7b0e565c49d9e
BCRYPT_SALT_ROUNDS=10
```

### Run database setup:
```
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

| Table          | Purpose            |
| -------------- | ------------------ |
| organisations  | Tenant separation  |
| users          | Login identities   |
| employees      | Employee records   |
| teams          | Teams              |
| employee_teams | M:M mapping        |
| approvals      | Approval workflows |
| logs           | Audit tracking     |
| revoked_tokens | Token invalidation |

### ⭐ Why This Project Stands Out

- Enterprise-grade permission modeling
- Approval workflows with governance
- Secure token handling
- Audit-friendly architecture
- Real business logic
- Interview-safe public demo

### 🟢 Summary

This project is not a simple CRUD application.
It demonstrates enterprise architecture, security, governance, and compliance awareness.

Built for learning, interviews, and real-world readiness.


