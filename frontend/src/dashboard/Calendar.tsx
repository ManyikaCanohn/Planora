import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type Event = {
  id: number;
  title: string;
  description?: string;
  event_type: "virtual" | "physical" | "meeting" | "conference";
  start_date: string;
  end_date: string;
  location_name?: string;
};

const API = "http://localhost:5000/api/events";

const typeColors: Record<string, string> = {
  virtual: "#6366f1",
  physical: "#10b981",
  meeting: "#f59e0b",
  conference: "#ef4444"
};

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(API, { withCredentials: true });
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  // 📅 MONTH GRID
  const monthMatrix = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - firstDay.getDay());

    const days: Date[] = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      days.push(date);
    }

    return days;
  }, [currentDate]);

  // 🔍 EVENTS PER DAY
  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const changeMonth = (dir: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + dir)));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (date: Date) =>
    new Date().toDateString() === date.toDateString();

  const isCurrentMonth = (date: Date) =>
    date.getMonth() === currentDate.getMonth();

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">

      {/* ================= HEADER (10vh SaaS style) ================= */}
      <div className="h-[10vh] flex items-center justify-between px-6 border-b border-gray-800">

        <h1 className="text-lg font-bold tracking-wide">
          Planora Calendar
        </h1>

        {/* MONTH TITLE */}
        <p className="text-xl font-semibold text-indigo-300">
          {monthLabel}
        </p>

        {/* NAV CONTROLS */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setMonth(currentDate.getMonth() - 1))
              )
            }
            className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-500"
          >
            Today
          </button>

          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setMonth(currentDate.getMonth() + 1))
              )
            }
            className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= WEEK HEADER ================= */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-400 border-b border-gray-800">
        {weekDays.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* ================= CALENDAR GRID ================= */}
      <div className="grid grid-cols-7 flex-1 overflow-hidden">

        {monthMatrix.map((date, i) => (
          <div
            key={i}
            onClick={() => setSelectedDay(date)}
            className={`border border-gray-900 p-2 min-h-[100px] flex flex-col hover:bg-gray-900 transition cursor-pointer ${
              isCurrentMonth(date) ? "" : "opacity-30"
            }`}
          >

            {/* DATE */}
            <div
              className={`text-sm mb-1 ${
                isToday(date) ? "text-indigo-400 font-bold" : "text-gray-300"
              }`}
            >
              {date.getDate()}
            </div>

            {/* EVENTS */}
            <div className="space-y-1 overflow-hidden">
              {getEventsForDay(date).map((event) => (
                <div
                  key={event.id}
                  className="text-xs px-2 py-1 rounded truncate text-white shadow-sm"
                  style={{
                    backgroundColor: typeColors[event.event_type] || "#374151"
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* ================= SIDEBAR ================= */}
      {selectedDay && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-800 p-4 flex flex-col shadow-2xl">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">
              {selectedDay.toDateString()}
            </h2>

            <button
              onClick={() => setSelectedDay(null)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* EVENTS */}
          <div className="flex-1 overflow-y-auto">
            {getEventsForDay(selectedDay).length === 0 ? (
              <p className="text-gray-400">No events for this day</p>
            ) : (
              getEventsForDay(selectedDay).map((event) => (
                <div
                  key={event.id}
                  className="p-3 mb-3 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-750 transition"
                >
                  <h3 className="font-semibold text-white mb-1">
                    {event.title}
                  </h3>

                  <p className="text-xs text-gray-400 mb-2">
                    ⏰{" "}
                    {new Date(event.start_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}{" "}
                    →{" "}
                    {new Date(event.end_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>

                  <span className="text-xs px-2 py-1 rounded bg-indigo-600 inline-block mb-2">
                    {event.event_type}
                  </span>

                  <p className="text-sm text-gray-300">
                    {event.description?.trim()
                      ? event.description
                      : "No description provided"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}