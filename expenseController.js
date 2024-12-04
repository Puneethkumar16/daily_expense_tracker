const expenses = [];
const categories = require("../data/categories");

exports.addExpense = (req, res) => {
  const { category, amount, date } = req.body;

  if (!categories.includes(category)) {
    return res.json({ status: "error", data: null, error: "Invalid category" });
  }
  if (amount <= 0) {
    return res.json({ status: "error", data: null, error: "Amount must be positive" });
  }
  expenses.push({ category, amount, date });
  res.json({ status: "success", data: "Expense added successfully", error: null });
};

exports.getExpenses = (req, res) => {
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
};
exports.analyzeSpending = (req, res) => {
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
    const month = date.slice(0, 7); 
    monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
  });

  res.json({
    status: "success",
    data: { highestSpendingCategory, monthlyTotals },
    error: null,
  });
};