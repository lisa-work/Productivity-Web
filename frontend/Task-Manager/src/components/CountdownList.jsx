import React, { useEffect, useState } from "react";
import moment from "moment";
import axiosInstance from "../utils/axiosInstance";

const CountdownCard = ({ event, onToggle, onEdit, onDelete }) => {
  const daysLeft = moment(event.eventDate).diff(moment(), "days");

  return (
    <div
      className="rounded-xl text-white p-4 bg-cover bg-center relative h-[200px]"
      style={{ backgroundImage: `url(${event.image || '/uploads/placeholder.jpg'})` }}
    >
      <div className="absolute inset-0 bg-black/40 rounded-xl" />
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h4 className="font-bold">{event.eventName}</h4>
          <p className="text-lg">D-{daysLeft >= 0 ? daysLeft : "Passed"}</p>
          <p className="text-sm">{moment(event.eventDate).format("MMM D, YYYY")}</p>
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => onEdit(event)} title="Edit" className="bg-white text-black px-2 rounded">✏️</button>
          <button onClick={() => onDelete(event._id)} title="Delete" className="bg-red-500 px-2 rounded">🗑️</button>
          <button
            onClick={() => onToggle(event._id)}
            title="Toggle Dashboard"
            className={`px-2 rounded ${event.addedToDashboard ? "bg-yellow-400" : "bg-gray-300"}`}
          >
            📌
          </button>
        </div>
      </div>
    </div>
  );
};

const CountdownList = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    const res = await axiosInstance.get("/api/countdowns");
    setEvents(res.data);
  };

  const toggleDashboard = async (id) => {
    await axiosInstance.put(`/api/countdowns/${id}/toggle`);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await axiosInstance.delete(`/api/countdowns/${id}`);
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event) => (
        <CountdownCard
          key={event._id}
          event={event}
          onToggle={toggleDashboard}
          onDelete={deleteEvent}
          onEdit={setEditingEvent}
        />
      ))}
    </div>
  );
};

export default CountdownList;
