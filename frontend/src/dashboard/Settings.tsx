import { useAuth } from "../context/AuthContext"
import {
  FiUser,
  FiMail,
  FiShield,
  FiBell,
  FiClock,
} from "react-icons/fi"

const Settings = () => {
  const { user, logout, loading } = useAuth()

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
    <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* PROFILE PANEL */}
      <div className="rounded-2xl p-6 shadow-lg flex flex-col items-center text-center bg-dark">

        <div className="w-20 h-20 rounded-full text-white bg-secondary flex items-center justify-center text-3xl font-bold mb-4">
          {initial}
        </div>

        <h2 className="text-xl font-bold">
          {user?.name}
        </h2>

        <p className="text-gray-400 text-sm font-mono">
          {user?.email}
        </p>

        <div className="mt-4 text-xs text-gray-500 font-mono">
          System Role: Organizer
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
        >
          Logout
        </button>

      </div>

      {/* RIGHT SIDE */}
      <div className="md:col-span-2 space-y-6">

        {/* ACCOUNT OVERVIEW */}
        <div className="rounded-2xl p-6 shadow-lg">
          <h3 className="text-codebolt-yellow font-mono mb-4 text-2xl text-secondary">
            Account Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-secondary">
            <InfoCard icon={<FiUser />} label="Full Name" value={user?.name} />
            <InfoCard icon={<FiMail />} label="Email Address" value={user?.email} />
            <InfoCard icon={<FiShield />} label="Account Type" value="Organizer" />
            <InfoCard icon={<FiClock />} label="Member Since" value="Recently" />
          </div>
        </div>


        {/* SYSTEM INFO */}
        <div className="bg-codebolt-purple-dark rounded-2xl p-6 shadow-lg">
          <h3 className="text-secondary font-mono mb-4 text-2xl">
            System Info
          </h3>

          <p className="text-gray-400 text-sm font-mono">
            Planora Event System v1.0 <br />
            All systems operational. No issues detected.
          </p>
        </div>

      </div>

    </div>
  )
}

export default Settings