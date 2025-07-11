const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const CountdownEvent = require("../models/CountdownEvent");

// Create event
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { eventName, eventDate } = req.body;

  // const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const imageUrl = req.file
  ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
  : null;

  const newEvent = new CountdownEvent({
    userId: req.user._id,
    eventName,
    eventDate,
    image: imageUrl,
  });

  await newEvent.save();
  res.json(newEvent);
});

// Get user's events
router.get("/", protect, async (req, res) => {
  const events = await CountdownEvent.find({ userId: req.user._id }).sort({ eventDate: 1 });
  res.json(events);
});

// Toggle addToDashboard
router.put("/:id/toggle", protect, async (req, res) => {
  const event = await CountdownEvent.findById(req.params.id);
  if (!event || event.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  event.addedToDashboard = !event.addedToDashboard;
  await event.save();
  res.json(event);
});

// Edit event
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  const event = await CountdownEvent.findById(req.params.id);
  if (!event || event.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  event.eventName = req.body.eventName || event.eventName;
  event.eventDate = req.body.eventDate || event.eventDate;
  if (req.file) {
    event.image = `/uploads/${req.file.filename}`;
  }

  await event.save();
  res.json(event);
});

// Delete event
router.delete("/:id", protect, async (req, res) => {
  const event = await CountdownEvent.findById(req.params.id);
  if (!event || event.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  await event.deleteOne();
  res.json({ message: "Deleted" });
});

module.exports = router;
