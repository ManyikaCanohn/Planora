import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, MoreVertical } from "lucide-react";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import Swal from "sweetalert2";
import Welcome from "../components/Welcome";

type Participant = {
  id: number;
  event_id: number;
   event_name: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

// 🔥 Avatar from email (simple hash fallback)
const getAvatar = (email: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${email}`;

const Attendees = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");
  // const [selected, setSelected] = useState<number[]>([]);

  // Fetch (UNCHANGED LOGIC)
    const fetchParticipants = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:5000/api/participants",
          { withCredentials: true }
        );

        setParticipants(res.data);
      } catch (err) {
        console.error("Error fetching participants", err);
      } finally {
        setLoading(false);
      }
    };

  const handleError = () => {
    Swal.fire({
      icon: "info",
      title: "Try again later.",
      text: "Function Under development.",
    });
  };


  useEffect(() => {
    fetchParticipants();
  }, []);

  // Stats (UNCHANGED LOGIC)
  const stats = useMemo(() => {
    return {
      total: participants.length,
      pending: participants.filter((p) => p.status === "pending").length,
      approved: participants.filter((p) => p.status === "approved").length,
      rejected: participants.filter((p) => p.status === "rejected").length,
    };
  }, [participants]);

  // Filter + search (UI layer only)
  const filteredParticipants = useMemo(() => {
    return participants
      .filter((p) => {
        if (filter === "all") return true;
        return p.status === filter;
      })
      .filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
      );
  }, [participants, filter, search]);

  // Update status (UNCHANGED LOGIC)
 const updateStatus = async (
  id: number,
  status: "approved" | "rejected"
) => {
  try {
    await axios.put(
      `http://localhost:5000/api/participants/${id}`,
      { status },
      { withCredentials: true }
    );

    // refresh list
    fetchParticipants();

    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading attendees...</p>;

  return (
    <div className="space-y-6 min-h-screen">

      {/* 🔥 HEADER (premium style) */}
      <div className="flex items-center justify-center gap-10">

        <div>
          <h2 className="text-3xl font-bold text-secondary uppercase">
            Manage your Attendees
          </h2>
          <p className="text-sm text-gray-500">
            Approve, reject, and manage event registrations
          </p>
        </div>

        <div>
            <Welcome />
        </div>
      </div>

      {/* 📊 STATS (clean cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat label="Total" value={stats.total} color="bg-secondary" />
        <Stat label="Pending" value={stats.pending} color="bg-secondary" />
        <Stat label="Approved" value={stats.approved} color="bg-secondary" />
        <Stat label="Rejected" value={stats.rejected} color="bg-secondary" />
      </div>

      {/* 🎯 FILTERS */}
      <div className="flex justify-between">
        <div  className="flex flex-wrap gap-2">
          {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${
              filter === f
                ? "bg-secondary text-white"
                : "bg-white text-gray-900 hover:bg-secondary hover:text-white"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
        </div>

          {/* search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search attendees..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white text-secondary focus:outline-none"
          />
        </div>
      </div>

      {/* 📋 TABLE (premium UI version of your design) */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* TABLE */}
        <table className="w-full text-sm">

          <thead className="bg-secondary text-white text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Event</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Registered</th>
              <th className="px-6 py-3 text-left">Action</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">

            {filteredParticipants.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">

                {/* USER */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatar(p.email)}
                      className="w-10 h-10 text-sm rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">ID: {p.id}</p>
                    </div>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4 text-gray-600">
                  {p.email}
                </td>

                {/* EVENT */}
                <td className="px-6 py-4 text-gray-600">
                  {p.event_name}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : p.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* DATE */}
                <td className="px-6 py-4 text-gray-500">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>

                {/* ACTION */}
                <td className="px-6 py-4">
                  {p.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(p.id, "approved")}
                        className="p-2 rounded-lg cursor-pointer bg-green-600 text-white hover:bg-green-700"
                      >
                        <MdCheckCircle size={16} />
                      </button>

                      <button
                        onClick={() => updateStatus(p.id, "rejected")}
                        className="p-2 rounded-lg cursor-pointer bg-red-600 text-white hover:bg-red-700"
                      >
                        <MdCancel size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* MORE ACTIONS (like 3-dot menu style in OrderHistory) */}
                <td className="px-6 py-4 text-right">
                  <button onClick={handleError}><MoreVertical
                    size={18}
                    className="text-gray-400 cursor-pointer hover:text-gray-600"
                  /></button>
                </td>
                  
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 🔥 STAT CARD */
const Stat = ({ label, value, color }: any) => (
  <div className={`rounded-2xl p-4 text-white ${color}`}>
    <p className="text-sm opacity-80">{label}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default Attendees;