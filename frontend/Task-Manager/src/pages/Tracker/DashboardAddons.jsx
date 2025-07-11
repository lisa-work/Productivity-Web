import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import { RiSubtractLine } from "react-icons/ri";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";

const DashboardAddons = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [quickNotes, setQuickNotes] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const navigate = useNavigate();

  // Add a new goal
  const addGoal = async () => {
    if (newGoal.trim()) {
      const updated = [...goals, { text: newGoal.trim(), checked: false }]
      setGoals(updated);
      setNewGoal("");
      await axiosInstance.put("/api/user-addons", { goals: updated, quickNotes });
    }
  };

  // Remove a goal by index
  const removeGoal = async (index) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
    await axiosInstance.put("/api/user-addons", { goals: updated, quickNotes });
  };

  // Toggle goal checked state
  const toggleGoalChecked = async (index) => {
    const updated = goals.map((goal, i) =>
      i === index ? { ...goal, checked: !goal.checked } : goal
    );
    setGoals(updated);
    await axiosInstance.put("/api/user-addons", { goals: updated, quickNotes });
  };

  // Automatically saves goals and quick notes to the backend
  useEffect(() => {
  const timeout = setTimeout(() => {
        axiosInstance.put("/api/user-addons", {
          goals,
          quickNotes,
        });
      }, 800);
      return () => clearTimeout(timeout);
  }, [goals, quickNotes]);

  // Fetch goals and quick notes from the backend on component mount
  useEffect(() => {
  const fetchData = async () => {
    const res = await axiosInstance.get("/api/user-addons");
    setGoals(res.data.goals || []);
    setQuickNotes(res.data.quickNotes || "");
  };
  fetchData();
  }, []);

  // Fetch all tasks for upcoming tasks section
  useEffect(() => {
    const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      console.log("All tasks response:", response.data); // inspect the shape
      setAllTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);
    } catch (error) {
      console.error("Error fetching all tasks:", error);
    }
  };
    getAllTasks();
  }, []);

  // Filter and sort upcoming tasks
  const upcomingTasks = allTasks
  .filter(task => new Date(task.dueDate) >= new Date())
  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Handle task click to navigate to details
  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">

      {/* Goals */}
      <div className="card overflow-auto h-[50vh]">
        <h4 className="text-lg font-semibold mb-2 text-primary">Goals</h4>
        <div className="flex mb-2">
          <input
            type="text"
            className="form-input flex-1 w-full mr-2"
            placeholder="Here comes your goals"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <button onClick={addGoal} ><IoMdAdd className="mx-0 text-primary"/></button>
        </div>
          {goals.length > 0 && (
          <ul className="list-none text-sm overflow-auto ">
            {goals.map((goal, i) => (
              <li key={i} className="flex items-center my-2">
                <input
                  type="checkbox"
                  checked={goal.checked}
                  onChange={() => toggleGoalChecked(i)}
                  className="mr-2"
                />
                  <span
                    className={`flex w-full justify-between items-center ${
                      goal.checked ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {goal.text}
                    <RiSubtractLine
                      className="ml-2 cursor-pointer flex"
                      onClick={() => removeGoal(i)}
                    />
                  </span>
              </li>
            ))}
          </ul>
          )}
      </div>

      {/* Upcoming Due Tasks */}
      <div className="card overflow-auto h-[50vh]">
        <h4 className="text-lg font-semibold mb-2 text-primary">Upcoming Due Tasks</h4>
        <div className="flex mb-3 ">
        <ul className="list-disc pl-5 text-sm overflow-auto cursor-pointer">
          {upcomingTasks.map((task) => (
           <li
              key={task._id}
              onClick={() => handleClick(task._id)}
              className="group underline underline-offset-2 cursor-pointer my-2 hover:text-secondary leading-6"
            >
              {task.title} —{" "}
              <span className="text-xs text-gray-500 group-hover:text-secondary">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
      </div>

      {/* Quick Notes */}
      <div className="card overflow-auto h-[50vh]">
        <h4 className="text-lg font-semibold mb-2 text-primary">Quick Notes</h4>
        <textarea
          rows="10"
          className="form-input w-full resize-none leading-6"
          placeholder="Jot something down..."
          value={quickNotes}
          onChange={(e) => setQuickNotes(e.target.value)}
        >{quickNotes}</textarea>
      </div>
    </div>
  );
};

export default DashboardAddons;
