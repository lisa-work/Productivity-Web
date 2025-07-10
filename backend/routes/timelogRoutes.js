const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createTimeLog, getLogsByTaskId, getLogsByRange } = require("../controllers/timelogController");

const router = express.Router();

router.post("/", protect, createTimeLog);
router.get("/task/:taskId", protect, getLogsByTaskId);
router.get("/", protect, getLogsByRange);

module.exports = router;
