const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const expenses = [];
const categories = ["Food", "Travel", "Entertainment", "Bills", "Others"];

app.post("/expenses", (req, res) => {
  const { category, amount, date } = req.body;


  if (!categories.includes(category)) {
    return res.json({ status: "error", data: null, error: "Invalid category" });
  }
  if (amount <= 0) {
    return res.json({ status: "error", data: null, error: "Amount must be positive" });
  }
  expenses.push({ category, amount, date });
  res.json({ status: "success", data: "Expense added successfully", error: null });
});

app.get("/expenses", (req, res) => {
  const { category, startDate, endDate } = req.query;
  let filteredExpenses = expenses;

  if (category) {
    filteredExpenses = filteredExpenses.filter(e => e.category === category);
  }
  if (startDate && endDate) {
    filteredExpenses = filteredExpenses.filter(
      e => e.date >= startDate && e.date <= endDate
    );
  }

  res.json({ status: "success", data: filteredExpenses, error: null });
});

app.get("/expenses/analysis", (req, res) => {
  const categoryTotals = {};
  let highestSpendingCategory = "";
  let highestAmount = 0;
  let monthlyTotals = {};

  expenses.forEach(({ category, amount, date }) => {
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    if (categoryTotals[category] > highestAmount) {
      highestAmount = categoryTotals[category];
      highestSpendingCategory = category;
    }

    const month = date.slice(0, 7); // Extract YYYY-MM
    monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
  });

  res.json({
    status: "success",
    data: { highestSpendingCategory, monthlyTotals },
    error: null,
  });
});

cron.schedule("0 0 * * *", () => {
  const today = new Date().toISOString().slice(0, 10);
  const dailySummary = expenses.filter(e => e.date === today);
  console.log("Daily Summary:", dailySummary);
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});