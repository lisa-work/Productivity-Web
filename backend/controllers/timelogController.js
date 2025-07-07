const TimeLog = require("../models/TimeLog");
const Task = require("../models/Task");
const {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} = require("date-fns");

exports.createTimeLog = async (req, res) => {
  const { taskId, startTime, endTime, duration } = req.body;
  const userId = req.user._id;

  const log = await TimeLog.create({ taskId, userId, startTime, endTime, duration });
  res.status(201).json({ log });
};

exports.getLogsByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;

    const logs = await TimeLog.find({ taskId }).sort({ startTime: -1 });

    const task = await Task.findById(taskId).select("title");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      taskTitle: task.title,
      logs,
    });
  } catch (err) {
    console.error("Error getting logs by task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTimeLog = async (req, res) => {
  try {
    const { taskId, startTime, endTime } = req.body;
    if (!taskId || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const duration = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
    const newLog = await TimeLog.create({ taskId, startTime, endTime, duration });

    res.status(201).json({ message: "Time log created", log: newLog });
  } catch (err) {
    console.error("Error creating time log:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLogsByRange = async (req, res) => {
  try {
    const { range } = req.query;
    const now = new Date();

    let fromDate = new Date();
    let toDate = new Date();

    switch (range) {
      case "daily":
        fromDate = startOfDay(now);
        toDate = endOfDay(now);
        break;
      case "weekly":
        fromDate = startOfWeek(now);
        toDate = endOfWeek(now);
        break;
      case "monthly":
        fromDate = startOfMonth(now);
        toDate = endOfMonth(now);
        break;
      default:
        return res.status(400).json({ message: "Invalid range" });
    }

    const logs = await TimeLog.find({
      startTime: { $gte: fromDate, $lte: toDate },
    }).populate("taskId", "title").sort({ startTime: -1 });

    const formattedLogs = logs.map((log) => ({
      _id: log._id,
      task: log.taskId,
      startTime: log.startTime,
      endTime: log.endTime,
      duration: log.duration,
    }));

    res.json({ logs: formattedLogs });
  } catch (err) {
    console.error("Error getting logs by range:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getStartEndByRange = (range) => {
  const now = new Date();
  if (range === "daily") {
    return [startOfDay(now), endOfDay(now)];
  } else if (range === "weekly") {
    return [startOfWeek(now), endOfWeek(now)];
  } else {
    return [startOfMonth(now), endOfMonth(now)];
  }
};

exports.getLogsByRange = async (req, res) => {
  try {
    const { range } = req.query;
    let timeLogs;

    if (!range) {
      // Return all logs if no range specified
      timeLogs = await TimeLog.find();
    } else {
      const [start, end] = getStartEndByRange(range);
      timeLogs = await TimeLog.find({
        startTime: { $gte: start, $lte: end },
      });
    }

    res.json({ timeLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
