import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";

// 🟢 Countdown form modal for create/edit
const CountdownFormModal = ({ onClose, onSuccess, event }) => {
  const isEditing = !!event;
  const [formData, setFormData] = useState({
    eventName: event?.eventName || "",
    eventDate: event?.eventDate?.slice(0, 10) || "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("eventName", formData.eventName);
    data.append("eventDate", formData.eventDate);
    if (image) data.append("image", image);

    try {
      if (isEditing) {
        await axiosInstance.put(`/api/countdowns/${event._id}`, data);
        toast.success("Event updated!");
      } else {
        await axiosInstance.post("/api/countdowns", data);
        toast.success("Event created!");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? "Edit Countdown" : "Create Countdown"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            className="w-full border px-3 py-2 rounded"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            required
          />
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            required
          />
          <input
            type="file"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CountdownPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get("/api/countdowns");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch countdowns", err);
    }
  };

  const toggleDashboard = async (id) => {
    await axiosInstance.put(`/api/countdowns/${id}/toggle`);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    await axiosInstance.delete(`/api/countdowns/${id}`);
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <DashboardLayout activeMenu="Countdown">
      <div className="p-5 my-5">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl md:text-2xl font-medium">My Countdown Events</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            + New Countdown
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-500">No events yet. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => {
              const daysLeft = moment(event.eventDate).diff(moment(), "days");
              return (
                <div
                  key={event._id}
                  className="rounded-xl text-white p-4 bg-cover bg-center relative h-[180px]"
                  style={{ backgroundImage: `url(${event.image || '/uploads/placeholder.jpg'})` }}
                >
                  <div className="absolute inset-0 bg-black/40 rounded-xl z-0" />
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <h4 className="font-bold">{event.eventName}</h4>
                      <p className="text-lg">D-{daysLeft >= 0 ? daysLeft : "Passed"}</p>
                      <p className="text-sm">{moment(event.eventDate).format("MMM D, YYYY")}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowModal(true);
                        }}
                        title="Edit"
                        className="bg-white text-black px-2 rounded"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteEvent(event._id)}
                        title="Delete"
                        className="bg-red-500 px-2 rounded"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => toggleDashboard(event._id)}
                        title="Toggle Dashboard"
                        className={`px-2 rounded ${event.addedToDashboard ? "bg-yellow-400" : "bg-gray-300"}`}
                      >
                        📌
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
          <CountdownFormModal
            onClose={() => {
              setShowModal(false);
              setSelectedEvent(null);
            }}
            onSuccess={fetchEvents}
            event={selectedEvent}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CountdownPage;
