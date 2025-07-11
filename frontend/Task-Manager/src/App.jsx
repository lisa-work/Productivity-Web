import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";
import CreateUserTask from "./pages/User/CreateUserTask";
import TimeReportPage from "./pages/Tracker/TimeReportPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import CountdownPage from "./pages/Tracker/CountdownPage";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/create-task" element={<CreateUserTask />} />
            <Route path="/user/time-tracker" element={<TimeReportPage />} />
            <Route path="/user/countdown" element={<CountdownPage />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />

             {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading) return <Outlet />
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  else {
    return <Navigate to="/user/dashboard" />
  }
 
};