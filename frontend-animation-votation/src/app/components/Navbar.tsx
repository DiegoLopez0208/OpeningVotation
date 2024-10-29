"use client";

import { IoMdHome } from "react-icons/io";
import Link from "next/link";
import Menu from "./Menu";
import ModeChange from "./ModeChange";
import GifChange from "./GifChange";
import LogOut from "./LogOut";
import ThemeChange from "./ThemeChange";

export default function Navbar( ) {
  return (
    <div className="w-full h-16 top-0 bg-gray-200 z-10">
      <div className="mx-auto h-full">
        <nav className="flex sm:just justify-between items-center mx-auto align-middle h-full bg-blue-600 shadow-lg">
          <Link href="/" className="text-3xl px-4 bg-cyan-600 hover:bg-blue-800 h-full text-white transition duration-200 shadow-lg flex items-center">
            <IoMdHome className="" />
          </Link>
          <Menu>
            <ModeChange reload={false} />
            <GifChange />
            <ThemeChange />
            <LogOut />
          </Menu>
        </nav>
      </div>
    </div>
  );
}
