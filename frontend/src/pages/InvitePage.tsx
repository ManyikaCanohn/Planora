import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { showLoading, hideLoading } from "../utils/loader";
import api from "../api/api";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Mail,
  Send,
} from "lucide-react";

const API = "http://localhost:5000/api/invite";

export default function InvitePage() {
  const { code } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // ======================
  // FETCH EVENT
  // ======================
  useEffect(() => {
    if (!code) return;

    const fetchEvent = async () => {
      try {
        showLoading("Loading event...");

        const res = await axios.get(`${API}/${code}`);
        setEvent(res.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Invalid Invite",
          text: "This invite link is not valid or has expired",
        });
      } finally {
        hideLoading();
        setLoading(false);
      }
    };

    fetchEvent();
  }, [code]);

  // ======================
  // REGISTER
  // ======================
  const register = async () => {
    if (!form.name || !form.email) {
      Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please fill in both name and email",
      });
      return;
    }

    try {
      setSubmitting(true);
      showLoading("Submitting request...");

      await api.post("/invite/register", {
        event_id: event.id,
        ...form,
      });

      hideLoading();

      Swal.fire({
        icon: "success",
        title: "Request Sent 🎉",
        text: "Waiting for admin approval",
        timer: 2000,
        showConfirmButton: false,
      });

      setForm({ name: "", email: "" });
    } catch (err: any) {
      hideLoading();

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ======================
  // LOADING STATE
  // ======================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-sm text-slate-400">
          Loading event...
        </div>
      </div>
    );
  }

  // ======================
  // ERROR STATE
  // ======================
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400">
        Event not found or invalid invite link
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-3xl grid md:grid-cols-2 gap-6">

        {/* ================= EVENT INFO ================= */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          
         <h1 className="text-2xl font-bold mt-2 text-white">
            {event.title}
          </h1>

<p className="text-sm text-slate-400 mt-2">
  {event.description}
</p>

{/* EVENT META FROM CALENDAR */}
<div className="mt-5 space-y-2 text-sm text-slate-300">

  <p>
    📅{" "}
    {new Date(event.start_date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}
  </p>

  <p>
    ⏰{" "}
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

  <p>
    📍 {event.location_name || "Online / Not specified"}
  </p>

</div>

        
        </div>

        {/* ================= FORM ================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

          <h2 className="text-lg font-semibold mb-1">
            Confirm your attendance
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            Enter your details to secure your spot
          </p>

          <div className="space-y-4">

            <input
              value={form.name}
              placeholder="Full name"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              value={form.email}
              placeholder="Email address"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <button
              onClick={register}
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-medium transition ${
                submitting
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {submitting ? "Submitting..." : "Join Event"}
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mt-4 text-center">
            Your request will be reviewed by the event organizer
          </p>
        </div>

      </div>
    </div>
  );
}