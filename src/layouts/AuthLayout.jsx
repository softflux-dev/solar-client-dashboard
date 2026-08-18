import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="bg-brand-gradient relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/5" />
      <div className="relative w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
