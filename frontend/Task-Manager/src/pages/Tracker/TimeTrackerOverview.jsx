import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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


useEffect(() => {
  const handleResize = () => setScreenWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

const chartWidth = Math.min(screenWidth - 300, 300);

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

  // const barData = Object.entries(groupedByDate).map(([day, duration]) => ({
  //   day,
  //   hours: +(duration / 3600),
  // }));

   const handleBarClick = (data) => {
  const startStr = data.startDate.toISOString();
  const endStr = data.endDate.toISOString();

  navigate(`/user/time-tracker?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}&groupBy=${groupBy}`);
};


  let barData = [];

if (groupBy === "daily") {
  barData = Object.entries(groupedByDate).map(([dateStr, duration]) => {
    const start = new Date(dateStr);
    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    return {
      label: dateStr,
      startDate: start,
      endDate: end,
      hours: +(duration / 3600),
    };
  });
} else if (groupBy === "weekly") {
  barData = Object.entries(groupedByDate).map(([weekStr, duration]) => {
    const [year, week] = weekStr.split("-W").map(Number);

    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay();
    const ISOweekStart = simple;
    if (dayOfWeek <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }

    const start = new Date(ISOweekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return {
      label: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      startDate: start,
      endDate: end,
      hours: +(duration / 3600),
    };
  });
} else if (groupBy === "monthly") {
  barData = Object.entries(groupedByDate).map(([monthStr, duration]) => {
    const [year, month] = monthStr.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    end.setHours(23, 59, 59, 999);

    return {
      label: start.toLocaleString("default", { month: "short", year: "numeric" }),
      startDate: start,
      endDate: end,
      hours: +(duration / 3600),
    };
  });
}

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
<div>
      <div className="p-6 w-full mt-5 rounded-xl shadow-xl hover:shadow-2xl duration-200 cursor-pointer" 
      onClick={() => navigate("/user/time-tracker")}>
        <div className="flex flex-col justify-center space-y-3">
        <h1 className="text-xl md:text-2xl text-primary font-bold mb-3">Time Tracker Report</h1>
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
                    navigate(`/user/time-tracker?task=${encodeURIComponent(taskName)}`);
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
          <h2 className="text-md font-semibold mb-5 hidden md:block">Time Tracked (Hours)</h2>
          <ResponsiveContainer width="100%" height={300} className="hidden xl:block">
          <BarChart data={barData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => formatDuration(value * 3600)} />
            <Bar dataKey="hours" fill="#8884d8" onClick={handleBarClick} style={{ cursor: "pointer" }} />
          </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimeReportPage;
