import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#dfdfe5] ">
      <Navbar />
      <Sidebar />
      <main className="flex-1 pl-[16.5rem] pt-16">
        <Outlet />
      </main>
    </div>
  );
}
