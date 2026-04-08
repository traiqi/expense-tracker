# Expense Tracker

A web app to log and keep track of your personal spending. You can add expenses, edit them, delete them, and view a breakdown by category and month.

Built for COMP assignment 1.

## Problem

I wanted a simple way to see where my money was going each month. This app lets you log expenses with a category, amount, and date, then see totals grouped by category or month on the analytics page.

## Tech Stack

- **Frontend** — React (Vite)
- **Styling** — Plain CSS (no component library)
- **Backend** — Node.js + Express
- **Database** — MongoDB (Mongoose)

## Features

- Add, edit, and delete expenses
- Fields: title, category, amount, date, optional description
- Filter expense list by category
- Analytics page showing spending by category and monthly totals
- Single-page app — no page reloads

## Folder Structure


expense-tracker/
├── client/              # React frontend
│   └── src/
│       ├── App.jsx          # main component, handles state and API calls
│       ├── index.css        # all styles
│       └── components/
│           ├── ExpenseForm.jsx   # add/edit modal
│           ├── ExpenseList.jsx   # table with category filter
│           └── Analytics.jsx    # category + monthly breakdown
├── server/              # Express backend
│   ├── server.js
│   ├── models/Expense.js
│   ├── routes/expenses.js
│   └── seed.js
└── sample-data.json     # sample expenses for testing


## How to Run

You need Node.js and MongoDB installed and running locally.

```bash
# install dependencies
npm run install:all

# (optional) load sample data
npm run seed

# start both servers
npm run dev
```

Frontend runs on http://localhost:3000, backend on http://localhost:5000.

If your MongoDB URI is different from the default, copy `server/.env.example` to `server/.env` and update it.

## Challenges

Getting the React state to stay in sync with the database took some trial and error — for example, making sure the expense list updated immediately after an add or delete without needing a full page refresh. I also ran into some issues with date formatting between MongoDB and the frontend date inputs, since MongoDB stores dates in UTC and the input field expects a `YYYY-MM-DD` string. The modal form also needed to correctly pre-fill when editing an existing expense, which required a `useEffect` that watches the passed-in expense prop.
