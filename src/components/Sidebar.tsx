// components/Sidebar.jsx
import {
  FaHome,
  FaBox,
  FaList,
  FaTags,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <div className="h-screen fixed w-64 bg-custom-black text-white flex flex-col justify-between p-4">
      {/* Top: Logo and Navigation */}
      <div>
        <h1 className="text-2xl font-bold mb-8"></h1>
        <nav className="space-y-4">
          <SidebarItem icon={<FaHome />} label="" />
          <SidebarItem icon={<FaBox />} label="Project" />
          <SidebarItem icon={<FaList />} label="Developer" />
          <SidebarItem icon={<FaTags />} label="Group" />
          <SidebarItem icon={<FaUsers />} label="Token Generate" />
        </nav>
      </div>

      <button
        onClick={() => logout()}
        className="flex items-center hover:bg-red-800/30 hover:text-red-300 px-4 cursor-pointer h-10 rounded-md text-gray-300 text-lg space-x-2 mt-8 "
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
};

const SidebarItem = ({ icon, label }) => (
  <NavLink
    to={`/${label.toLowerCase().replaceAll(" ", "-")}`}
    className={({ isActive }) =>
      `flex items-center transition duration-300 space-x-3 py-2 px-4 rounded-full cursor-pointer ${
        isActive ? "bg-white text-black font-semibold" : "hover:bg-white/10"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    <span>{label === "" ? "Overview" : label}</span>
  </NavLink>
);

export default Sidebar;
