import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useSearchParams, useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a28eff", "#ff6e6e"];

const TimeReportPage = () => {
  const [logs, setLogs] = useState([]);
  // const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
  const [groupBy, setGroupBy] = useState("daily");
  const [expandedRows, setExpandedRows] = useState({});

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedTask = searchParams.get("task");

 const now = new Date();
 const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
 const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
 const [range, setRange] = useState([{
   startDate: monthStart,
   endDate: monthEnd,
 key: "selection"
}]);


  const fetchLogs = async () => {
    const start = range[0].startDate.toISOString();
    const end = range[0].endDate.toISOString();

    try {
      const url = `/api/time-logs?start=${start}&end=${end}&groupBy=${groupBy}${selectedTask ? `&task=${encodeURIComponent(selectedTask)}` : ''}`;
      const res = await axiosInstance.get(url);
      setLogs(res.data.logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [range, groupBy, selectedTask]);

  const filteredLogs = selectedTask
    ? logs.filter(log => log.task?.title === selectedTask)
    : logs;
  if (filteredLogs.length === 0) {
  return (
    <DashboardLayout activeMenu="Time Tracker">
      <div className="p-6 w-full border my-5 rounded-xl shadow-md text-center text-gray-500">
        <h1 className="text-xl font-medium mb-4">Time Tracker Report</h1>
        <p>No data to show for this period.</p>
      </div>
    </DashboardLayout>
  );
}

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Grouping logic
  const groupedByDate = {};
  const groupedByTask = {};
  filteredLogs.forEach(log => {
    const dateKey = new Date(log.startTime).toLocaleDateString();
    const taskName = log.task?.title || "Unknown";

    groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + log.duration;
    groupedByTask[taskName] = (groupedByTask[taskName] || 0) + log.duration;
  });

  const barData = Object.entries(groupedByDate).map(([day, duration]) => ({
    day,
    hours: +(duration / 3600),
  }));

  const pieData = Object.entries(groupedByTask).map(([task, duration], i) => ({
    name: task,
    value: duration,
    color: COLORS[i % COLORS.length],
  }));

  const SmallLegend = (props) => {
  const { payload } = props;

  return (
    <ul className="text-xs space-y-1 mt-2 ml-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center space-x-2">
          <span
            className="w-3 h-3 inline-block rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

// const SmallLegend = ({ payload }) => {
//   return (
//     <ul className="text-sm space-y-2">
//       {payload.map((entry, index) => (
//         <li key={`item-${index}`} className="flex items-center space-x-2">
//           <span
//             className="w-3 h-3 inline-block rounded-sm"
//             style={{ backgroundColor: entry.color }}
//           />
//           <span>{entry.value}</span>
//         </li>
//       ))}
//     </ul>
//   );
// };

  const logsByDayAndTask = {};
  filteredLogs.forEach((log) => {
    const dateKey = new Date(log.startTime).toLocaleDateString();
    const taskName = log.task?.title || "Unknown";

    if (!logsByDayAndTask[dateKey]) logsByDayAndTask[dateKey] = {};
    if (!logsByDayAndTask[dateKey][taskName]) logsByDayAndTask[dateKey][taskName] = [];

    logsByDayAndTask[dateKey][taskName].push(log);
  });

  return (
    <DashboardLayout activeMenu="Time Tracker">
      <div className="p-6 w-full border my-5 rounded-xl shadow-md">
        <div className="flex flex-col justify-center space-y-3">
        <h1 className="text-xl font-medium">Time Tracker Report</h1>
        <div className="flex flex-col items-start justify-center">
            <label className="flex items-center my-2 text-[0.9rem] text-center font-semibold">Group By:</label>
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="p-2 border rounded text-sm cursor-pointer">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="all">All</option>
            </select>
        </div>
        </div>

        {selectedTask && (
          <button onClick={() => navigate(".")} className="mt-4 px-3 py-1 bg-primary/20 text-white rounded">
            Clear Task Filter: {selectedTask}
          </button>
        )}

        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
          <div>
            <DateRangePicker
              ranges={range}
              onChange={(item) => setRange([item.selection])}
            />
          </div>
          
        {/* Pie Chart */}
        <div className="ml-10">
          <h2 className="text-md font-semibold mb-2 text-center">Time Distribution by Task</h2>
            <div className="">
              <PieChart width={500} height={350} className="">
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  onClick={(data, index) => {
                    const taskName = pieData[index].name;
                    navigate(`?task=${encodeURIComponent(taskName)}`);
                  }}
                  cursor="pointer"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={<SmallLegend />} />
                <Tooltip formatter={(value) => formatDuration(value)} />
              </PieChart>
            </div>
        </div>

        </div>

        {/* Bar Chart */}
        <div className="mt-6 px-2">
          <h2 className="text-md font-semibold mb-5">Time Tracked (Hours)</h2>
          <BarChart width={1150} height={300} data={barData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => formatDuration(value * 3600)} />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Summary Table */}
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">Summary Table</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-center text-[0.9rem]">Task</th>
                <th className="p-2 text-center text-[0.9rem]">Time Tracked</th>
              </tr>
            </thead>
            <tbody>
              {pieData.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border border-dotted">
                    <button onClick={() => navigate(`?task=${encodeURIComponent(item.name)}`)} className="cursor-pointer text-blue-600 underline">
                      {item.name}
                    </button>
                  </td>
                  <td className="p-2 border border-dotted">{formatDuration(item.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Daily Breakdown Table */}
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">Daily Breakdown</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr className="border-b border-dotted">
                <th className="p-2 text-center">Date</th>
                <th className="p-2 text-center">Task</th>
                <th className="p-2 text-center">Total Duration</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(logsByDayAndTask).map(([date, tasks]) =>
                Object.entries(tasks).map(([taskName, taskLogs], idx) => {
                  const total = taskLogs.reduce((sum, log) => sum + log.duration, 0);
                  const key = `${date}-${taskName}`;
                  const isExpanded = expandedRows[key];

                  return (
                    <React.Fragment key={key}>
                      <tr className="bg-white border border-dotted hover:bg-gray-50 cursor-pointer" onClick={() =>
                        setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }))
                      }>
                        <td className="p-2 border border-dotted">{idx === 0 ? date : ""}</td>
                        <td className="p-2 border border-dotted">
                          <button className="text-blue-600 underline">
                            {taskName} {isExpanded ? "▲" : "▼"}
                          </button>
                        </td>
                        <td className="p-2">{formatDuration(total)}</td>
                      </tr>
                      {isExpanded && taskLogs.map((log, i) => (
                        <tr key={`${key}-${i}`} className="bg-gray-50">
                          <td className="p-2 pl-6">—</td>
                          <td className="p-2">
                            <div className="text-xs text-gray-700">
                              {new Date(log.startTime).toLocaleTimeString()} → {new Date(log.endTime).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="p-2 text-xs">{formatDuration(log.duration)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Detailed Logs Table */}
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">Detailed Time Logs</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-center">Task</th>
                <th className="p-2 text-center">Start</th>
                <th className="p-2 text-center">End</th>
                <th className="p-2 text-center">Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => (
                <tr key={i}>
                  <td className="p-2 border border-dotted">{log.task?.title || "Unknown"}</td>
                  <td className="p-2 border border-dotted text-center">{new Date(log.startTime).toLocaleString()}</td>
                  <td className="p-2 border border-dotted text-center">{new Date(log.endTime).toLocaleString()}</td>
                  <td className="p-2 border border-dotted text-center">{formatDuration(log.duration)}</td>
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
