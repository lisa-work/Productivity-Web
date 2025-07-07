import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6E6E"];

const TimeReportPage = () => {
  const [range, setRange] = useState("daily");
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs(range);
  }, [range]);

  const fetchLogs = async (range) => {
    try {
      const res = await axiosInstance.get(`/api/time-logs?range=${range}`);
      setLogs(res.data.logs);
    } catch (error) {
      console.error("Failed to fetch time logs:", error);
    }
  };

  // Aggregate total time per day for bar chart
  const dailyTotals = (logs || []).reduce((acc, log) => {
    const day = new Date(log.startTime).toLocaleDateString();
    acc[day] = (acc[day] || 0) + log.duration;
    return acc;
  }, {});
  const barData = Object.entries(dailyTotals).map(([day, duration]) => ({
    day,
    hours: (duration / 3600).toFixed(2),
  }));

  // Aggregate time by task for pie chart and report
  const timeByTask = {};
  (logs || []).forEach((log) => {
    const taskName = log.task?.title || "Unknown";
    timeByTask[taskName] = (timeByTask[taskName] || 0) + log.duration;
  });

  const pieData = Object.entries(timeByTask).map(([name, duration], i) => ({
    name,
    value: duration,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <DashboardLayout activeMenu="Time Tracker">
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Time Report</h1>

      <div className="mb-4">
        <label className="mr-2">Select range:</label>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="p-1 border rounded">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="flex gap-10">
        {/* Bar Chart */}
        <div style={{ flex: 1 }}>
          <h2 className="text-xl mb-2">Time Tracked (hours) per Day</h2>
          <BarChart width={500} height={300} data={barData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Pie Chart and Report */}
        <div style={{ flex: 1 }}>
          <h2 className="text-xl mb-2">Time Distribution by Task</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => entry.name}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => `${(value / 3600).toFixed(2)} hrs`} />
          </PieChart>

          <div className="mt-4 max-h-60 overflow-auto border p-2 rounded">
            <h3 className="text-lg font-semibold mb-2">Report Details</h3>
            <ul>
              {pieData.map((entry, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:underline"
                  onClick={() => {
                    // Navigate to task's time log history page
                    const task = logs.find((log) => log.task?.title === entry.name);
                    if (task?.task?._id) {
                      navigate(`/time-logs/task/${task.task._id}`);
                    }
                  }}
                >
                  <strong>{entry.name}:</strong> {(entry.value / 3600).toFixed(2)} hours
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default TimeReportPage;
