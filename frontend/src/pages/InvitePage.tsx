import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { showLoading, hideLoading } from "../utils/loader";
import api from "../api/api";

const API = "http://localhost:5000/api/invite";

export default function InvitePage() {
  const { code } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: ""
  });


    useEffect(() => {
  if (!code) return; // ✅ prevent undefined call

  axios
    .get(`${API}/${code}`)
    .then(res => setEvent(res.data))
    .catch(err => console.error(err));
}, [code]);
  // ======================
  // FETCH EVENT (FIXED LOADING)
  // ======================
  useEffect(() => {
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
  // REGISTER FUNCTION
  // ======================
  const register = async () => {
    try {
      showLoading("Submitting request...");

        await api.post("/invite/register", {
            event_id: event.id,
            ...form
            });

      hideLoading();

      Swal.fire({
        icon: "success",
        title: "Request Sent 🎉",
        text: "Waiting for admin approval",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (err) {
      hideLoading();

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not submit registration",
      });
    }
  };

  // ======================
  // UI STATE
  // ======================
  if (loading) {
    return null; // SweetAlert handles loading UI
  }

  if (!event) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">

      <div className="bg-slate-800 p-6 rounded-xl w-[400px]">

        <h1 className="text-xl font-bold">{event.title}</h1>
        <p className="text-sm text-gray-400">{event.description}</p>

        <input
          placeholder="Name"
          className="w-full mt-3 p-2 bg-slate-700 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full mt-2 p-2 bg-slate-700 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button
          onClick={register}
          className="mt-4 bg-purple-600 px-4 py-2 rounded w-full hover:bg-purple-700 transition"
        >
          Join Event
        </button>

      </div>
    </div>
  );
}