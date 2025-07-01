import React from 'react';

const DashboardCard = ({ title, value }) => {
  return (
    <div className="p-6 text-center bg-white border border-gray-200 shadow-md rounded-xl">
      <p className="mb-2 text-xl font-semibold text-gray-800">{title}</p>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default DashboardCard;