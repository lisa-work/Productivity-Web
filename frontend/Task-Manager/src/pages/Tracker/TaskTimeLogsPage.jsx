import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { format } from "date-fns";

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
};

const TaskTimeLogsPage = () => {
  const { taskId } = useParams();
  const [logs, setLogs] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get(`/api/time-logs/task/${taskId}`);
        setLogs(res.data.logs);
        setTaskTitle(res.data.taskTitle);
      } catch (err) {
        console.error("Failed to fetch task logs:", err);
      }
    };
    fetchLogs();
  }, [taskId]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Time Logs for: <span className="text-blue-600">{taskTitle || "Loading..."}</span>
      </h2>

      {logs.length === 0 ? (
        <p>No time logs available for this task.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-4 border-b">Start Time</th>
                <th className="text-left py-2 px-4 border-b">End Time</th>
                <th className="text-left py-2 px-4 border-b">Duration</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {format(new Date(log.startTime), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {format(new Date(log.endTime), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="py-2 px-4 border-b">{formatDuration(log.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskTimeLogsPage;
