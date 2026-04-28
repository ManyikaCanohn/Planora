import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import Members from "./dashboard/ReportAnalytics";
import About from "./dashboard/Attendees";
import Messaging from "./dashboard/Messaging";
import Calendar from "./dashboard/Calendar";
import Attendees from "./dashboard/Attendees";
import ReportAnalytics from "./dashboard/ReportAnalytics";
import Settings from "./dashboard/Settings";
import EventDashboard from "./dashboard/EventDashboard";
import InvitePage from "./pages/InvitePage";
import MainDashboard from "./dashboard/MainDashboard";
// import Dashboard from "./dashboard/Dashboard";


export default function App() {
  return (

      <Routes>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invite/:code" element={<InvitePage />} />

        <Route path="/" element={<LandingPage />} />

        {/* DASHBOARD (PROTECTED) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        > 

          <Route index element={<MainDashboard />} />
          <Route path="attendees" element={<Attendees />} />
          <Route path="events" element={<EventDashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="about" element={<About />} />
          <Route path="messaging" element={<Messaging />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="reportanalytics" element={<ReportAnalytics />} />
          <Route path="settings" element={<Settings />} />
        
        </Route>

        {/* DASHBOARD PAGES */}

        {/* <Route index element={<Dashboard />} /> */}
          

        

     

      </Routes>
  );
}