export default function LoadingIcon() {
  return (
    <div className="min-h-screen h-full bg-blue-50 dark:bg-gray-900 flex justify-center items-centerr">
      <div className="text-3xl flex dark:text-white justify-center items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-loader-circle animate-spin "
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="font-semibold">Cargando...</span>
      </div>
    </div>
  );
}
