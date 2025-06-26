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
import RecentActivityFeed from "../components/RecentActivityFeed";
import { DrawerWrapper } from "../components/DrawerWrapper";
interface DashboardState {
  stats: {
    totalProjects: number;
    totalDevelopers: number;
    totalGroups: number;
    activeTokens: number;
  };
  recentActivities: any[];
}
export default function Dashboard() {
  const { user, logout } = useAuth();

  const [dashboardState, setDashboardState] = React.useState<DashboardState>({
    stats: {
      totalProjects: 0,
      totalDevelopers: 0,
      totalGroups: 0,
      activeTokens: 0,
    },
    recentActivities: [],
  });

  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);

        const dashboardState = await getDashboardStatsApi();
        setDashboardState(dashboardState as DashboardState);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);
  return (
    <div className="">
      <p className="text-2xl ml-4 text-gray-800">Quick State</p>
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        <Card
          label="Total Projects"
          icon={<BsGraphUpArrow className="text-3xl" />}
          value={dashboardState.stats.totalProjects || 0}
        />
        <Card
          label="Developers"
          icon={<AiOutlineUsergroupAdd className="text-3xl" />}
          value={dashboardState.stats.totalDevelopers || 0}
        />
        <Card
          label="Groups"
          icon={<MdGroups className="text-3xl" />}
          value={dashboardState.stats.totalGroups || 0}
        />
        <Card
          label="Active Tokens
"
          icon={<MdVpnLock className="text-3xl" />}
          value={dashboardState.stats.activeTokens || 0}
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
          path="/token-generate"
          label="Generate Token"
          icon={<MdVpnLock />}
        />
      </div>

      <RecentActivityFeed activities={dashboardState.recentActivities || []} />
    </div>
  );
}
