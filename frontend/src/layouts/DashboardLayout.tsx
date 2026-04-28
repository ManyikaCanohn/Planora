import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <div className="flex flex-1 bg-slate-100">

        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}