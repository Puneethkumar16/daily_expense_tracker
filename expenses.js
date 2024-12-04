const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expensesController");

// Define Routes
router.post("/", expensesController.addExpense);
router.get("/", expensesController.getExpenses);
router.get("/analysis", expensesController.analyzeSpending);

module.exports = router;