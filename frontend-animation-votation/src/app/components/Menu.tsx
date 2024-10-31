// Menu.tsx
import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";

interface MenuProps {
  children: React.ReactNode; // Acepta cualquier contenido como hijos
}

const Menu: React.FC<MenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-full w-fill sm:border-r-2 border-white border-opacity-25">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-3xl text-white hover:border-b-4 hover:bg-blue-500 h-full px-4 transition-all duration-50 "
      >
        <IoMdSettings className={`w-full transition-all duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute right-0 sm:w-96 w-screen bg-white shadow-lg rounded transition-all duration-300 ease-in-out ea transform ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2" // Mueve hacia arriba cuando se cierra
        }`}
        style={{
          visibility: isOpen ? "visible" : "hidden", // Controla la visibilidad
          pointerEvents: isOpen ? "auto" : "none", // Desactiva eventos cuando está cerrado
        }}
      >
        <ul className="">{children}</ul>
      </div>
    </div>
  );
};

export default Menu;
