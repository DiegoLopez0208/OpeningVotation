import { useSettings } from "@/app/context/SettingsContext";

interface Props {
  reload: boolean;
}

export default function ModeChange({ reload }: Props) {
  const { mode, setMode } = useSettings();

  function handleModeChange(mode: string) {
    setMode(mode);
    if (reload) {
      window.location.reload();
    }
  }

  return (
    <div className=" bg-white hover:bg-gray-100 p-3 sm:rounded-t-lg flex justify-between items-center font-semibold w-full border-b-2 transition-all duration-200">
      <span>Modo de ver: </span>
      <div className="flex gap-2">
        <button
          className={`rounded-md px-3 py-1 transition-all border-2 hover:border-green-500 duration-200 hover:bg-green-500 hover:text-white ${
            mode === "normal" ? "bg-green-500 border-green-500 text-white" : ""
          }`}
          onClick={() => handleModeChange("normal")}
        >
          Normal
        </button>
        <button
          className={`rounded-md px-3 py-1 transition-all border-2 hover:border-red-600 duration-200 hover:bg-red-600 hover:text-white ${
            mode === "rapido" ? "bg-red-600 border-red-600 text-white" : ""
          }`}
          onClick={() => handleModeChange("rapido")}
        >
          Rápido
        </button>
      </div>
    </div>
  );
}
