import { useEffect, useState } from "react";
import api from "../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FiDownload } from "react-icons/fi";

export default function ReportAnalytics() {
  const [range, setRange] = useState("30");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/analytics", { params: { range } });
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  const stats = [
    {
      title: "Total Events",
      value: data?.totalEvents || 0,
      color: "bg-indigo-500",
    },
    {
      title: "Active Events",
      value: data?.activeEvents || 0,
      color: "bg-green-500",
    },
    {
      title: "Total Attendance",
      value:
        data?.attendance?.reduce(
          (s: number, e: any) => s + (e.attendees || 0),
          0
        ) || 0,
      color: "bg-sky-500",
    },
    {
      title: "Growth Rate",
      value: "+12%",
      color: "bg-yellow-500",
    },
  ];

  const attendanceData = (data?.attendance || []).map((e: any) => ({
    event: e.title,
    attendees: e.attendees,
  }));

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Event", "Attendees"]],
      body: attendanceData.map((r: any) => [r.event, r.attendees]),
    });
    doc.save("report.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(attendanceData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100 flex flex-col font-mono">

    {/* ================= MAIN ================= */}
    <main className="flex-1 md:p-6 lg:p-8">

      {/* TOP BAR */}
      <div className="flex-1 md:flex-row md:justify-between md:items-center gap-3 mb-6">

        <div className="mb-5">
          <h1 className="text-2xl uppercase text-secondary font-mono font-bold">Data & Performance Overview</h1>
          <p className="text-gray-500 text-sm">
            Track event performance, attendance trends, and engagement insights in real time.
          </p>
        </div>

      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 font-mono">

        {stats.map((s) => (
          <div
            key={s.title}
            className="text-gray-700 border border-secondary p-3 md:p-4 rounded-2xl shadow-lg bg-white"
          >
            <p className="text-xs md:text-sm opacity-90">{s.title}</p>
            <h2 className="text-lg md:text-2xl font-bold">{s.value}</h2>
          </div>
        ))}

      </div>

      {/* ================= ANALYTICS HEADER ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 font-mono">

        <h3 className="font-semibold text-lg md:text-base">
          Event Analytics
        </h3>

        <div className="flex flex-wrap gap-2">

          <button
            onClick={exportPDF}
            className="text-xs flex items-center gap-2 border border-secondary text-secondary px-3 py-1 rounded-lg"
          >
            <FiDownload size={14} />
            PDF
          </button>

          <button
            onClick={exportExcel}
            className="text-xs flex items-center gap-2 bg-secondary text-white px-3 py-1 rounded-lg"
          >
            <FiDownload size={14} />
            Excel
          </button>

        </div>

      </div>

      {/* ================= BAR CHART ================= */}
      <div className="h-60 md:h-64 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-3 md:p-4 flex items-end gap-3 overflow-x-auto">

        {attendanceData.map((d: any, i: number) => {
          const max = Math.max(...attendanceData.map((x: any) => x.attendees || 0));
          const heightPercent = (d.attendees / max) * 100;

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 min-w-[50px] md:min-w-[60px]"
            >

              {/* BAR */}
              <div className="flex items-end h-32 md:h-40">
                <div
                  className="w-6 md:w-8 bg-blue-500 rounded-t-md transition-all"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* VALUE */}
              <span className="text-[10px] md:text-xs font-semibold text-gray-700">
                {d.attendees}
              </span>

              {/* LABEL */}
              <span className="text-[9px] md:text-[10px] text-gray-600 text-center w-12 md:w-16 truncate">
                {d.event}
              </span>

            </div>
          );
        })}

      </div>

      {/* ================= EVENT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-5">

        {attendanceData.map((event: any, i: number) => (
          <div
            key={i}
            className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 hover:shadow-md transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-2 gap-2">
              <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                {event.event}
              </h4>

              <span
                className={`text-[10px] md:text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                  event.attendees > 80
                    ? "bg-green-100 text-green-600"
                    : event.attendees > 40
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {event.attendees > 80
                  ? "High"
                  : event.attendees > 40
                  ? "Medium"
                  : "Low"}
              </span>
            </div>

            {/* BODY */}
            <div className="flex items-end justify-between gap-3">

              <div>
                <p className="text-[10px] md:text-xs text-gray-500">
                  Attendance
                </p>
                <p className="text-lg md:text-xl font-bold text-blue-600">
                  {event.attendees}
                </p>
              </div>

              {/* MINI BAR */}
              <div className="w-16 md:w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${Math.min(event.attendees, 100)}%`
                  }}
                />
              </div>

            </div>

          </div>
        ))}

      </div>

    </main>
  </div>
);
}