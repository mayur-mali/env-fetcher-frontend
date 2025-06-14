import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import NavButton from "../components/NavButton";
import { FaPlus } from "react-icons/fa";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdGroups, MdVpnLock } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { Table } from "../components/Table";
import { getAllActivitiesApi, getDashboardStatsApi } from "../services/api";
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activities, setActivities] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  // useEffect(() => {
  //   const fetchActivity = async () => {
  //     try {
  //       setLoading(true);
  //       const activities = await getAllActivitiesApi();
  //       const dashboardState = await getDashboardStatsApi();
  //       console.log(dashboardState);

  //       setActivities(activities);
  //     } catch (err) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchActivity();
  // }, []);
  return (
    <div className="">
      <p className="text-2xl ml-4 text-gray-800">Quick State</p>
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        <Card
          label="Total Projects"
          icon={<BsGraphUpArrow className="text-3xl" />}
          value={user?.firstName || "Guest"}
        />
        <Card
          label="Developers"
          icon={<AiOutlineUsergroupAdd className="text-3xl" />}
          value={user?.email || "Not logged in"}
        />
        <Card
          label="Groups"
          icon={<MdGroups className="text-3xl" />}
          value={user?.role || "Not assigned"}
        />
        <Card
          label="Active Tokens
"
          icon={<MdVpnLock className="text-3xl" />}
          value="0"
        />
      </div>
      <p className="text-2xl ml-4 text-gray-800">Quick Action</p>
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        <NavButton path="/project" label="Project" icon={<FaPlus />} />
        <NavButton
          path="/developer"
          label="Add Developer"
          icon={<AiOutlineUsergroupAdd />}
        />
        <NavButton path="/group" label="Create Group" icon={<MdGroups />} />
        <NavButton
          path="/generate-token"
          label="Generate Token"
          icon={<MdVpnLock />}
        />
      </div>
      <p className="text-2xl ml-4 text-gray-800">Recent Activity</p>
      <Table
        minHeight=" min-h-auto"
        boxPadding=" p-0"
        data={[
          ["Activity", "Activity Date"],
          ...activities.map((activity) => [
            activity.message,
            new Date(activity.createdAt).toLocaleString(),
          ]),
        ]}
      />
    </div>
  );
}
