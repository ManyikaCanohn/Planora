
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
 return (
  <div className="min-h-screen flex flex-col">

    <div className="flex flex-1 bg-slate-100">

      {/* SIDEBAR (handles its own responsiveness internally) */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1
          w-full mt-15
          p-4 md:p-6 lg:p-10
          overflow-y-auto
          transition-all
          md:ml-24 lg:ml-72
        "
      >
        <Outlet />
      </main>

    </div>
  </div>
);
}