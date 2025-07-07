import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeekFn from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import startOfDay from "date-fns/startOfDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Modal from "../../components/Modal";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const locales = {
  "en-US": enUS,
};

const startOfWeek = (date, locale) => startOfWeekFn(date, { locale });

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ allTasks }) => {
  const navigate = useNavigate(); // <-- Moved inside component!

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [filter, setFilter] = useState({ status: "All", priority: "All" });
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const formatLocalDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    let filtered = Array.isArray(allTasks) ? allTasks : [];

    if (filter.status !== "All") {
      filtered = filtered.filter((task) => task.status === filter.status);
    }
    if (filter.priority !== "All") {
      filtered = filtered.filter((task) => task.priority === filter.priority);
    }

    const formattedEvents = filtered.map((task) => ({
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      taskData: task,
    }));

    setEvents(formattedEvents);
  }, [allTasks, filter]);

  // const handleSelectEvent = (event) => {
  //   setSelectedEvent(event.taskData);
  //   setShowModal(true);
  // };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.taskData);
    navigate(`/user/task-details/${event.taskData._id}`);
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(startOfDay(start));
    setSelectedEvent(null);
    setShowModal(true);
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonth = new Date(prevDate);
      nextMonth.setMonth(prevDate.getMonth() + 1);
      return nextMonth;
    });
  };

  const goToPrevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonth = new Date(prevDate);
      prevMonth.setMonth(prevDate.getMonth() - 1);
      return prevMonth;
    });
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  const tasksArray = Array.isArray(allTasks) ? allTasks : [];

  const filteredTasksForDate = selectedDate
    ? tasksArray.filter((task) => {
        const due = startOfDay(new Date(task.dueDate));
        const selected = startOfDay(selectedDate);
        return due.getTime() === selected.getTime() || due > selected;
      })
    : [];

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="px-3 py-2 outline outline-offset-3 rounded-md text-sm"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          className="px-3 py-2 outline outline-offset-3  rounded-md text-sm"
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-start gap-3 mb-4">
        <button
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="p-1 hover:bg-gray-200 rounded"
        >
          <HiChevronLeft size={24} />
        </button>

        <div className="text-lg font-semibold select-none">
          {currentDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </div>

        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          className="p-1 hover:bg-gray-200 rounded"
        >
          <HiChevronRight size={24} />
        </button>
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        date={currentDate}
        view={currentView}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        style={{ height: 500 }}
      />

      {/* Tasks list */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">
          Tasks for {selectedDate.toLocaleDateString()} and Upcoming
        </h3>
        {filteredTasksForDate.length === 0 ? (
          <p>No upcoming tasks found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {filteredTasksForDate.map((task) => (
              <li
                key={task._id}
                className="mb-1 cursor-pointer hover:text-primary hover:underline"
                onClick={() => handleClick(task._id)}
              >
                <strong>{task.title}</strong> — Due{" "}
                {formatLocalDate(task.dueDate)} — Status: {task.status} — Time Tracked: {task.trackedSeconds ? formatTime(task.trackedSeconds) : "00:00:00"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {selectedEvent ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {selectedEvent.title}
              </h2>
              <p className="text-sm mb-1">
                Due: {formatLocalDate(selectedEvent.dueDate)}
              </p>
              <p className="text-sm mb-1">Status: {selectedEvent.status}</p>
              <p className="text-sm mb-1">Priority: {selectedEvent.priority}</p>
              <p className="text-sm">{selectedEvent.description}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-2">Create New Task</h2>
              <p className="text-sm">
                Selected Date: {selectedDate?.toLocaleDateString()}
              </p>
              {/* You can embed TaskForm here */}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CalendarView;
