import { useEffect, useState } from "react";
import api from "../api/api";
import {
  FaCalendarAlt, FaUsers, FaPlus, FaEnvelope, FaSync
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { motion } from "framer-motion";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

export default function EventStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events/stats"); // MUST be user-protected backend
      setData(res.data);
    } catch (err) {
      console.error("Stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></span>
      </div>
    );
  }

  // ================= SAFE DATA =================
  const attendance = data?.attendance || [];
  const eventsPerMonth = data?.eventsPerMonth || [];

  const totalAttendance = attendance.reduce(
    (sum: number, e: any) => sum + (e.attendees || 0),
    0
  );

  // ================= STATS =================
  const stats = [
    {
      label: "Total Events",
      value: data?.totalEvents || 0,
      icon: FaCalendarAlt,
      color: "text-indigo-500"
    },
    {
      label: "Active Events",
      value: data?.activeEvents || 0,
      icon: MdEventAvailable,
      color: "text-green-500"
    },
    {
      label: "Total Attendance",
      value: totalAttendance,
      icon: FaUsers,
      color: "text-blue-500"
    }
  ];

  // ================= CHART DATA =================
  const attendanceData = attendance.map((e: any) => ({
    name: e.title || "Event",
    attendees: e.attendees || 0
  }));

  const eventGrowthData = eventsPerMonth.map((e: any) => ({
    name: `Month ${e.month}`,
    events: e.count || 0
  }));

  // ================= UI =================
  return (
    <div className="space-y-6 min-h-screen">
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow rounded-2xl p-5 flex items-center gap-4"
          >
            <s.icon className={`text-3xl ${s.color}`} />
            <div>
              <p className="text-gray-500 text-sm">{s.label}</p>
              <h2 className="text-xl font-bold">{s.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ATTENDANCE */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Attendance Trend</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="attendees"
                stroke="#6366F1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GROWTH */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Event Growth</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={eventGrowthData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="events" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition">
          <FaPlus /> Create Event
        </button>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition">
          <FaEnvelope /> Send Message
        </button>

        <button className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition">
          <FaUsers /> View Attendees
        </button>
      </div>
    </div>
  );
}