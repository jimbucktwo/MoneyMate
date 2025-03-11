import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}