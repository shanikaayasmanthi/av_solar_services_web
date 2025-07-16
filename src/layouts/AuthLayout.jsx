import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function AuthLayout() {
  return (
    <div>
      <Header/>
      <Sidebar/>
      <div className='mt-[85px] md:ml-[90px] p-9 ml-[40px]'>
        <Outlet/>
      </div>
      
    </div>
  );
}
