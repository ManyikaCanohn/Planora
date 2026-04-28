import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt, FaUsers, FaCheckCircle, FaClock, FaPlus, FaEnvelope
} from "react-icons/fa";
import { MdEventAvailable, MdPendingActions } from "react-icons/md";
import { motion } from "framer-motion";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const API = "http://localhost:5000/api";

export default function EventStats() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API}/analytics`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  // ================= LOADING =================
  if (!data) {
    return (
      <div className="flex justify-center items-center h-[60vh] gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></span>
      </div>
    );
  }

  // ================= REAL STATS =================
  const stats = [
    {
      label: "Total Events",
      value: data.totalEvents,
      icon: FaCalendarAlt,
      color: "text-indigo-500"
    },
    {
      label: "Active Events",
      value: data.activeEvents,
      icon: MdEventAvailable,
      color: "text-green-500"
    },
    {
      label: "Total Attendance",
      value: data.attendance.reduce((s: number, e: any) => s + e.attendees, 0),
      icon: FaUsers,
      color: "text-blue-500"
    }
  ];

  const COLORS = ["#6366F1", "#8B5CF6", "#22C55E", "#F59E0B"];

  const attendanceData = data.attendance.map((e: any) => ({
    name: e.title,
    attendees: e.attendees
  }));

  const eventGrowthData = data.eventsPerMonth.map((e: any) => ({
    name: `Month ${e.month}`,
    events: e.count
  }));

  const eventTypes = data.eventTypes;

  return (
    <div className="space-y-6 font-mono min-h-screen">

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
              <Line type="monotone" dataKey="attendees" stroke="#6366F1" strokeWidth={3} />
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

      {/* ================= EVENT TYPES ================= */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Event Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {eventTypes.map((e: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
              style={{
                borderLeft: `5px solid ${COLORS[i % COLORS.length]}`
              }}
            >
              <span className="font-medium">{e.event_type}</span>
              <span className="font-bold">{e.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ACTIVITY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white shadow rounded-2xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FaClock /> Latest Activity
          </h2>

          <ul className="space-y-2 text-sm">
            {data.latestActivity?.map((a: string, i: number) => (
              <li key={i} className="text-gray-600">• {a}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-2xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MdPendingActions /> Pending Approvals
          </h2>

          <ul className="space-y-2 text-sm">
            {data.pendingApprovals?.map((p: string, i: number) => (
              <li key={i} className="flex justify-between items-center">
                <span className="text-gray-600">{p}</span>
                <FaCheckCircle className="text-yellow-500 cursor-pointer" />
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-3">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <FaPlus /> Create Event
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <FaEnvelope /> Send Message
          </button>

          <button className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <FaUsers /> View Attendees
          </button>
        </div>
      </div>

    </div>
  );
}