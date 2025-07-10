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
    const userId = req.user._id;

    if (!taskId || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const duration = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);

    const newLog = await TimeLog.create({ taskId, userId, startTime, endTime, duration });

    res.status(201).json({ message: "Time log created", log: newLog });
  } catch (err) {
    console.error("Error creating time log:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLogsByRange = async (req, res) => {
  try {
    const { start, end, groupBy } = req.query;
    const userId = req.user._id;

    const fromDate = start ? new Date(start) : new Date("2000-01-01");
    const toDate = end ? new Date(end) : new Date();

    const logs = await TimeLog.find({
      userId,
      startTime: { $gte: fromDate, $lte: toDate },
    }).populate("taskId", "title").sort({ startTime: -1 });

    const formattedLogs = logs.map(log => ({
      _id: log._id,
      task: log.taskId,
      startTime: log.startTime,
      endTime: log.endTime,
      duration: log.duration,
    }));

    res.json({ logs: formattedLogs });
  } catch (err) {
    console.error("Error fetching time logs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
