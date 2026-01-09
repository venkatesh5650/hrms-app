# 🌟 Enterprise HRMS — Human Resource Management Platform
## 🚀 Enterprise-inspired, secure, role-based HR automation platform

📌 Built using React.js | Node.js | Express | MySQL | Sequelize | JWT Authentication



### 📌 Project Overview

Enterprise HRMS is a full-stack Human Resource Management Platform designed to model realistic corporate HR workflows with strong security, governance, and auditability.
The system follows a centralized, approval-based HR lifecycle:

- HR initiates employee creation and updates
- Managers approve or reject requests with reasons
- Admins control login access and system governance
- Employees have read-only access to their own data
- Every action is logged for compliance and traceability

This project demonstrates production-style engineering practices beyond basic CRUD operations.

### 🎯 Key Highlights

- Role-based access control (Admin, HR, Manager, Employee, Demo)
- Approval-based employee lifecycle
- Centralized HR governance
- JWT authentication + token revocation
- Multi-tenant organization isolation
- Audit logging for compliance
- Interview-safe demo mode
- Security-focused and modular backend architecture



### 👥 Role-Based Access Control


| Role     | Capabilities                                             |
| -------- | -------------------------------------------------------- |
| Admin    | System administration, analytics, user & login approvals |
| HR       | Initiates employee lifecycle, manages teams              |
| Manager  | Approves/rejects employee creation                       |
| Employee | View-only access to own profile and assignments          |
| Demo     | Read-only system exploration                             |

### 🔄 Application Workflow

- 1. HR creates an employee request.
- 2. Manager approves or rejects the request.
- 3. Admin approves login access.
- 4. Employee gains view access.
- 5. All actions are logged.


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

## 🎨 Frontend Engineering Highlights
- Context API used for authentication state and role propagation
- Protected routes enforced based on user roles (RBAC-aware routing)
- Centralized API layer using Axios with interceptors for JWT injection
- Graceful UI handling for approval states (Pending, Approved, Rejected)
- Responsive layout optimized for tablet and laptop screens
- Meaningful error and empty states for better UX



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

### Login Page
![Login](screenshots/hrms-login.png)
### Admin Dashboard Page
![Admin Dashboard](screenshots/hrms-admin-dashboard.png)
### HR Approval Flow Page
![HR Approval Flow](screenshots/hrms-hr-approval-flow.png)
### HR Employees View Page
![employeesPage](screenshots/hrms-hr-employees-view.png)
### HR Teams View
![Teams](screenshots/hrms-hr-teams-view.png)
### Logs View
![Logs](screenshots/hrms-logs-view.png)


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
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10

⚠️ Note: Secrets are not committed in this repository. Use your own credentials locally.

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

## 🧪 Reliability & Validation
- Manual test cases executed for each role flow (HR → Manager → Admin → Employee)
- Edge cases handled for unauthorized access, duplicate approvals, and revoked tokens
- API endpoints tested using Postman during development


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
- Security-focused and modular backend architecture


### 🟢 Summary

This project is not a simple CRUD application.
It demonstrates enterprise architecture, security, governance, and compliance awareness.

Built for learning, interviews, and real-world readiness.


