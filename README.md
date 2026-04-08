# Expense Tracker

A full-stack single-page application for tracking personal expenses. Built with **React**, **Express**, and **MongoDB**.

## Features

- **Add / Edit / Delete** expenses with title, category, amount, date, and description
- **Filter** by category and date range; **sort** by date or amount
- **Analytics dashboard** with:
  - Bar chart — spending by category
  - Donut chart — category breakdown percentage
  - Line chart — monthly spending trend
  - Category summary table with proportional progress bars
- Live total in the sidebar
- Instant in-app notifications for all actions

## Tech Stack

| Layer    | Technology            |
|----------|-----------------------|
| Frontend | React 18, Recharts, Vite |
| Backend  | Node.js, Express 4    |
| Database | MongoDB, Mongoose     |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017  
  *(or a MongoDB Atlas connection string)*

## Setup & Run

### 1. Install dependencies

```bash
cd expense-tracker
npm run install:all
```

### 2. Configure environment (optional)

```bash
cp server/.env.example server/.env
# Edit server/.env if your MongoDB URI differs from the default
```

Default: `mongodb://localhost:27017/expense_tracker`

### 3. Seed the database with sample data (optional)

```bash
npm run seed
```

### 4. Start both servers

```bash
npm run dev
```

This starts:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running separately

```bash
# Backend only
npm run server

# Frontend only
npm run client
```

## API Endpoints

| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| GET    | /api/expenses       | Fetch all expenses    |
| GET    | /api/expenses/:id   | Fetch single expense  |
| POST   | /api/expenses       | Create an expense     |
| PUT    | /api/expenses/:id   | Update an expense     |
| DELETE | /api/expenses/:id   | Delete an expense     |

### Optional query parameters for GET /api/expenses

| Parameter  | Example        | Description                  |
|------------|----------------|------------------------------|
| category   | `Food`         | Filter by category           |
| startDate  | `2025-01-01`   | Expenses on or after date    |
| endDate    | `2025-12-31`   | Expenses on or before date   |

## Database Export

`sample-data.json` contains 20 sample expense records that can be imported with:

```bash
mongoimport --db expense_tracker --collection expenses --array --file sample-data.json
```

Or use the seed script:

```bash
npm run seed
```

## Project Structure

```
expense-tracker/
├── client/                  # React frontend (Vite)
│   ├── index.html
│   └── src/
│       ├── App.jsx           # Root component, state & API calls
│       ├── index.css         # All styles
│       └── components/
│           ├── ExpenseForm.jsx   # Add/Edit modal
│           ├── ExpenseList.jsx   # Table + filters
│           └── Analytics.jsx    # Charts & summary
├── server/                  # Express backend
│   ├── server.js             # Entry point
│   ├── models/Expense.js     # Mongoose schema
│   ├── routes/expenses.js    # CRUD routes
│   └── seed.js               # Sample data seeder
├── sample-data.json          # Database export
└── README.md
```
