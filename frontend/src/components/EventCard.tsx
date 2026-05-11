import { FaTrashAlt } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa6";
import Swal from "sweetalert2";
import api from "../api/api";

export default function EventCard({ event, refresh }: any) {

  const statusColor = {
    draft: "bg-secondary",
    published: "bg-secondary",
    completed: "bg-secondary",
  };

  const typeColor = {
    virtual: "bg-secondary",
    physical: "bg-secondary",
    hybrid: "bg-secondary",
  };

  // =========================
  // SHARE INVITE (PRO VERSION)
  // =========================
  const shareInvite = async () => {
    if (!event?.invite_code) {
      Swal.fire({
        icon: "error",
        title: "Missing Invite Code",
        text: "This event does not have an invite link yet.",
      });
      return;
    }

    const link = `${window.location.origin}/invite/${event.invite_code}`;

    try {
      // loading state
      Swal.fire({
        title: "Preparing invite link...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await navigator.clipboard.writeText(link);

      Swal.fire({
        icon: "success",
        title: "Invite Copied 🎉",
        text: "You can now share it with participants",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error("Clipboard failed:", err);

      Swal.fire({
        icon: "error",
        title: "Copy Failed",
        text: "Could not copy invite link. Try again.",
      });
    }
  };

  // =========================
  // DELETE EVENT
  // =========================
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/events/${event.id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1200,
        showConfirmButton: false,
      });

      refresh(); // 🔁 reload events

    } catch (err) {
      console.error("DELETE ERROR:", err);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Something went wrong",
      });
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md hover:-translate-y-1 transition-all duration-300">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg text-secondary font-semibold">{event.title}</h2>

        <span className={`text-xs text-white px-2 py-1 rounded ${statusColor[event.status]}`}>
          {event.status}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
        {event.description}
      </p>

      {/* TYPE */}
      <div className="mt-3">
        <span className={`text-xs px-2 text-white py-1 rounded ${typeColor[event.event_type]}`}>
          {event.event_type}
        </span>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between mt-5 text-sm border-t border-slate-700 pt-3">

        <button onClick={handleDelete} className="text-red-500 flex items-center gap-2 cursor-pointer hover:text-red-700 transition">
          <FaTrashAlt />  Delete
        </button>

        <button
          onClick={shareInvite}
          className="text-secondary flex items-center gap-2 cursor-pointer hover:text-purple-700 transition"
        >
          <FaPaperPlane />  Invite
        </button>

        

      </div>

      
    </div>
  );
}