import { useState } from "react";
import api from "../api/api";
import MapView from "./MapView";
import Swal from "sweetalert2";
import {
  FaHeading,
  FaAlignLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";

export default function EventModal({ event, onClose, refresh }: any) {

  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    event_type: event?.event_type || "virtual",
    status: event?.status || "draft",
    location_name: event?.location_name || "",
    latitude: event?.latitude || "",
    longitude: event?.longitude || "",
    start_date: event?.start_date || "",
    end_date: event?.end_date || "",
  });

  const [location, setLocation] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});

  // 🔍 VALIDATION
  const validate = () => {
    let newErrors: any = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";

    if (!form.start_date) newErrors.start_date = "Start date required";
    if (!form.end_date) newErrors.end_date = "End date required";

    if (
      form.start_date &&
      form.end_date &&
      new Date(form.end_date) <= new Date(form.start_date)
    ) {
      newErrors.end_date = "End date must be after start date";
    }

    if (form.event_type !== "virtual") {
      if (!form.location_name.trim())
        newErrors.location_name = "Location is required";

      if (!location && (!form.latitude || !form.longitude)) {
        newErrors.location = "Please pick a location on the map";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Event",
        text: "Please fix the highlighted fields",
      });
      return false;
    }

    return true;
  };

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      latitude: location?.lat || form.latitude,
      longitude: location?.lng || form.longitude,
    };

    try {
      if (!event) {
        await api.post("/events", payload);
      } else {
        await api.put(`/events/${event.id}`, payload);
      }

      Swal.fire({
        icon: "success",
        title: "Event Saved 🎉",
        timer: 1500,
        showConfirmButton: false,
      });

      refresh();
      onClose();
    } catch (err) {
      console.error("EVENT SAVE ERROR:", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Something went wrong",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">

      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-dark text-secondary p-5">
          <h2 className="text-2xl font-bold font-mono">
            {event ? "Edit Event" : "Create Event"}
          </h2>
          <p className="text-sm opacity-80 text-gray-400">
            Fill in the details below
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 font-mono text-dark max-h-[75vh] overflow-y-auto">

          {/* TITLE */}
          <div>
            <label className="flex items-center gap-2 text-sm  mb-1">
              <FaHeading /> Event Name
            </label>
            <input
              className={`w-full border border-2 rounded  p-2 outline-none ${
                errors.title ? "border-red-500" : "border-dark"
              }`}
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="flex items-center gap-2 text-sm mb-1">
              <FaAlignLeft /> Description
            </label>
            <textarea
              className={`w-full border border-2 rounded p-2 outline-none ${
                errors.description ? "border-red-500" : "border-dark"
              }`}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm mb-1">
                <FaCalendarAlt /> Start Time/ Date
              </label>
              <input
                type="datetime-local"
                className={`w-full border border border-2 rounded p-2 outline-none ${
                  errors.start_date ? "border-red-500" : "border-dark"
                }`}
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm">{errors.start_date}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm mb-1">
                <FaCalendarAlt /> End Time/ Date
              </label>
              <input
                type="datetime-local"
                className={`w-full border border border-2 rounded p-2 outline-none ${
                  errors.end_date ? "border-red-500" : "border-dark"
                }`}
                value={form.end_date}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value })
                }
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* TYPE + STATUS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm mb-1">
                <FaTag /> Type
              </label>
              <select
                className="w-full border border border-2 rounded p-2 outline-none"
                value={form.event_type}
                onChange={(e) =>
                  setForm({ ...form, event_type: e.target.value })
                }
              >
                <option value="virtual">Virtual</option>
                <option value="physical">Physical</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="text-sm mb-1 block">Status</label>
              <select
                className="w-full border border border-2 rounded p-2 outline-none"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* LOCATION */}
          {form.event_type !== "virtual" && (
            <div>
              <label className="flex items-center gap-2 text-sm mb-2">
                <FaMapMarkerAlt /> Location
              </label>

              <input
                placeholder="Search place..."
                className={`w-full border-b p-2 mb-2 outline-none ${
                  errors.location_name ? "border-red-500" : "border-gray-300"
                }`}
                value={form.location_name}
                onChange={(e) =>
                  setForm({ ...form, location_name: e.target.value })
                }
              />

              <MapView setLocation={setLocation} />

              {(errors.location_name || errors.location) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location_name || errors.location}
                </p>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-dark cursor-pointer 
            text-white px-5 py-2 rounded-lg hover:scale-105 transition"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}