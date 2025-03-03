import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItemProps } from "../../components/Sidebar";
import { useAuth } from "../../contexts/AuthProvider";

export default function Admin() {
  const sideBarLinks: SidebarItemProps[] = [
    {
      icon: "IoHome",
      label: "Home",
      route: "/admin",
    },
    {
      icon: "IoVideocam",
      label: "Movies",
      route: "/admin/movies",
    },
  ];
  const auth = useAuth();

  return (
    <div className="flex min-h-screen overflow-hidden md:max-h-screen">
      <Sidebar items={sideBarLinks} onLogout={auth.logoutAdmin} />
      <div className="scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-600 flex w-full flex-col gap-4 p-8 md:overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
