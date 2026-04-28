import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiLock,
} from "react-icons/fi";
import { FaCalendarAlt, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    eventName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Valid email required";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    // if (!form.eventName.trim())
    //   newErrors.eventName = "Event name is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please fix the highlighted fields",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await registerUser({
        ...form,
        role: "admin",
        status: "approved",
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful 🎉",
        text: "Welcome to Planora",
      });

      navigate("/login");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-blue-200 px-4">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-secondary to-purple-500 text-white relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent)]"></div>

          <div className="z-10 text-center">
            <h2 className="text-6xl font-bold font-mono mb-2 uppercase">
              planora
            </h2>
            <p className="font-mono">Create your account</p>
          </div>

          <div className="flex gap-2 mt-5 font-mono">
            <p>Already have an account?</p>
            <NavLink to="/login" className="text-blue-800 underline">
              Login.
            </NavLink>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10">

          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 text-white p-4 rounded-full shadow-lg">
              <FiUser size={34} />
            </div>
          </div>

          <h2 className="text-center font-bold uppercase font-mono text-3xl text-secondary mb-6">
            Register
          </h2>

          <form onSubmit={handleRegister} className="space-y-5 font-mono">

            {/* Name */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FiUser className="text-secondary text-2xl mr-3" />
              <input
                className="w-full outline-none"
                placeholder="Full Name"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            {/* Email */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FiMail className="text-secondary text-2xl mr-3" />
              <input
                className="w-full outline-none"
                placeholder="Email"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            {/* Event Name */}
            {/* <div className="flex items-center border-b border-gray-300 py-2">
              <FaCalendarAlt className="text-secondary text-xl mr-3" />
              <input
                className="w-full outline-none"
                placeholder="Event Name"
                onChange={(e) =>
                  setForm({ ...form, eventName: e.target.value })
                }
              />
            </div>
            {errors.eventName && (
              <p className="text-red-500 text-sm">{errors.eventName}</p>
            )} */}

            {/* Password */}
            <div className="flex items-center border-b border-gray-300 py-2 relative">
              <FiLock className="text-secondary text-2xl mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full outline-none"
                placeholder="Password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            {/* BUTTON */}
            <button
              disabled={loading}
              className={`w-full p-2 rounded text-white flex justify-center items-center gap-2 ${
                loading
                  ? "bg-gray-400"
                  : "bg-secondary hover:scale-105 transition"
              }`}
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}