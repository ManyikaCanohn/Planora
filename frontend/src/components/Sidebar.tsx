import { NavLink } from "react-router-dom";
import { useState } from "react";

import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaInfoCircle,
  FaComments,
  FaRegCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaTable,
  FaRegCalendar,
} from "react-icons/fa";
import { FaGear, FaGears, FaTableCells } from "react-icons/fa6";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItem =
    "flex items-center gap-3 p-3 rounded-lg hover:scale-105 transition-transform duration-200";

  const active =
    "bg-violet-600 text-white rounded-lg";

  return (
    <aside
      className={`
        hidden md:flex
        bg-slate-900 text-white h-screen p-4 flex-col font-mono
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* TOP */}
      <div className="flex items-center justify-between mb-8 mt-3">

        {!collapsed && (
          <h1 className="text-2xl uppercase font-bold text-violet-400">
            Planora
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          <FaBars />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2">

        <NavLink to="/dashboard" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaHome />
          {!collapsed && "Dashboard"}
        </NavLink>

        <NavLink to="/dashboard/events" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaCalendarAlt />
          {!collapsed && "Events"}
        </NavLink>

        <NavLink to="/dashboard/attendees" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaUsers />
          {!collapsed && "Attendees"}
        </NavLink>

        {/* <NavLink to="/dashboard/registrations" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaInfoCircle />
          {!collapsed && "Registrations"}
        </NavLink> */}

        <NavLink to="/dashboard/messaging" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaComments />
          {!collapsed && "Messaging"}
        </NavLink>

        <NavLink to="/dashboard/calendar" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaRegCalendar />
          {!collapsed && "Calendar"}
        </NavLink>

        <NavLink to="/dashboard/reportanalytics" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaTable />
          {!collapsed && "Report & Analytics"}
        </NavLink>

        {/* <NavLink to="/dashboard/roles" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaUsers />
          {!collapsed && "Roles & Permissions"}
        </NavLink> */}

        <NavLink to="/dashboard/settings" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <FaGear />
          {!collapsed && "Setting"}
        </NavLink>

      </nav>

      {/* SIGN OUT */}
      <div className="mt-auto">
        <button className="flex items-center gap-3 p-3 text-red-400 hover:text-red-300 w-full">
          <FaSignOutAlt />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;