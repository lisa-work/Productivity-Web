import React from 'react'
import moment from 'moment'
import { useNavigate } from "react-router-dom";

const TaskListTable = ({tableData}) => {
  const navigate = useNavigate();

    const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-500 border border-green-200';
      case 'Pending': return 'bg-purple-100 text-purple-500 border border-purple-200';
      case 'In Progress': return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
      default: return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-500 border border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-500 border border-orange-200';
      case 'Low': return 'bg-green-100 text-green-500 border border-green-200';
      default: return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

  const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const pad = (n) => n.toString().padStart(2, "0");
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };  

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] text-center">Name</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] text-center">Status</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] text-center">Priority</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] hidden md:table-cell text-center">Due Date</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] hidden md:table-cell text-center">Time Tracked</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="text-center border-t border-gray-200" onClick={() => navigate(`/user/task-details/${task._id}`)} style={{ cursor: 'pointer' }}>
              <td className="text-left my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden underline underline-offset-2 hover:text-primary">{task.title}</td>
              <td className="text-center py-4 px-4">
                <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>{task.status}</span>
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>{task.priority}</span>
              </td>
              <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">{task.dueDate ? moment(task.dueDate).format('Do MMM YYYY') : 'N/A'}</td>
              <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
              {task.timeTracked != null ? formatTime(task.timeTracked) : "00:00:00"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
  )
}

export default TaskListTable
