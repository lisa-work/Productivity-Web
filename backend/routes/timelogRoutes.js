const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createTimeLog, getLogsByTaskId, getLogsByRange } = require("../controllers/timelogController");

const router = express.Router();

// Protect time log creation routes
router.post("/", protect, createTimeLog);

// Public routes (you can add protect if needed)
router.get("/task/:taskId", getLogsByTaskId);
router.get("/", getLogsByRange);

module.exports = router;
