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
        </nav>
      </div>

      <button
        onClick={() => logout()}
        className="flex items-center space-x-2 text-sm mt-8 hover:text-gray-400"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
};

const SidebarItem = ({ icon, label }) => (
  <NavLink
    to={`/${label.toLowerCase()}`}
    className={({ isActive }) =>
      `flex items-center space-x-3 py-2 px-4 rounded-full cursor-pointer ${
        isActive ? "bg-white text-black font-semibold" : "hover:bg-gray-800"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    <span>{label === "" ? "Overview" : label}</span>
  </NavLink>

  /* <div
    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer ${
      active ? "bg-white text-black font-semibold" : "hover:bg-gray-800"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </div> */
);

export default Sidebar;
