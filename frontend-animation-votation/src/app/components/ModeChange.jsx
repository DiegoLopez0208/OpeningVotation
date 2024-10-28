import { useMode } from "../context/ModeContext";

export default function ModeChange({ reload }) {
  const { mode, setModeDirectly } = useMode();

  function handleModeChange(mode) {
    setModeDirectly(mode);
    if (reload) {
      window.location.reload();
    }
  }

  return (
    <div className=" bg-white p-3 sm:rounded-lg shadow-md flex justify-between items-center mb-4 font-semibold w-full">
      <span>Modo de ver: </span>
      <div className="ml-2 flex gap-2">
        <button
          className={`rounded-md px-3 py-1 transition-all duration-200 hover:bg-green-500 hover:text-white ${
            mode === "normal" ? "bg-green-500 text-white" : ""
          }`}
          onClick={() => handleModeChange("normal")}
        >
          Normal
        </button>
        <button
          className={`rounded-md px-3 py-1 transition-all duration-200 hover:bg-red-600 hover:text-white ${
            mode === "rapido" ? "bg-red-600 text-white" : ""
          }`}
          onClick={() => handleModeChange("rapido")}
        >
          Rápido
        </button>
      </div>
    </div>
  );
}
