import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import { IoMdAdd } from "react-icons/io";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import toast from "react-hot-toast";

const MyTasks = () => {

  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState(allTasks || []);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleTimeUpdate = (taskId, newTimeTracked) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, timeTracked: newTimeTracked } : task
      )
    );
  };



    const handleDownloadReport = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
          responseType: "blob",
        });
  
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "task_details.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading details:", error);
        toast.error("Failed to download details. Please try again.");
      }
    };
    
  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  const handleEditClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  const deleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Task details deleted successfully");
      navigate('/admin/tasks')
    } catch (error) {
      console.error(
        "Error deleting:",
        error.response?.data?.message || error.message
      );
    }
  };  

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

            <div className="flex flex-row gap-2">
              <button className="flex create-task-btn" onClick={ () => navigate("/user/create-task")}>
                <IoMdAdd className="text-lg"/>
                  Create Task
              </button>

              <button
                className="flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
                
              </button>
            </div>
        </div>


<div className="my-3">
              <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item, index) => (
            <TaskCard
              key={item._id}
              taskId={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              timeTracked={item.timeTracked}
              onTimeUpdate={handleTimeUpdate}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => {
                handleClick(item._id);
              }}
              onEdit={() => handleEditClick(item)}
              onDelete={() => {
                setTaskIdToDelete(item._id);
                setOpenDeleteAlert(true);
              }}
            />
          ))}
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask(taskIdToDelete)}
        />
      </Modal>

    </DashboardLayout>
  );
};

export default MyTasks;
