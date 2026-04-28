import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import api from "../api/api";
import { FiPlus, FiSearch } from "react-icons/fi";

const API = "http://localhost:5000/api/events";

export default function EventDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredEvents = (events || []).filter(e => {
    return (
      (e?.title || "").toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || e.status === filter)
    );
  });

  const fetchEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event: any) => {
    setSelected(event);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  return (
    <div className="p-6 min-h-screen font-mono">

      <div className="flex gap-3 mb-6">
        
        <div className="w-full relative max-w-md items-center">
            <FiSearch className="text-2xl absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
                placeholder="Search events..."
                className="border border-secondary p-2 rounded w-full pl-10 pr-4 focus:outline-none font-mono"
                onChange={(e) => setSearch(e.target.value)}
          />
        </div>

          <select
            className="bg-secondary text-white focus:outline-none p-2 rounded"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
          </select>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl text-secondary font-bold">Events</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 cursor-pointer border border-secondary text-secondary hover:bg-secondary hover:text-white transition px-4 py-2 rounded-xl hover:bg-purple-700"
        >
          <FiPlus /> Create Event
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {events.map((e) => (
          <EventCard
            key={e.id}
            event={e}
            refresh={fetchEvents}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Modal */}
      {open && (
        <EventModal
          event={selected}
          onClose={() => setOpen(false)}
          refresh={fetchEvents}
        />
      )}
    </div>
  );
  }