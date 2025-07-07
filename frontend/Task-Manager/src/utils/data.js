import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut,
  
  } from "react-icons/lu";
import { IoTimeOutline } from "react-icons/io5";
import { CiMoneyCheck1 } from "react-icons/ci";
import { RxCountdownTimer } from "react-icons/rx";
import { GiArtificialHive } from "react-icons/gi";
  
  export const SIDE_MENU_DATA = [
    {
      id: "01",
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "02",
      label: "Manage Tasks",
      icon: LuClipboardCheck,
      path: "/admin/tasks",
    },
    {
      id: "03",
      label: "Create Task",
      icon: LuSquarePlus,
      path: "/admin/create-task",
    },
    {
      id: "04",
      label: "Team Members",
      icon: LuUsers,
      path: "/admin/users",
    },
    {
      id: "05",
      label: "Logout",
      icon: LuLogOut,
      path: "logout",
    },
  ];
  
  export const SIDE_MENU_USER_DATA = [
    {
      id: "01",
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/user/dashboard",
    },
    {
      id: "02",
      label: "My Tasks",
      icon: LuClipboardCheck,
      path: "/user/tasks",
    },
    {
      id: "03",
      label: "Time Tracker",
      icon: IoTimeOutline,
      path: "/user/time-tracker",
    },
    {
      id: "04",
      label: "Expense Tracker",
      icon: CiMoneyCheck1,
      path: "/user/expense-tracker",
    },
    {
      id: "05",
      label: "Countdown",
      icon: RxCountdownTimer,
      path: "/user/countdown",
    },
    {
      id: "06",
      label: "AI Assistant",
      icon: GiArtificialHive,
      path: "/user/ai-assistant",
    },
    {
      id: "06",
      label: "Logout",
      icon: LuLogOut,
      path: "logout",
    },
  ];
  
  export const PRIORITY_DATA = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ]
  
  export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ]
  