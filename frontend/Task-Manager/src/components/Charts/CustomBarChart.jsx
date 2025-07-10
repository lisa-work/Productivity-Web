import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useNavigate } from "react-router-dom";

const CustomBarChart = ({ data }) => {
  const navigate = useNavigate();

  const handleBarClick = (data) => {
    const priority = data.payload.priority;
    if (priority) navigate(`/user/tasks?priority=${priority}`);
  };

  const getBarColor = (entry) => {
    switch (entry?.priority) {
      case 'Low': return '#00BC7D';
      case 'Medium': return '#FE9900';
      case 'High': return '#FF1F57';
      default: return '#00BC7D';
    }
  };

    const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.priority}
          </p>
          <p className="text-sm text-gray-600">
            Count:{" "}
            <span className="text-sm font-medium text-gray-900">
              {payload[0].payload.count}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300} className="mt-5">
      <BarChart data={data}>
        <CartesianGrid stroke="none" />
        <XAxis dataKey="priority" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" onClick={handleBarClick} className="cursor-pointer">
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart