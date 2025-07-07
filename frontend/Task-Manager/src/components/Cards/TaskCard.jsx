import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";
import { MdDelete } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { IoPlaySharp } from "react-icons/io5";
import { FaStopCircle } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
  onEdit,
  onDelete,
  timeTracked,
  taskId,
  onTimeUpdate
}) => {
  // Set default value for timeTracked if undefined
  const trackedTime = timeTracked || 0;
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";

      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/10";

      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  const location = useLocation();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(() => timeTracked || 0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

useEffect(() => {
  if (!isRunning) {
    setSeconds(timeTracked || 0);
  }
}, [timeTracked, isRunning]);

const [loading, setLoading] = useState(false);

// const handleToggleTimer = async (e) => {
//   e.stopPropagation();

//   const nextState = !isRunning;
//   setIsRunning(nextState);

//   if (!nextState) {
//     // Timer stopped, save tracked time
//     setLoading(true);
//     try {
//       const res = await axiosInstance.put(`/api/tasks/${taskId}/track-time`, {
//         timeTracked: seconds,
//       });

//       const newTime = res.data.task.timeTracked;

//       if (newTime > seconds) {
//         setSeconds(newTime);
//       }

//       // Notify parent component of the new timeTracked value
//       if (onTimeUpdate) {
//         onTimeUpdate(taskId, newTime);
//       }
//     } catch (error) {
//       console.error("Failed to update time tracked:", error);
//     } finally {
//       setLoading(false);
//     }
//   }
// };

const handleToggleTimer = async (e) => {
  e.stopPropagation();

  const nextState = !isRunning;
  setIsRunning(nextState);

  if (!nextState) {
    // Timer stopped, save tracked time
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/api/tasks/${taskId}/track-time`, {
        timeTracked: seconds,
      });

      const newTime = res.data.task.timeTracked;

      // Immediately update local seconds state
      setSeconds(newTime);

      // Notify parent component of the new timeTracked value
      if (onTimeUpdate) {
        onTimeUpdate(taskId, newTime);
      }
    } catch (error) {
      console.error("Failed to update time tracked:", error);
    } finally {
      setLoading(false);
    }
  }
};


  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded `}
        >
          {status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {priority} Priority
        </div>
        <div
          className={`text-[11px] font-medium px-4 py-0.5 rounded text-blue-500 bg-blue-50 border border-blue-500/10`}
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering the card's onClick
            onEdit && onEdit();
          }}
        >
          Edit
        </div>
      </div>

      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>

        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
          Task Done:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Start Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment.utc(createdAt).format("Do MMM YYYY")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment.utc(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-col items-start justify-start gap-1">
          <p className="text-xs text-gray-500">Time Tracked:</p>
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-sm">{formatTime(seconds)}</p>
              <button
                onClick={handleToggleTimer}
                className="text-xs text-blue-600 underline ml-3"
              >
                {isRunning ? <FaStopCircle className="size-6 text-red-500"/> : <IoPlaySharp className="size-6 text-primary"/>}
              </button>
            </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-primary flex items-center" />{" "}
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}

          <div>
            <MdDelete className="text-2xl text-red-200 hover:text-red-400" onClick={(e) => {
              e.stopPropagation(); // prevent triggering the card's onClick
              onDelete && onDelete();
            }}/>
          </div>
        </div>
      </div>
    </div>
};

export default TaskCard;
