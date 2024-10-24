"use client";

import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative mb-4">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
        placeholder="Ingresa tu contraseña"
        required
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-3 text-gray-700 hover:text-blue-600"
      >
        {showPassword ? <HiEyeOff /> : <HiEye />}
      </button>
    </div>
  );
};

export default PasswordInput;
