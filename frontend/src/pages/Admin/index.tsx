import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItemProps } from "../../components/Sidebar";

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

  return (
    <div className="flex min-h-screen overflow-hidden md:max-h-screen">
      <Sidebar items={sideBarLinks} onLogout={() => {}} />
      <div className="scrollbar scrollbar-thumb-[#3A3A3A] scrollbar-track-[#1E1E1E] flex w-full flex-col gap-4 p-8 md:overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
