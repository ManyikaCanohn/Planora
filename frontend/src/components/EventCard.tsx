import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
import { FaPaperPlane, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function EventCard({ event, refresh, onEdit }: any) {

  const statusColor = {
    draft: "bg-yellow-500",
    published: "bg-green-500",
    completed: "bg-gray-500",
  };

  const typeColor = {
    virtual: "bg-blue-500",
    physical: "bg-orange-500",
    hybrid: "bg-purple-500",
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

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md hover:-translate-y-1 transition-all duration-300">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg text-secondary font-semibold">{event.title}</h2>

        <span className={`text-xs px-2 py-1 rounded ${statusColor[event.status]}`}>
          {event.status}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
        {event.description}
      </p>

      {/* TYPE */}
      <div className="mt-3">
        <span className={`text-xs px-2 py-1 rounded ${typeColor[event.event_type]}`}>
          {event.event_type}
        </span>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between mt-5 text-sm border-t border-slate-700 pt-3">

        <button
          onClick={() => onEdit(event)}
          className="flex items-center gap-2 cursor-pointer transition"
        >
          <FaPenAlt />  Edit
        </button>

        <button
          onClick={shareInvite}
          className="text-purple-400 flex items-center gap-2 cursor-pointer hover:text-purple-300 transition"
        >
          <FaPaperPlane />  Invite
        </button>

        <button className="text-red-400 flex items-center gap-2 cursor-pointer hover:text-red-500 transition">
          <FaTrashAlt />  Delete
        </button>

      </div>
    </div>
  );
}