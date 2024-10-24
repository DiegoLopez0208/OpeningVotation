export default function Leaderboard() {
  return (
    <div className="container mx-auto p-6 bg-gray-200 min-h-screen">
      <input
        type="text"
        placeholder="Buscar anime..."
        className="mb-6 w-full rounded-xl border border-gray-300 p-3 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
      />

      <table className="w-full table-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <tr>
            <th className="px-6 py-4 text-left">Posición</th>
            <th className="px-6 py-4 text-left">Nombre del Anime</th> 
            <th className="px-6 py-4 text-left">Enlace/Video</th>
            <th className="px-6 py-4 text-left">Puntuación</th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-all duration-200">
            <td className="border-t px-6 py-4 font-semibold text-gray-800">
              1
            </td>
            <td className="border-t px-6 py-4">Naruto</td>
            <td className="border-t px-6 py-4">
              <a
                href="#"
                className="text-blue-500 hover:underline hover:text-blue-700 transition-all duration-200"
              >
                Ver Video
              </a>
            </td>
            <td className="border-t px-6 py-4">
              <span className="text-white bg-green-500 px-3 py-1 rounded-full">
                9.0
              </span>
            </td>
          </tr>
          <tr className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-all duration-200">
            <td className="border-t px-6 py-4 font-semibold text-gray-800">
              2
            </td>
            <td className="border-t px-6 py-4">One Piece</td>
            <td className="border-t px-6 py-4">
              <a
                href="#"
                className="text-blue-500 hover:underline hover:text-blue-700 transition-all duration-200"
              >
                Ver Video
              </a>
            </td>
            <td className="border-t px-6 py-4">
              <span className="text-white bg-yellow-500 px-3 py-1 rounded-full">
                8.7
              </span>
            </td>
          </tr>
          <tr className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-all duration-200">
            <td className="border-t px-6 py-4 font-semibold text-gray-800">
              3
            </td>
            <td className="border-t px-6 py-4">Attack on Titan</td>
            <td className="border-t px-6 py-4">
              <a
                href="#"
                className="text-blue-500 hover:underline hover:text-blue-700 transition-all duration-200"
              >
                Ver Video
              </a>
            </td>
            <td className="border-t px-6 py-4">
              <span className="text-white bg-yellow-500 px-3 py-1 rounded-full">
                8.5
              </span>
            </td>
          </tr>
          <tr className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-all duration-200">
            <td className="border-t px-6 py-4 font-semibold text-gray-800">
              4
            </td>
            <td className="border-t px-6 py-4">Demon Slayer</td>
            <td className="border-t px-6 py-4">
              <a
                href="#"
                className="text-blue-500 hover:underline hover:text-blue-700 transition-all duration-200"
              >
                Ver Video
              </a>
            </td>
            <td className="border-t px-6 py-4">
              <span className="text-white bg-yellow-600 px-3 py-1 rounded-full">
                8.3
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 flex justify-center space-x-2">
        <button className="rounded-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 transition-all duration-200">
          &laquo;
        </button>
        <button className="rounded-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 transition-all duration-200">
          1
        </button>
        <button className="rounded-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 transition-all duration-200">
          2
        </button>
        <button className="rounded-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 transition-all duration-200">
          3
        </button>
        <span className="px-4 py-2 text-gray-600">...</span>
        <button className="rounded-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 transition-all duration-200">
          80
        </button>
        <button className="rounded-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 transition-all duration-200">
          &raquo;
        </button>
      </div>
    </div>
  );
}
