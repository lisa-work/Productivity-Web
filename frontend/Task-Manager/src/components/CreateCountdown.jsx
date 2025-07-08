import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const CreateCountdown = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ eventName: "", eventDate: "" });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("eventName", formData.eventName);
    data.append("eventDate", formData.eventDate);
    if (image) data.append("image", image);

    try {
      await axiosInstance.post("/api/countdowns", data);
      toast.success("Event created!");
      setFormData({ eventName: "", eventDate: "" });
      setImage(null);
      onSuccess();
    } catch {
      toast.error("Failed to create event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 bg-white shadow rounded">
      <input
        type="text"
        placeholder="Event Name"
        value={formData.eventName}
        onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
        required
      />
      <input
        type="date"
        value={formData.eventDate}
        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
        required
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
      <button type="submit" className="bg-primary text-white px-3 py-2 rounded mt-2">
        Create Countdown
      </button>
    </form>
  );
};

export default CreateCountdown;
