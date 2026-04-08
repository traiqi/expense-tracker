/**
 * Seed script — populates the database with sample expenses.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Expense = require('./models/Expense');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker';

const sampleExpenses = [
  { title: 'Weekly groceries', category: 'Food', amount: 87.5, date: new Date('2025-12-02'), description: 'Supermarket run' },
  { title: 'Monthly rent', category: 'Housing', amount: 1500, date: new Date('2025-12-01'), description: 'December rent payment' },
  { title: 'Netflix subscription', category: 'Entertainment', amount: 15.99, date: new Date('2025-12-05'), description: '' },
  { title: 'Bus pass', category: 'Transport', amount: 45, date: new Date('2025-12-03'), description: 'Monthly transit pass' },
  { title: 'Doctor visit', category: 'Healthcare', amount: 120, date: new Date('2025-12-07'), description: 'Annual check-up co-pay' },
  { title: 'Online course', category: 'Education', amount: 29.99, date: new Date('2025-12-10'), description: 'React advanced course' },
  { title: 'Dinner out', category: 'Food', amount: 62.4, date: new Date('2025-12-14'), description: 'Birthday dinner' },
  { title: 'New shoes', category: 'Shopping', amount: 89.95, date: new Date('2025-12-08'), description: 'Running shoes' },
  { title: 'Electricity bill', category: 'Housing', amount: 98.2, date: new Date('2025-11-28'), description: '' },
  { title: 'Coffee & snacks', category: 'Food', amount: 18.5, date: new Date('2025-11-30'), description: 'Daily coffee habit' },
  { title: 'Uber rides', category: 'Transport', amount: 34.6, date: new Date('2025-11-25'), description: 'Weekend trips' },
  { title: 'Spotify', category: 'Entertainment', amount: 9.99, date: new Date('2025-11-20'), description: '' },
  { title: 'Gym membership', category: 'Healthcare', amount: 55, date: new Date('2025-11-01'), description: 'Monthly gym fee' },
  { title: 'Textbooks', category: 'Education', amount: 145.0, date: new Date('2025-10-15'), description: 'Semester textbooks' },
  { title: 'Groceries', category: 'Food', amount: 72.3, date: new Date('2025-10-20'), description: '' },
  { title: 'Internet bill', category: 'Housing', amount: 59.99, date: new Date('2025-10-01'), description: 'Monthly internet' },
  { title: 'Movie tickets', category: 'Entertainment', amount: 28.0, date: new Date('2025-10-12'), description: '2 tickets + popcorn' },
  { title: 'Clothing', category: 'Shopping', amount: 134.5, date: new Date('2025-10-18'), description: 'Winter wardrobe' },
  { title: 'Petrol', category: 'Transport', amount: 60.0, date: new Date('2025-09-22'), description: 'Full tank' },
  { title: 'Miscellaneous', category: 'Others', amount: 22.0, date: new Date('2025-09-10'), description: 'Various small purchases' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await Expense.deleteMany({});
    console.log('Cleared existing expenses');
    const inserted = await Expense.insertMany(sampleExpenses);
    console.log(`Inserted ${inserted.length} sample expenses`);
    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
