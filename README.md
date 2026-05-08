# Tasksprint — MERN Project Management App

A modern full-stack project management platform built with the MERN stack.  
Tasksprint helps teams manage projects, assign tasks, track progress, and collaborate efficiently through an intuitive dashboard and Kanban workflow.

The application is built with secure authentication, role-based access control, responsive UI, reusable components, and scalable backend architecture.

---

# 🚀 Live Demo

🔗 https://project-management-production-ce31.up.railway.app/

# 📌 Project Overview

Tasksprint is a collaborative project and task management application designed for teams and organizations.  
Users can create projects, manage tasks, assign team members, track progress visually using a Kanban board, and monitor overall productivity through analytics dashboards.

The platform supports different user roles with controlled permissions to ensure secure project management.

#tech stack : MERN

# 📁 Project Structure

```bash
Project-Management/
│
├── backend/        # Express API + MongoDB
├── frontend/       # React Client Application
└── README.md
```

---
# ✨ Features

## 🔐 Authentication & Authorization
- User registration & login
- JWT access + refresh token authentication
- Secure httpOnly cookie handling
- Role-based access control (Admin, Manager, Member)
- Protected routes and APIs
- First registered user automatically becomes Admin

---
## 📂 Project Management
- Create, update, and delete projects
- Assign members to projects
- Track project progress
- Project status & priority management
- Owner and team visibility
- Project filtering and organization

---
## ✅ Task Management
- Create and manage tasks
- Assign tasks to project members
- Due date tracking
- Task priorities & statuses
- Overdue task indicators
- Filterable task views
- Task progress updates

---

## 📋 Kanban Board
- Drag-and-drop task workflow
- Status-based task columns
- Real-time UI updates
- Smooth project task organization
- Easy task movement between stages
---

## 📊 Dashboard & Analytics
- Active project statistics
- Open & overdue task tracking
- Tasks-by-status charts
- 7-day completion analytics
- Recent activity feed
- Team productivity overview

---
## 🎨 UI/UX
- Fully responsive design
- Mobile-friendly layout
- Skeleton loaders
- Toast notifications
- Accessible UI components
- Inline form validation
- Modern dashboard interface

---
# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/aadishri00/Project-Management.git
cd Project-Management

# 👤 Demo Accounts

| Role    | Email             | Password    |
|----------|------------------|-------------|
| Admin    | admin@pm.app     | admin123    |
| Manager  | manager@pm.app   | manager123  |
| Member   | dev@pm.app       | dev12345    |
| Member   | sara@pm.app      | sara12345   |

> Available only after running `npm run seed`

---

# 🔑 Roles & Permissions

| Feature | Admin | Manager | Member |
|----------|--------|----------|---------|
| Create Projects | ✅ | ✅ | ❌ |
| Edit Projects | ✅ | ✅ | ❌ |
| Delete Projects | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Create Tasks | ✅ | ✅ | ✅ |
| Access Dashboard | ✅ | ✅ | ✅ |

---

# 🛡️ Security Features

- Password hashing using bcryptjs
- JWT authentication
- Secure refresh token cookies
- Helmet security middleware
- API rate limiting
- Request validation
- Protected API routes

---

# 📱 Responsive Design

Optimized for:
- Desktop
- Tablet
- Mobile devices

---

# 🚀 Future Improvements

- Real-time notifications
- Team chat system
- File attachments
- Activity logs
- Dark mode
- Email notifications
- Calendar integration

---

# 🤝 Contributing

Contributions and feature requests are welcome.

```bash
Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Open a Pull Request
```

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

## Aditya Srikant Gangwar

Full Stack Developer passionate about building scalable and modern web applications using the MERN Stack.