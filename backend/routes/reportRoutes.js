const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { exportTasksReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks", protect, exportTasksReport); // Export all tasks as Excel/PDF

module.exports = router;
