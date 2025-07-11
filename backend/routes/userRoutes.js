const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");

const router = express.Router();

// User Management Routes
router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById); // Get a specific user

module.exports = router;
