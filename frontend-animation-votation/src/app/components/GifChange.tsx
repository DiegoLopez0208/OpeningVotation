import { useSettings } from "@/app/context/SettingsContext";

export default function GifChange() {
  const { gifsEnabled, setGifsEnabled } = useSettings();

  function handleModeChange(mode: boolean) {
    setGifsEnabled(mode);
  }

  return (
    <div className=" bg-white hover:bg-gray-100 p-3 flex justify-between items-center font-semibold w-full border-b-2 transition-all duration-200">
      <span>Mostrar gifs: </span>
      <div className="flex gap-2">
        <button
          className={`rounded-md px-3 py-1 transition-all duration-200 hover:bg-green-500 hover:text-white border-2 hover:border-green-500 ${
            gifsEnabled === true ? "bg-green-500 border-green-500 text-white" : ""
          }`}
          onClick={() => handleModeChange(true)}
        >
          Si
        </button>
        <button
          className={`rounded-md px-2 py-1 transition-all duration-200 hover:bg-red-600 hover:text-white border-2 hover:border-red-600 ${
            gifsEnabled === false ? "bg-red-600 border-red-600 text-white" : ""
          }`}
          onClick={() => handleModeChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}
