// FILE: src/pages/MainDashboard.tsx

import Welcome from "../components/Welcome";
import { useEffect, useState } from "react";
import api from "../api/api";
import { motion } from "framer-motion";

// lucide-react icons ONLY
import {
  RefreshCw,
  Users,
  CalendarDays,
  Rocket,
  Code2,
  Megaphone,
  Mic,
  Laptop,
  Bell,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

const eventIcons = [Code2, Rocket, Megaphone, Mic, Laptop];

export default function MainDashboard() {
  // ================= STATE =================
  const [statsData, setStatsData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, eventsRes, participantsRes] = await Promise.all([
        api.get("/events/stats"),
        api.get("/events"),
        api.get("/participants"),
      ]);

      setStatsData(statsRes.data);
      setEvents(eventsRes.data || []);
      setParticipants(participantsRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ================= SAFE DATA =================
  const attendance = statsData?.attendance || [];

  const totalAttendance = attendance.reduce(
    (sum: number, e: any) => sum + (e.attendees || 0),
    0
  );

  // ================= UPCOMING EVENTS =================
const now = new Date();

const upcomingEvents = [...events]
  .filter((event: any) => {
    if (!event?.start_date) return false;

    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : null;

    if (isNaN(start.getTime())) return false;

    // ✅ KEEP EVENTS THAT ARE:
    // 1. not started yet
    // 2. OR already started but NOT finished (tall events fix)
    if (end) {
      return end.getTime() >= now.getTime();
    }

    return start.getTime() >= now.getTime();
  })
  .sort((a: any, b: any) => {
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  })
  .slice(0, 10)
  .map((event: any, i: number) => {
    const Icon = eventIcons[i % eventIcons.length];

    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : null;

    const isOngoing =
      end && start.getTime() <= now.getTime() && end.getTime() >= now.getTime();

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      location_name: event.location_name,
      attendees: event.attendees ?? 0,
      isOngoing,
      Icon,
    };
  });

  // ================= STATS =================
  const financeCards = [
    {
      title: "Total Events",
      amount: statsData?.totalEvents || 0,
      icon: CalendarDays,
      active: false,
    },
    {
      title: "Participants",
      amount: totalAttendance,
      icon: Users,
      active: true,
    },
    {
      title: "Active Events",
      amount: statsData?.activeEvents || 0,
      icon: Rocket,
      active: false,
    },
  ];

  // ================= ORGANIZERS =================
  const organizers = participants
    .filter((p: any) => p.status === "approved")
    .slice(0, 5);

  // ================= NOTICES =================
  const latestNotices = participants.slice(0, 3).map((p: any) => ({
    id: p.id,
    title:
      p.status === "approved"
        ? "New attendee approved"
        : p.status === "pending"
        ? "Pending registration"
        : "Registration rejected",
    text: `${p.name} registered for ${p.event_name}`,
    status: p.status,
    date: new Date(p.created_at).toLocaleDateString(),
  }));

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center gap-3">
        <span className="h-3 w-3 animate-bounce rounded-full bg-indigo-500"></span>
        <span className="h-3 w-3 animate-bounce rounded-full bg-purple-500"></span>
        <span className="h-3 w-3 animate-bounce rounded-full bg-pink-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl overflow-hidden">

        {/* MAIN */}
        <main className="flex-1">

          {/* HERO */}
          <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#9b5cf5] to-[#b46eff] p-8 text-white">
            <div className="relative z-10 max-w-lg">
              <Welcome />
              <p className="mt-3 text-sm text-white/80">
                Manage your events, track attendance, and engage with your community all in one place. Make your events unforgettable! 
              </p>
            </div>

            <div className="absolute right-14 top-1/2 hidden -translate-y-1/2 opacity-70 text-white lg:block">
              <CalendarDays size={220} />
            </div>
          </section>

          {/* GRID */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">

            {/* LEFT */}
            <div>

              {/* STATS */}
              <section className="mb-8">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-dark">
                   Event Insights
                  </h2>

                  <button
                    onClick={fetchDashboardData}
                    className="flex items-center gap-2 rounded-full bg-[#f4ebff] px-4 py-2 text-sm font-medium text-[#8b4cf3]"
                  >
                    <RefreshCw size={14} />
                    Refresh
                  </button>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {financeCards.map((card, i) => {
                    const Icon = card.icon;

                    return (
                      <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        className="rounded-2xl bg-white p-6 shadow-sm"
                      >
                        <Icon className="mb-4 text-[#8b4cf3]" size={30} />

                        <h3 className="text-3xl font-bold">
                          {card.amount}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {card.title}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* UPCOMING EVENTS */}
            <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark">
                Upcoming Events
              </h2>
            </div>

                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-500">No upcoming events</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {upcomingEvents.map((event) => {
                      const Icon = event.Icon;

                      return (
                        <motion.div
                          key={event.id}
                          whileHover={{ y: -6, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="
                            relative overflow-hidden
                            rounded-2xl border border-secondary bg-white
                            min-h-[160px]
                            p-6
                            flex flex-col justify-between
                            shadow-sm
                          "
                        >
                          {/* subtle glow background */}
                          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#f3e8ff] blur-2xl opacity-60" />

                          {/* TOP SECTION */}
                          <div className="relative z-10 flex justify-between items-start gap-4">

                            <div className="space-y-2">
                              <h3 className="text-lg font-bold text-dark leading-snug">
                                {event.title}
                              </h3>

                              <p className="text-sm text-gray-500">
                                {new Date(event.start_date).toLocaleString(undefined, {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>

                            <div className="shrink-0 rounded-xl bg-[#f5edff] p-3 text-[#8b4cf3]">
                              <Icon size={28} />
                            </div>
                          </div>

                          {/* BOTTOM SECTION (reserved space so tall content looks clean) */}
                          <div className="relative z-10 mt-6 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Event ID: #{event.id}
                            </span>

                            <button className="text-sm font-medium text-[#8b4cf3] hover:underline">
                              View details
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
            </section>
            </div>

            {/* RIGHT */}
            <aside className="rounded-[28px] bg-[#faf7ff] p-6">

              {/* ORGANIZERS */}
              <div className="mb-8">
                <h2 className="mb-4 flex text-secondary uppercase items-center gap-2 font-bold">
                  <Users size={18} />
                    Management Team
                </h2>  

                <div className="space-y-3">
                  {organizers.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl bg-white p-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.email}`}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-xs text-gray-500">
                            {p.event_name}
                          </p>
                        </div>
                      </div>

                      <CheckCircle2 className="text-green-500" size={16} />
                    </div>
                  ))}
                </div>
              </div>

              {/* NOTICES */}
              <div>
                <h2 className="mb-4 flex items-center  text-secondary uppercase gap-2 font-bold">
                  <Bell size={18} />
                 Registration Updates
                </h2>

                <div className="space-y-4">
                  {latestNotices.map((n: any) => (
                    <div key={n.id} className="rounded-xl bg-white p-4">
                      <p className="font-semibold text-sm">{n.title}</p>
                      <p className="text-xs text-gray-500">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}