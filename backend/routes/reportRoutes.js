const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks", protect, exportTasksReport); // Export all tasks as Excel/PDF
router.get("/export/users", protect, exportUsersReport); // Export user-task report

module.exports = router;
