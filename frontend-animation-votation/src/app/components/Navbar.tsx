"use client";

import { IoMdHome } from "react-icons/io";
import { useSettings } from "../context/SettingsContext";

export default function Navbar() {
  const { mode } = useSettings();

  return (
    <div className="w-full h-20 sticky top-0 bg-green-800 ">
        <div className="container mx-auto px-4 h-full">
            <nav className="w-1/2 flex justify-between items-center mx-auto align-middle">
            <button className="text-3xl bg-blue-600 hover:bg-blue-800 text-white mb-4 sm:mr-4 px-4 py-2 sm:rounded-lg transition duration-200 shadow-lg">
                <IoMdHome className="" />
            </button>
            <h1>Home</h1>
            <h1>Menu desplegable</h1>
            {mode}
            </nav>
        </div>
    </div>
  );
}
