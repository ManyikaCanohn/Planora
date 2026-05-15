import { useAuth } from "../context/AuthContext"
import {
  FiUser,
  FiMail,
  FiShield,
  FiBell,
  FiClock,
} from "react-icons/fi"
import { useNavigate } from "react-router-dom";
  import Swal from "sweetalert2";

const Settings = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Sign out?",
      text: "You will need to login again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, sign out",
    });

    if (result.isConfirmed) {
      await logout();       // ✅ handles user clearing properly
      navigate("/login");   // ✅ redirect
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-400 font-mono">
        Loading system profile...
      </p>
    )
  }

  const initial = user?.name?.charAt(0).toUpperCase()
  console.log("USER:", user)

  const InfoCard = ({ icon, label, value }: any) => (
    <div className="rounded-xl p-4 flex items-center gap-4">
      <div className="text-xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-mono">{label}</p>
        <p className="text-sm text-white font-semibold">{value}</p>
      </div>
    </div>
  )

 return (
  <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

    {/* ================= PROFILE PANEL ================= */}
    <div className="rounded-2xl p-5 md:p-6 shadow-lg flex flex-col items-center text-center bg-dark">

      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full text-white bg-secondary flex items-center justify-center text-2xl md:text-3xl font-bold mb-4">
        {initial}
      </div>

      <h2 className="text-lg md:text-xl text-secondary font-bold truncate">
        {user?.name}
      </h2>

      <p className="text-gray-400 text-xs md:text-sm font-mono break-all text-center">
        {user?.email}
      </p>

      <div className="mt-3 md:mt-4 text-[10px] md:text-xs text-gray-500 font-mono">
        System Role: Organizer
      </div>

      <button
        onClick={handleSignOut}
        className="mt-5 md:mt-6 cursor-pointer w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition text-sm md:text-base"
      >
        Logout
      </button>

    </div>

    {/* ================= RIGHT SIDE ================= */}
    <div className="md:col-span-2 space-y-4 md:space-y-6">

      {/* ACCOUNT OVERVIEW */}
      <div className="rounded-2xl p-4 md:p-6 shadow-lg bg-white">

        <h3 className="font-mono mb-4 text-xl md:text-2xl text-secondary">
          Account Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-secondary">

          <InfoCard
            icon={<FiUser size={18} />}
            label="Full Name"
            value={<span className="font-semibold text-secondary text-sm md:text-base">{user?.name}</span>}
          />

          <InfoCard
            icon={<FiMail size={18} />}
            label="Email Address"
            value={<span className="font-semibold text-secondary text-sm md:text-base break-all">{user?.email}</span>}
          />

          <InfoCard
            icon={<FiShield size={18} />}
            label="Account Type"
            value={<span className="font-semibold text-secondary text-sm md:text-base">Organizer</span>}
          />

          <InfoCard
            icon={<FiClock size={18} />}
            label="Member Since"
            value={<span className="font-semibold text-secondary text-sm md:text-base">Recently</span>}
          />

        </div>

      </div>

      {/* ================= SYSTEM INFO ================= */}
      <div className="bg-codebolt-purple-dark rounded-2xl p-4 md:p-6 shadow-lg">

        <h3 className="text-secondary font-mono mb-3 md:mb-4 text-xl md:text-2xl">
          System Info
        </h3>

        <p className="text-gray-400 text-xs md:text-sm font-mono leading-relaxed">
          Planora Event System v1.0 <br />
          © 2026 All rights reserved.
        </p>

      </div>

    </div>

  </div>
);
}

export default Settings