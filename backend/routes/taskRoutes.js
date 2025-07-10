const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUserDashboardData, getTaskById, getTasks, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, updateTrackedTime } = require("../controllers/taskController");

const router = express.Router();

// Task Management Routes
router.get("/user-dashboard-data", protect, getUserDashboardData); // Get user-specific dashboard data
router.get("/", protect, getTasks); // Get all tasks
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, createTask); // Create a new task
router.put("/:id", protect, updateTask); // Update task details
router.delete("/:id", protect, deleteTask); // Delete task
router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist
router.put('/:id/track-time', protect, updateTrackedTime); // Update time tracked for a task

module.exports = router;
