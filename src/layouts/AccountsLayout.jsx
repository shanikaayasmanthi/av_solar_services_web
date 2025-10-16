import React from "react";
import { Outlet,useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AccountsLayout() {
   return (
    <div>
      <Sidebar layout="accounts" />
        <Header showNotification={false} />

        <div className='mt-[70px] md:ml-[90px] p-9 ml-[40px]'>
          <Outlet />
      
      </div>
    </div>
  );
};


