const User = require("../models/User");

// GET /api/user-addons
exports.getUserAddons = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      goals: user.goals || [],
      quickNotes: user.quickNotes || ""
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user addons" });
  }
};

// PUT or PATCH /api/user-addons
exports.updateUserAddons = async (req, res) => {
  const userId = req.user._id; // use _id for consistency
  const { goals, quickNotes } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { goals, quickNotes },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};


