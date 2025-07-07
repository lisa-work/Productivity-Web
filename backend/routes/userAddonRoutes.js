const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUserAddons, updateUserAddons } = require("../controllers/userAddonController");

const router = express.Router();

router.get("/", protect, getUserAddons);
router.put("/", protect, updateUserAddons);

module.exports = router;
