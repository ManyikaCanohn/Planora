import { useState, useEffect } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import Welcome from "../components/Welcome";
import { FiTable, FiUsers } from "react-icons/fi";
import { FaCommentDots } from "react-icons/fa6";
import { FishingRod } from "lucide-react";

import {  FaPaperPlane } from "react-icons/fa";

export default function Messaging() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    event_id: "",
    subject: "",
    message: "",
    status: "all",
  });

  // 🔥 FETCH EVENTS
  useEffect(() => {
    api
      .get("http://localhost:5000/api/events", {
        withCredentials: true,
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("EVENT FETCH ERROR:", err));
  }, []);

  // 🔥 SEND MESSAGE
  const sendMessage = async () => {
    try {
      await api.post("http://localhost:5000/api/messages/send", form);

      Swal.fire({
        icon: "success",
        title: "Emails sent successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      // ✅ reset form
      setForm({
        event_id: "",
        subject: "",
        message: "",
        status: "all",
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to send emails",
      });
    }
  };

  return (
    <div className="space-y-6 min-h-screen">

          {/* HEADER */}
      <div className="flex justify-center gap-20 items-center">

        <div>
          <h1 className="text-3xl font-bold text-secondary uppercase">
            Messaging Center
          </h1>
          <p className="text-sm text-gray-500">
            Send emails to event attendees instantly
          </p>
        </div>

        <div>
          <Welcome />
        </div>

      </div>


      {/* 📦 FORM CARD */}
      <div className="rounded-2xl space-y-4 max-w-xl">

        {/* EVENT SELECT */}
      <div className="flex gap-10 items-center">
        <div>
          <div className="flex gap-2 items-center text-secondary">
            <FiTable />
            <label className="text-sm">Event Name</label>
          </div>
          <select
            value={form.event_id}
            className="w-full mt-1 p-2 border cursor-pointer rounded-lg focus:outline-none"
            onChange={(e) =>
              setForm({ ...form, event_id: e.target.value })
            }
          >
            <option value="">Select Event</option>
            {events.map((e: any) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS FILTER */}
        <div>
          <div className="flex gap-2 items-center text-secondary">
            <FiUsers />
            <label className="text-sm">Audience</label>
          </div>
          <select
            value={form.status}
            className="w-full mt-1 p-2 cursor-pointer border rounded-lg focus:outline-none"
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="all">All Attendees</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

        {/* SUBJECT */}
        <div>
          <div className="flex gap-2 items-center text-secondary">
            <FishingRod />
            <label className="text-sm">Subject</label>
          </div>
          <input
            value={form.subject}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none"
            placeholder="Enter email subject"
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
          />
        </div>

        {/* MESSAGE */}
        <div>
          <div className="flex gap-2 items-center text-secondary">
            <FaCommentDots />
            <label className="text-sm">Message</label>
          </div>
          <textarea
            value={form.message}
            className="w-full mt-1 p-2 border rounded-lg h-32 resize-none focus:outline-none"
            placeholder="Write your message..."
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />
        </div>

        {/* SEND BUTTON */}
        <button
          onClick={sendMessage}
          className="w-full bg-secondary text-white py-2 rounded-lg  cursor-pointer
          hover:opacity-90 transition font-medium flex gap-2 items-center justify-center"
          >
            <FaPaperPlane />  Send Email
        </button>

      </div>
    </div>
  );
}