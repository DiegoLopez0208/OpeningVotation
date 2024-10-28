import { useSettings } from "@/app/context/SettingsContext";

export default function GifChange() {
  const { gifsEnabled, setGifsEnabled } = useSettings();

  function handleModeChange(mode: boolean) {
    setGifsEnabled(mode);
  }

  return (
    <div className=" bg-white p-3 flex justify-between items-center font-semibold w-full border-b-2">
      <span>Mostrar gifs: </span>
      <div className="flex gap-2">
        <button
          className={`rounded-md px-3 py-1 transition-all duration-200 hover:bg-green-500 hover:text-white ${
            gifsEnabled === true ? "bg-green-500 text-white" : ""
          }`}
          onClick={() => handleModeChange(true)}
        >
          Si
        </button>
        <button
          className={`rounded-md px-3 py-1 transition-all duration-200 hover:bg-red-600 hover:text-white ${
            gifsEnabled === false ? "bg-red-600 text-white" : ""
          }`}
          onClick={() => handleModeChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}
