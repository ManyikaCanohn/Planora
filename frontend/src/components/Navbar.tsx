import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <div className="w-full bg-slate-900 text-white px-4 py-3 flex items-center justify-between md:hidden">
      
      <h1 className="font-bold text-purple-400">Planora</h1>

      <button onClick={onMenuClick}>
        <FaBars size={20} />
      </button>

    </div>
  );
}