// Menu.tsx
import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";

interface MenuProps {
  children: React.ReactNode; // Acepta cualquier contenido como hijos
}

const Menu: React.FC<MenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-3xl text-white bg-cyan-600 hover:bg-blue-800 h-full px-4 transition duration-200"
      >
        <IoMenu />
      </button>
      <div
        className={`absolute right-0 w-96 bg-white shadow-lg rounded transition-all duration-300 ease-in-out transform ${
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
