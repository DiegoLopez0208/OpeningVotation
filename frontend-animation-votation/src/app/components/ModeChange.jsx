import { useMode } from "../context/ModeContext";

export default function ModeChange({ reload }) {
  const { mode, setModeDirectly } = useMode();

  function handleModeChange(mode) {
    setModeDirectly(mode)
    if (reload) {
        window.location.reload();
    }
  }

  return (
    <div className="flex justify-between items-center mb-2 font-semibold">
      <span>Modo de visualizacion: </span>
      <div className="ml-2 flex gap-2">
        <button className={`rounded-md px-3 py-1 transition-all duration-200 hover:bg-blue-500 hover:text-white ${mode === "normal" ? "bg-blue-500 text-white" : ""}`}
         onClick={() => handleModeChange("normal")}>Normal</button>
        <button className={`rounded-md px-3 py-1 transition-all duration-200 hover:bg-red-500 hover:text-white ${mode === "rapido" ? "bg-red-500 text-white" : ""}`}
        onClick={() => handleModeChange("rapido")}>Rápido</button>
      </div>
    </div>
  );
}
