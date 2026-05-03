import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FE] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
