import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import { FiCheck, FiX, FiClock, FiUsers } from "react-icons/fi";

export default function EventAttendees({ eventId }: any) {
  const [event, setEvent] = useState<any>(null);
  const [tab, setTab] = useState("pending");
  const [selected, setSelected] = useState<number[]>([]);

  // ======================
  // FETCH EVENT
  // ======================
  const fetchEvent = async () => {
    try {
      Swal.fire({
        title: "Loading attendees...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);

      Swal.close();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not load attendees",
      });
    }
  };

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  useEffect(() => {
  const fetch = async () => {
    const res = await api.get(`/events/${eventId}`);
    console.log("EVENT RESPONSE:", res.data);
    setEvent(res.data);
  };

  fetch();
}, [eventId]);

  // ======================
  // UPDATE STATUS (SINGLE)
  // ======================
  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/events/${eventId}/attendees/${id}`, { status });

      setEvent((prev: any) => ({
        ...prev,
        attendees: prev.attendees.map((a: any) =>
          a.id === id ? { ...a, status } : a
        ),
      }));

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
      });
    }
  };

  // ======================
  // BULK ACTIONS
  // ======================
  const bulkUpdate = async (status: string) => {
    try {
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await Promise.all(
        selected.map((id) =>
          api.patch(`/events/${eventId}/attendees/${id}`, { status })
        )
      );

      setEvent((prev: any) => ({
        ...prev,
        attendees: prev.attendees.map((a: any) =>
          selected.includes(a.id) ? { ...a, status } : a
        ),
      }));

      setSelected([]);
      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Bulk update failed",
      });
    }
  };

  // ======================
  // FILTERED DATA
  // ======================
  const attendees = event?.attendees || [];

  const filtered = attendees.filter((a: any) => a.status === tab);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="p-4 border rounded-xl bg-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-secondary">
          <FiUsers /> Attendees
        </h2>

        <span className="text-sm text-gray-500">
          Total: {attendees.length}
        </span>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-4 text-sm">
        {["pending", "approved", "rejected"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-full border ${
              tab === t
                ? "bg-secondary text-white"
                : "text-gray-600"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* BULK ACTIONS */}
      {selected.length > 0 && tab === "pending" && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => bulkUpdate("approved")}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Approve ({selected.length})
          </button>

          <button
            onClick={() => bulkUpdate("rejected")}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Reject ({selected.length})
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">

        {filtered.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            No {tab} attendees
          </p>
        )}

        {filtered.map((a: any) => (
          <div
            key={a.id}
            className="flex items-center justify-between border p-3 rounded-lg"
          >

            {/* CHECKBOX (only pending) */}
            {tab === "pending" && (
              <input
                type="checkbox"
                checked={selected.includes(a.id)}
                onChange={() => toggleSelect(a.id)}
                className="mr-2"
              />
            )}

            {/* INFO */}
            <div className="flex-1">
              <p className="font-semibold">{a.name}</p>
              <p className="text-sm text-gray-500">{a.email}</p>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2">

              {a.status === "pending" && (
                <span className="flex items-center gap-1 text-yellow-500 text-sm">
                  <FiClock /> Pending
                </span>
              )}

              {a.status === "approved" && (
                <span className="text-green-600 text-sm">
                  Approved
                </span>
              )}

              {a.status === "rejected" && (
                <span className="text-red-500 text-sm">
                  Rejected
                </span>
              )}

              {/* ACTIONS */}
              {a.status === "pending" && (
                <div className="flex gap-2 ml-2">

                  <button
                    onClick={() => updateStatus(a.id, "approved")}
                    className="text-green-600 hover:scale-110 transition"
                  >
                    <FiCheck />
                  </button>

                  <button
                    onClick={() => updateStatus(a.id, "rejected")}
                    className="text-red-500 hover:scale-110 transition"
                  >
                    <FiX />
                  </button>

                </div>
              )}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}