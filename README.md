# Role Based Authntication System

> A modern full-stack web application for managing course enrollments, built with React (Vite) frontend and Node.js/Express backend with MongoDB.

---

## Features

- Auth system with **Student** and **Admin** roles.

  - Students can register, log in, update profile, change password, browse, enroll/unenroll courses.
  - Admins can manage students and courses, view enrollment stats, and perform CRUD operations.

- Secure JWT-based authentication with protected routes for various roles.

- Responsive and intuitive UI using React (Vite) + Tailwind CSS.

- API built with **Node.js**, **Express**, and **MongoDB**. Supports CORS, and handles dynamic user & course management.

---

## Tech Stack

**Frontend**

- Framework: React (Vite)
- UI: Tailwind CSS, Lucide Icons
- State & routing: React Context (Auth), React Router
- HTTP: Axios with centralized API config

**Backend**

- Runtime: Node.js
- Framework: Express
- Database: MongoDB (via Mongoose)
- Auth: JWT, protected routes, role checks
- CORS configured to allow both localhost (dev) and deployed frontend domains.

---

## Live Demo

- **Frontend**: [rbas-frontend.vercel.app](https://rbas-frontend.vercel.app)
- **Backend API**: Deployed on Render at [rbas-system.onrender.com](https://rbas-system.onrender.com)

---

## Repository Structure

```
RBAS-Assignment/
├── client/             # React frontend
│   ├── src/            # Components, pages, context, api
│   ├── .env            # Vite env (e.g. VITE_BACKEND_URL)
│   └── vite.config.js
├── server/             # Express backend
│   ├── config/         # DB connection
│   ├── routes/         # auth, users, courses
│   ├── controllers/    # Controller logic
│   ├── models/         # Mongoose schemas
│   └── server.js       # App entry point
└── README.md
```

---

## Setup & Installation

### Clone the repo

```bash
git clone https://github.com/Nemali-Satish/RBAS-Assignment.git
cd RBAS-Assignment
```

### Setup

```bash
npm run start
```

Open your browser at `http://localhost:5174` to explore the app.

---

## Usage Overview

### As a Student

- Register and log in.
- View and edit profile.
- Browse available courses.
- Enroll or unenroll from courses.
- Change password.

### As an Admin

- Log in with admin role.
- Manage courses: create, update, delete.
- Manage students: update/delete student profiles.
- View real-time stats (e.g., total students, courses, enrollments).

---

## Scripts Summary

| Location  | Script        | Description                         |
| --------- | ------------- | ----------------------------------- |
| Root      | `npm start`   | Install & run both parts |
| `server/` | `npm run dev` | Start backend in dev mode           |
| `client/` | `npm run dev` | Start frontend (Vite dev server)    |

---

## Contact

Developed by **Nemali Satish**.
Feel free to reach out for feedback, suggestions or bug reports.
