import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a28eff", "#ff6e6e"];

const TimeReportPage = () => {
  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
  const [groupBy, setGroupBy] = useState("daily");

  const fetchLogs = async () => {
    const start = range[0].startDate.toISOString();
    const end = range[0].endDate.toISOString();

    try {
      const res = await axiosInstance.get(`/api/time-logs?start=${start}&end=${end}&groupBy=${groupBy}`);
      setLogs(res.data.logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [range, groupBy]);

  // Grouping logic
  const groupedByDate = {};
  const groupedByTask = {};
  logs.forEach(log => {
    const dateKey = new Date(log.startTime).toLocaleDateString();
    const taskName = log.task?.title || "Unknown";

    groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + log.duration;
    groupedByTask[taskName] = (groupedByTask[taskName] || 0) + log.duration;
  });

  const barData = Object.entries(groupedByDate).map(([day, duration]) => ({
    day,
    hours: +(duration / 3600).toFixed(2),
  }));

  const pieData = Object.entries(groupedByTask).map(([task, duration], i) => ({
    name: task,
    value: duration,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <DashboardLayout activeMenu="Time Tracker">
      <div className="p-6">
        <h1 className="text-xl font-medium">Time Tracker Report</h1>

        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div>
            <DateRangePicker
              ranges={range}
              onChange={(item) => setRange([item.selection])}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Group By</label>
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="p-2 border rounded">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">Time Tracked (Hours)</h2>
          <BarChart width={600} height={300} data={barData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Pie Chart */}
        <div className="mt-8">
          <h2 className="text-md font-semibold mb-2">Time Distribution by Task</h2>
          <PieChart width={400} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => `${(value / 3600).toFixed(2)} hrs`} />
          </PieChart>
        </div>

        {/* Breakdown Table */}
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">Summary Table</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Task</th>
                <th className="p-2 text-left">Time Tracked (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {pieData.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{(item.value / 3600).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Logs Table */}
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">Detailed Time Logs</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Task</th>
                <th className="p-2 text-left">Start</th>
                <th className="p-2 text-left">End</th>
                <th className="p-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td className="p-2">{log.task?.title || "Unknown"}</td>
                  <td className="p-2">{new Date(log.startTime).toLocaleString()}</td>
                  <td className="p-2">{new Date(log.endTime).toLocaleString()}</td>
                  <td className="p-2">{(log.duration / 3600).toFixed(2)} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimeReportPage;
