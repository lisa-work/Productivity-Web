import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import DashboardAddons from "../Tracker/DashboardAddons";
import CalendarView from "../Tracker/CalendarView";
import TimeTrackerOverview from "../Tracker/TimeTrackerOverview";
import { Cursor } from "mongoose";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];


const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const [dashboardEvents, setDashboardEvents] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const [allTasks, setAllTasks] = useState([]);
  const hasTimeTracked = allTasks.some(task => task.timeTracked && task.timeTracked > 0);

const getDashboardEvents = async () => {
  try {
    const res = await axiosInstance.get("/api/countdowns");
    // Only show pinned events
    setDashboardEvents(res.data.filter(e => e.addedToDashboard));
  } catch (err) {
    console.error("Error fetching countdown events:", err);
  }
};

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      // Extract tasks array, fallback to empty array
      setAllTasks(response.data?.tasks || []);
    } catch (error) {
      console.error("Error fetching all tasks:", error);
    }
  };

  const onSeeMore = ()=>{
    navigate('/user/tasks')
  }

useEffect(() => {
  getDashboardData();
  getAllTasks();
  getDashboardEvents();

  window.refreshTasks = getAllTasks;
  return () => {
    delete window.refreshTasks;
  };
}, []);



  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Hi! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <Link to="/user/tasks" className="underline hover:font-semibold underline-offset-2">
            <InfoCard
              label="Total Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.All || 0
              )}
              color="bg-primary"
            />
          </Link>

          <Link to="/user/tasks?status=Pending" className="underline hover:font-semibold underline-offset-2">
            <InfoCard
              label="Pending Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.Pending || 0
              )}
              color="bg-violet-500"
            />
          </Link>

          <Link to="/user/tasks?status=In Progress" className="underline hover:font-semibold underline-offset-2">
            <InfoCard
              label="In Progress Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.InProgress || 0
              )}
              color="bg-cyan-500"
            />
          </Link>

          <Link to="/user/tasks?status=Completed" className="underline hover:font-semibold underline-offset-2">
            <InfoCard
              label="Completed Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.Completed || 0
              )}
              color="bg-lime-500"
            />
          </Link>
      </div>
    </div>

{dashboardEvents.length > 0 && (
  <div className="card my-5">
    {/* <h4 className="text-xl md:text-2xl text-primary font-bold mb-3">Countdown Events</h4> */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {dashboardEvents.map((event) => {
        const daysLeft = moment(event.eventDate).diff(moment(), "days");
        return (
          <div
            key={event._id}
            className="rounded-xl text-white p-4 bg-cover bg-center relative h-[180px]"
            style={{ backgroundImage: `url(${event.image || '/placeholder.jpg'})` }}
            // style={{ backgroundImage: `url('/placeholder.jpg')` }}
          >
            <div className="absolute inset-0 bg-black/20 rounded-xl" />
            <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-lg">{event.eventName}</h4>
                      <p className="text-3xl font-bold">D-{daysLeft >= 0 ? daysLeft : "Passed"}</p>
                      <p className="text-sm font-bold">{moment(event.eventDate).format("MMM D, YYYY")}</p>
                    </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

      <div>
        <DashboardAddons/>
      </div>

      <div className="card mt-5">
        <h4 className="text-xl md:text-2xl text-primary font-bold mb-3">Task Calendar</h4>
        <CalendarView allTasks={allTasks} />
      </div>

    {hasTimeTracked && (
      <div className="w-full">
        <TimeTrackerOverview
          allTasks={allTasks}
          onTaskClick={(task) => {
            navigate(`/tracker/time-tracker?task=${encodeURIComponent(task.title)}`);
          }}
        />
      </div>
    )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6 cursor-pointer">
        
        {allTasks.length > 0 && (
        <div>
          <div className="card cursor-pointer">
            <div className="flex cursor-pointer items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomPieChart
              data={pieChartData}
              colors={COLORS}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      )}

        {allTasks.length > 0 && (
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>

            <CustomBarChart
              data={barChartData}
            />
          </div>
        </div>
        )}

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="text-xl md:text-2xl text-primary font-bold mb-3">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
