import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        <Card label="Welcome" value={user?.name || "Guest"} />
        <Card label="Email" value={user?.email || "Not logged in"} />
        <Card label="Role" value={user?.role || "Not assigned"} />
      </div>
    </div>
  );
}
