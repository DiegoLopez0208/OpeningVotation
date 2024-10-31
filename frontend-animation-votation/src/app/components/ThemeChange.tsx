import { MdOutlineContrast } from "react-icons/md";

export default function ThemeChange() {
  return (
    <div className=" bg-white hover:bg-gray-100 p-3 sm:rounded-t-lg flex flex-row justify-between items-center font-semibold w-full border-b-2 transition-all duration-200">
      <span>Tema: claro oscuro</span>
      <MdOutlineContrast className="text-3xl"/>
    </div>
  );
}
