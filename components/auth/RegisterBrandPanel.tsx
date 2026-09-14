export default function RegisterBrandPanel() {
  return (
    <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-[#0A1B3D] px-12 py-20 lg:flex">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          BRS Admin
        </h1>

        <h2 className="mt-6 text-2xl font-semibold text-blue-400">
          One workspace. Better performance.
        </h2>

        <p className="mt-6 text-base leading-7 text-slate-300">
          Manage tasks, monitor team progress, and keep your organization
          moving forward with a simple, centralized workflow management
          system.
        </p>

        <p className="mt-8 text-sm font-medium tracking-wide text-slate-400">
          Plan smarter. Work efficiently. Deliver on time.
        </p>
      </div>
    </div>
  );
}