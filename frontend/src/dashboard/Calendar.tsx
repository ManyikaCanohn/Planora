import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiClock } from "react-icons/fi";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

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
  virtual: "bg-indigo-500",
  physical: "bg-emerald-500",
  meeting: "bg-amber-500",
  conference: "bg-red-500",
};

const formatCountdown = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
};

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [reminders, setReminders] = useState<Event[]>([]);
  const [now, setNow] = useState(new Date());

  // ================= FETCH EVENTS =================
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(API, { withCredentials: true });
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  // ================= NOTIFICATION PERMISSION =================
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ================= REMINDER ENGINE =================
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();

      const upcoming = events.filter((event) => {
        const start = new Date(event.start_date);
        const diff = start.getTime() - now.getTime();

        return diff > 0 && diff <= 30 * 60 * 1000; // next 30 mins
      });

      setReminders(upcoming);

      // browser notifications
      upcoming.forEach((event) => {
        if (Notification.permission === "granted") {
          new Notification("⏰ Upcoming Event", {
            body: `${event.title} starts soon`,
          });
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [events]);

  // ================== COUNTDOWN======================
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
  }, 1000);

  return () => clearInterval(interval);
}, []);

  const today = new Date();

  const todayEvents = events.filter((e) => {
    const d = new Date(e.start_date);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  const upcomingEvent = [...events]
  .map((e) => ({
    ...e,
    diff: new Date(e.start_date).getTime() - now.getTime(),
  }))
  .filter((e) => e.diff > 0)
  .sort((a, b) => a.diff - b.diff)[0];

  const weekEvents = events.filter((e) => {
    const d = new Date(e.start_date);
    const diffDays =
      (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });

  // ================= CALENDAR GRID =================
  const monthMatrix = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }).map((_, i) => {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      return date;
    });
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const d = new Date(event.start_date);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });
  };

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (dir: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1)
    );
  };

  return (
    <div className="min-h-screen from-indigo-100 via-purple-100 to-indigo-200 flex">

      {/* ================= MAIN ================= */}
      <main className="flex-1">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl uppercase text-secondary font-bold text-gray-800">
              Your event Calendar
            </h1>
            <p className="text-sm text-gray-500">
              Click a day to view event details.
            </p>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">

          {/* 1. TODAY SUMMARY */}
          <div className="bg-white/60 p-4 rounded-2xl shadow">
            <p className="text-xs text-gray-500">Today Summary</p>
            <h2 className="text-secondary font-bold">{todayEvents.length} Events</h2>
          </div>

          {/* 2. NEXT EVENT */}
          <div className="bg-white/60 p-4 rounded-2xl shadow flex items-center gap-2">
            {/* <FiClock /> */}
            <div>
              <p className="text-xs text-gray-500">Next Event</p>
              <h2 className="text-secondary font-bold">
                {upcomingEvent
                  ? upcomingEvent.title
                  : "No upcoming events"}
              </h2>
            </div>
          </div>

          {/* 3. COUNTDOWN */}
          <div className="bg-white/60 p-4 rounded-2xl shadow">
            <p className="text-xs text-gray-500">Countdown</p>
            <h2 className="text-secondary font-bold">
                {upcomingEvent
                  ? formatCountdown(upcomingEvent.diff)
                  : "--"}
              </h2>
          </div>

          {/* 4. WEEK SNAPSHOT */}
          <div className="bg-white/60 p-4 rounded-2xl shadow">
            <p className="text-xs text-gray-500">This Week</p>
            <h2 className="text-secondary font-bold">
              {weekEvents.length} Events
            </h2>
          </div>


        </div>

        {/* MONTH NAV */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 bg-white/60 text-secondary rounded-xl shadow flex items-center gap-2"
          >
            <MdNavigateBefore />
            Prev
          </button>

          <h2 className="text-lg font-semibold text-secondary uppercase">
            {monthLabel}
          </h2>

          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 bg-white/60 rounded-xl text-secondary shadow flex items-center gap-2"
          >
            Next
            <MdNavigateNext />
          </button>
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-2">
          {monthMatrix.map((date, i) => {
            const dayEvents = getEventsForDay(date);

            const hasReminder = reminders.some((r) => {
              const d = new Date(r.start_date);
              return (
                d.getFullYear() === date.getFullYear() &&
                d.getMonth() === date.getMonth() &&
                d.getDate() === date.getDate()
              );
            });

            return (
              <div
                key={i}
                onClick={() => setSelectedDay(date)}
                className="bg-white/50 backdrop-blur p-2 rounded-xl min-h-[80px] shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="text-lg font-semibold text-secondary mb-2">
                  {date.getDate()}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-[10px] text-white px-2 py-1 rounded-lg truncate ${
                        typeColors[event.event_type]
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}

                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}

                  {hasReminder && (
                    <div className="text-[10px] flex items-center gap-1 mt-1 px-2 py-[2px] rounded-full bg-yellow-400 text-black font-medium w-fit">
                      <FiClock /> Soon
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ================= DAY MODAL ================= */}
      {selectedDay && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white/40 backdrop-blur-2xl border-l border-white/30 shadow-2xl p-5 flex flex-col">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {selectedDay.toDateString()}
            </h2>

            <button
              onClick={() => setSelectedDay(null)}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          {/* REMINDERS */}
          {reminders.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-yellow-100 border border-yellow-300">
              <h3 className="text-sm font-semibold text-yellow-800">
                Upcoming Reminders
              </h3>

              <div className="mt-2 space-y-1">
                {reminders.map((r) => (
                  <div key={r.id} className="text-xs text-yellow-900">
                    ⏰ {r.title} —{" "}
                    {new Date(r.start_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVENTS */}
          <div className="flex-1 overflow-y-auto space-y-3">

            {getEventsForDay(selectedDay).length === 0 ? (
              <p className="text-gray-500">No events for this day</p>
            ) : (
              getEventsForDay(selectedDay).map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">
                      {event.title}
                    </h3>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-full text-white ${
                        typeColors[event.event_type]
                      }`}
                    >
                      {event.event_type}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(event.start_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    →{" "}
                    {new Date(event.end_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    {event.description || "No description provided"}
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