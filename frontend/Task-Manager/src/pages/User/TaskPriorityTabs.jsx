const TaskPriorityTabs = ({ activeTab, setActiveTab }) => {
  const priorities = [
    { label: "All Priorities", value: "All" },
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  return (
    <div className="flex gap-2 mt-4">
      {priorities.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setActiveTab(value)}
          className={`px-3 py-1 rounded-full text-sm border ${
            activeTab === value
              ? "bg-primary text-white font-semibold"
              : "bg-blue-100 text-gray-700 text-sm"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TaskPriorityTabs;
