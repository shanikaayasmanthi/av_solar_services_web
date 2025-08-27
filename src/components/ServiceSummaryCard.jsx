import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceSummaryCard({ service, project_id, project_no}) {
  const getSuffix = (num) => {
    switch (num) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <div>
      <div
        className={`p-[10px_15px] rounded-lg min-w-[140px] text-center ${service.service_type === 'free' ? 'bg-[#d5f7e9]' : 'bg-[#f7f7d5]'} hover:transform hover:scale-105 transition-transform duration-200`}
      >
     <Link
  to={`/servicedetails/${service.service_id}/${project_id}`} 
  state={{
    service_id: service.service_id,
    project_id: project_id,
    project_no: project_no,
   
  }}
>

          <p className="m-0 font-bold">
            {service.service_round}{getSuffix(service.service_round)} service round
          </p>
        </Link>
        <span className="text-sm text-gray-700">{service.service_date}</span>
      </div>
    </div>
  );
}
