# Expense Tracker

A full-stack single-page app for tracking personal expenses, with user authentication and an admin dashboard. Built for COMP Assignment 2.

## Problem

Helps users log and categorise their spending. Each user has their own private expense log. An admin account can manage all users and see a full activity history of what everyone has done.

## Tech Stack

- **Frontend** — React 18 (Vite)
- **Styling** — Plain CSS
- **Backend** — Node.js + Express
- **Database** — MongoDB (Mongoose)
- **Auth** — JWT (jsonwebtoken) + bcryptjs for password hashing

## Features

- Register and login with email/password (JWT stored in localStorage)
- Add, edit, and delete expenses (title, category, amount, date, description)
- Live search — filters the expense list in real-time as you type
- Filter by category
- Analytics page — spending breakdown by category and monthly totals
- Admin panel — view all users, promote/demote roles, delete accounts
- Activity log — every login, logout, and CRUD action is recorded and visible to admins
- Single-page app, no full page reloads

## Entities (CRUD)

| Entity | Operations |
|---|---|
| User | Create (register), Read (list), Update (role), Delete |
| Expense | Create, Read, Update, Delete (scoped to logged-in user) |
| UserActivity | Create (auto-logged on actions), Read (admin view) |

## Folder Structure

```
expense-tracker/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── App.jsx               # root component, auth state, API calls
│       ├── index.css             # all styles
│       └── components/
│           ├── AuthForm.jsx      # login / register page
│           ├── ExpenseForm.jsx   # add / edit modal
│           ├── ExpenseList.jsx   # table with live search + category filter
│           ├── Analytics.jsx     # category and monthly breakdown
│           └── AdminPanel.jsx    # user management + activity log
├── server/                  # Express backend
│   ├── server.js                 # entry point
│   ├── middleware/auth.js        # JWT verification, admin check
│   ├── models/
│   │   ├── User.js               # user schema (bcrypt hashing)
│   │   ├── Expense.js            # expense schema (linked to user)
│   │   └── UserActivity.js       # activity log schema
│   └── routes/
│       ├── auth.js               # register, login, logout, /me
│       ├── expenses.js           # CRUD, protected by JWT
│       └── admin.js              # admin-only user + activity routes
├── sample-data.json         # sample expense records
└── .env.example             # environment variable template
```

## How to Run

Requires Node.js and MongoDB running locally.

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Copy `server/.env.example` to `server/.env` and set your own `JWT_SECRET` before deploying.

## Challenges

The main challenge was scoping expenses to individual users after adding authentication — this required updating the Mongoose queries to always filter by `userId` and attaching the user from the JWT payload on every request. Setting up the activity logging middleware so it ran after a successful database operation (not before, where it might log a failed action) also took some thought. On the frontend, managing auth state across a page refresh meant storing the token in `localStorage` and re-validating it against `/api/auth/me` on load, so the user stays logged in without re-entering their password. Role-based access control for the admin panel required checking `req.user.role` in a separate middleware function rather than repeating the check in every route handler.
