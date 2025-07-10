const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");
const mongoose = require("mongoose");

const exportTasksReport = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find tasks assigned to this user only
    const tasks = await Task.find({ assignedTo: userId }).populate(
      "assignedTo",
      "name email"
    );

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Assigned Tasks Report");

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const pad = (n) => n.toString().padStart(2, "0");
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };  

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
      { header: "Time Tracked", key: "timeTracked", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");
      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
        timeTracked: formatTime(task.timeTracked) || "00:00:00",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="assigned_tasks_report.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Error exporting tasks", error: error.message });
  }
};

module.exports = {
  exportTasksReport,
};
