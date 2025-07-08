const mongoose = require("mongoose");

const CountdownEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  image: { type: String, default: "/uploads/placeholder.jpg" },
  addedToDashboard: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CountdownEvent", CountdownEventSchema);
