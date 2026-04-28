import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt, FaUsers, FaTicketAlt
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { motion } from "framer-motion";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const API = "http://localhost:5000/api";

export default function ReportAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`${API}/analytics`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  // =========================
  // 🎨 LOADING (SAAS DOTS)
  // =========================
  if (!data) {
    return (
      <div className="flex justify-center items-center h-[60vh] gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></span>
      </div>
    );
  }

  // =========================
  // 🎨 COLORS
  // =========================
  const COLORS = ["#6366F1", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444"];

  // =========================
  // 📊 DATA TRANSFORMATION
  // =========================
  const attendanceData = data.attendance.map((e: any) => ({
    event: e.title,
    attendees: e.attendees
  }));

  const eventGrowthData = data.eventsPerMonth.map((e: any) => ({
    month: `Month ${e.month}`,
    events: e.count
  }));

  const categoryData = data.eventTypes.map((e: any) => ({
    type: e.event_type,
    count: e.count
  }));

  // =========================
  // 📄 SAAS PDF EXPORT
  // =========================
  const exportPDF = (title: string, columns: string[], rows: any[]) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(title, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [columns],
      body: rows.map(r => Object.values(r)),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(`${title}.pdf`);
  };

  // =========================
  // 📊 EXCEL EXPORT
  // =========================
  const exportExcel = (fileName: string, data: any[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // =========================
  // 📊 STATS
  // =========================
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

  // =========================
  // 🚀 UI
  // =========================
  return (
    <div className="space-y-7 min-h-screen font-mono">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex items-center gap-4"
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
          <h2 className="font-semibold mb-4">Attendance per Event</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendees">
                {attendanceData.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() =>
                exportPDF(
                  "Attendance Report",
                  ["Event", "Attendees"],
                  attendanceData
                )
              }
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              Export PDF
            </button>

            <button
              onClick={() =>
                exportExcel("attendance_report", attendanceData)
              }
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* GROWTH */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Events Per Month</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={eventGrowthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() =>
                exportPDF(
                  "Event Growth Report",
                  ["Month", "Events"],
                  eventGrowthData
                )
              }
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              Export PDF
            </button>

            <button
              onClick={() =>
                exportExcel("growth_report", eventGrowthData)
              }
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Event Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categoryData.map((e: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}20, white)`
              }}
            >
              <span className="font-medium">{e.type}</span>

              <span
                className="px-3 py-1 rounded-full text-white text-sm"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              >
                {e.count}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() =>
              exportPDF(
                "Category Report",
                ["Type", "Count"],
                categoryData
              )
            }
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
          >
            Export PDF
          </button>

          <button
            onClick={() =>
              exportExcel("category_report", categoryData)
            }
            className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Export Excel
          </button>
        </div>
      </div>

    </div>
  );
}