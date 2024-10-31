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
    <div className="w-full h-16 top-0 bg-gradient-to-br from-blue-500 to-blue-700 z-10">
      <div className="sm:w-2/3 mx-auto h-full bg-blue-600 shadow-lg">
        <nav className="flex justify-between items-center mx-auto align-middle h-full sm:border-l-2 border-white border-opacity-25">
          <Link href="/" className="text-3xl px-4 sm:hover:border-b-4 h-full text-white transition-all duration-50 flex items-center ">
            <IoMdHome className="" />
          </Link>
          <h1 className="text-3xl text-white">
            Hola ˆ𐃷ˆ
          </h1>
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
