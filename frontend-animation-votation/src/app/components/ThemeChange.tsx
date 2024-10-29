import { MdOutlineContrast } from "react-icons/md";

export default function ThemeChange() {
  return (
    <div className=" bg-white p-3 sm:rounded-t-lg flex flex-row justify-between items-center font-semibold w-full border-b-2">
      <span>Tema: claro oscuro</span>
      <MdOutlineContrast className="text-3xl"/>
    </div>
  );
}
