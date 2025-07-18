import React from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const projectId = location.state?.project_id;


export default function ServiceSummaryCard({service}) {

    const getSuffix = (num)=>{
        switch (num){
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }
  return (
    <div>
      <div
            className={`p-[10px_15px] rounded-lg min-w-[140px] text-center ${service.service_type === 'free' ? 'bg-[#d5f7e9]' : 'bg-[#f7f7d5]'}`}
          >
            <Link to={`/servicedetails/${service.service_id}` 
             
          }><p class="m-0 font-bold">{service.service_round}{getSuffix(service.service_round)} service round</p></Link>
            <span class="text-sm text-gray-700">{service.service_date}</span>
          </div>
    </div>
  )
}
