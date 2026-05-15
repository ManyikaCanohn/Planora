import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import Swal from "sweetalert2";

import { CalendarDays, Users, Smile } from "lucide-react";

import { Bold, ImagePlus, Italic, Link, Loader2, MessageSquare, Paperclip, PenLine, Send, Sparkles, Underline } from "lucide-react";

export default function Messaging() {
  const [events, setEvents] = useState<any[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    event_id: "",
    subject: "",
    message: "",
    status: "all",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  // =========================
  // FETCH EVENTS
  // =========================
  useEffect(() => {
    api
      .get("http://localhost:5000/api/events", {
        withCredentials: true,
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("EVENT FETCH ERROR:", err));
  }, []);

  // =========================
  // TEXT FORMATTING
  // =========================
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();

    setForm({
      ...form,
      message: editorRef.current?.innerHTML || "",
    });
  };

  // =========================
  // INSERT LINK
  // =========================
  const insertLink = () => {
    const url = prompt("Enter URL");

    if (url) {
      formatText("createLink", url);
    }
  };

  // =========================
  // INSERT SIGNATURE
  // =========================
  const insertSignature = () => {
    const signature = `
      <br/><br/>
      <div>
        Best Regards,<br/>
        <strong>Event Organizer</strong><br/>
        Event Management Team
      </div>
    `;

    editorRef.current!.innerHTML += signature;

    setForm({
      ...form,
      message: editorRef.current?.innerHTML || "",
    });
  };

  // =========================
  // INSERT EMOJI
  // =========================
  const insertEmoji = (emoji: string) => {
    formatText("insertText", emoji);
  };

  // =========================
  // HANDLE IMAGE INSERT
  // =========================
 const handleImageInsert = (
  e: React.ChangeEvent<HTMLInputElement>
  ) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // add image to attachments
  setAttachments((prev) => [...prev, file]);

  // show preview inside editor
  const previewURL = URL.createObjectURL(file);

  const img = `
    <img 
      src="${previewURL}" 
      style="
        max-width:250px;
        border-radius:12px;
        margin-top:10px;
      "
    />
  `;

  editorRef.current!.innerHTML += img;

  setForm({
    ...form,
    message: editorRef.current?.innerHTML || "",
  });
  };

  // =========================
  // HANDLE FILE ATTACHMENTS
  // =========================
  const handleAttachments = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    setAttachments([...attachments, ...Array.from(e.target.files)]);
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    try {

      setSending(true);
      const data = new FormData();

      data.append("event_id", form.event_id);
      data.append("subject", form.subject);
      data.append("message", form.message);
      data.append("status", form.status);

      attachments.forEach((file) => {
        data.append("attachments", file);
      });

      await api.post(
        "http://localhost:5000/api/messages/send",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Emails sent successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setForm({
        event_id: "",
        subject: "",
        message: "",
        status: "all",
      });

      setAttachments([]);

      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to send emails",
      });
    } finally {
      // 🔥 ALWAYS STOP LOADING
      setSending(false);
    }
  };

  return (
  <div className="min-h-screen space-y-6 md:space-y-8">

    {/* ================= HEADER ================= */}
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

      <div>
        <h1 className="text-2xl md:text-4xl font-black text-secondary uppercase">
  Communication Hub
        </h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">
          Connect with attendees, and teams through smart event messaging, <br /> announcements, and targeted updates.
        </p>
      </div>

    </div>

    {/* ================= MAIN CARD ================= */}
    <div className="md:p-6 max-w-5xl">

      {/* TOP OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* EVENT */}
        <div>
          <div className="flex items-center gap-2 text-secondary">
            <CalendarDays size={18} />
            <label className="text-sm font-medium">Event Name</label>
          </div>

          <select
            value={form.event_id}
            className="w-full mt-2 p-3 border text-gray-400 border-secondary rounded-xl outline-none"
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

        {/* AUDIENCE */}
        <div>
          <div className="flex items-center gap-2 text-secondary">
            <Users size={18} />
            <label className="text-sm font-medium">Audience</label>
          </div>

          <select
            value={form.status}
            className="w-full mt-2 p-3 text-gray-400 border border-secondary  rounded-xl outline-none"
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
      <div className="mt-5 md:mt-6">
        <div className="flex items-center gap-2 text-secondary">
          <Sparkles
           size={18} />
          <label className="text-sm font-medium">Subject</label>
        </div>

        <input
          value={form.subject}
          className="w-full mt-2 p-3 border border-secondary rounded-xl outline-none"
          placeholder="Enter email subject"
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value })
          }
        />
      </div>

      {/* ================= EDITOR ================= */}
      <div className="mt-6">

        <div className="flex items-center gap-2 text-secondary mb-2">
          <MessageSquare size={18} />
          <label className="text-sm font-medium">
            Message Editor
          </label>
        </div>

        {/* TOOLBAR (mobile scrollable) */}
        <div className="flex gap-2 p-3 border border-b-0 rounded-t-2xl bg-gray-50 overflow-x-auto whitespace-nowrap">

          <button onClick={() => formatText("bold")} className="toolbar-btn">
            <Bold size={18} />
          </button>

          <button onClick={() => formatText("italic")} className="toolbar-btn">
            <Italic size={18} />
          </button>

          <button onClick={() => formatText("underline")} className="toolbar-btn">
            <Underline size={18} />
          </button>

          <button onClick={insertLink} className="toolbar-btn">
            <Link size={18} />
          </button>

          <label className="toolbar-btn cursor-pointer">
            <ImagePlus size={18} />
            <input type="file" accept="image/*" hidden onChange={handleImageInsert} />
          </label>

          <label className="toolbar-btn cursor-pointer">
            <Paperclip size={18} />
            <input type="file" hidden multiple onChange={handleAttachments} />
          </label>

          <button onClick={insertSignature} className="toolbar-btn">
            <PenLine size={18} />
          </button>

          <button onClick={() => insertEmoji("😊")} className="toolbar-btn">
            <Smile size={18} />
          </button>

          <button onClick={() => insertEmoji("🎉")} className="toolbar-btn">
            🎉
          </button>

          <button onClick={() => insertEmoji("🔥")} className="toolbar-btn">
            🔥
          </button>

          <button onClick={() => insertEmoji("❤️")} className="toolbar-btn">
            ❤️
          </button>
        </div>

        {/* EDITOR */}
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[220px] md:min-h-[280px] border rounded-b-2xl p-4 outline-none bg-white text-sm md:text-base"
          onInput={() =>
            setForm({
              ...form,
              message: editorRef.current?.innerHTML || "",
            })
          }
          suppressContentEditableWarning
        />
      </div>

      {/* ================= ATTACHMENTS ================= */}
      {attachments.length > 0 && (
        <div className="mt-5">
          <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
            <Paperclip size={16} />
            Attachments
          </h3>

          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-xl text-xs md:text-sm"
              >
                {file.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SEND BUTTON ================= */}
      <button
        type="button"
        onClick={sendMessage}
        disabled={sending}
        className={`w-full mt-6 md:mt-8 py-3 rounded-2xl transition font-semibold
        flex items-center justify-center gap-3 text-base md:text-lg
        ${
          sending
            ? "bg-secondary/70 cursor-not-allowed"
            : "bg-secondary hover:opacity-90"
        } text-white`}
      >
        {sending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Sending Emails...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Email
          </>
        )}
      </button>
    </div>

    {/* ================= TOOLBAR STYLE ================= */}
    <style>{`
      .toolbar-btn{
        min-width:40px;
        height:40px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:12px;
        background:white;
        border:1px solid #e5e7eb;
        transition:0.2s;
        flex-shrink:0;
      }

      .toolbar-btn:hover{
        background:#f3f4f6;
      }
    `}</style>
  </div>
);
}