import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  Table2,
  Calendar,
  Settings,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Sign out?",
      text: "You will need to login again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, sign out",
      confirmButtonColor: "#7c3aed",
    });

    if (result.isConfirmed) {
      await logout();
      navigate("/login");
    }
  };

  const navItem =
    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-violet-600/20 hover:text-white";

  const active =
    "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg";

  const SidebarContent = () => (
    <>
      {/* TOP */}
      <div className="mb-5 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-3xl font-bold uppercase text-transparent">
              Planora
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Event Management System
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:block rounded-xl bg-white/5 p-2 text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <Menu size={20} />
        </button>

        {/* mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden rounded-xl bg-white/5 p-2 text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/dashboard/events" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <CalendarDays size={20} />
          {!collapsed && <span>Events</span>}
        </NavLink>

        <NavLink to="/dashboard/attendees" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <Users size={20} />
          {!collapsed && <span>Attendees</span>}
        </NavLink>

        <NavLink to="/dashboard/messaging" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <MessageSquare size={20} />
          {!collapsed && <span>Messaging</span>}
        </NavLink>

        <NavLink to="/dashboard/calendar" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <Calendar size={20} />
          {!collapsed && <span>Calendar</span>}
        </NavLink>

        <NavLink to="/dashboard/reportanalytics" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <Table2 size={20} />
          {!collapsed && <span>Reports & Analytics</span>}
        </NavLink>

        <NavLink to="/dashboard/settings" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* SIGN OUT */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 bg-red-600 cursor-pointer hover:bg-red-500"
        >
          <LogOut size={20} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0f172a] border-b border-white/10 p-4 flex items-center justify-between text-white">
        <h1 className="font-bold text-lg">Planora</h1>

        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen flex-col bg-[#0f172a]
          border-r border-white/10 p-4 text-white
          transition-all duration-300
          
          hidden md:flex
          ${collapsed ? "w-24" : "w-72"}
        `}
      >
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-[#0f172a]
          border-r border-white/10 p-4 text-white
          transform transition-transform duration-300 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;