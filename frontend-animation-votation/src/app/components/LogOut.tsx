import { MdLogout } from "react-icons/md";

export default function LogOut() {
  return (
    <div className=" bg-white p-3 flex flex-row justify-between border-b-2 items-center font-semibold w-full">
      <span>Cerrar sesion</span>
      <MdLogout className="text-3xl"/>
    </div>
  );
}
