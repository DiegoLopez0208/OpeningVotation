import { MdLogout } from "react-icons/md";

export default function LogOut() {
  function handleLogOut() {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  }

  return (
    <button
      className=" bg-white hover:bg-gray-100 p-3 flex flex-row justify-between border-b-2 items-center font-semibold w-full transition-all duration-200"
      onClick={handleLogOut}
    >
      <span>Cerrar sesión</span>
      <MdLogout className="text-3xl" />
    </button>
  );
}
