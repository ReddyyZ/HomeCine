import Header from "../../../components/Header";
import Sidebar, { SidebarItemProps } from "../../../components/Sidebar";

export default function AdminHome() {
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
      <div className="flex w-full flex-col gap-4 p-8 md:overflow-y-auto">
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>

        <div>
          <h2 className="mb-4 text-xl font-bold">Movies</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-secondaryBg rounded-md p-4 shadow-md">
              <h3 className="text-lg font-bold">Number of movies</h3>
              <p className="text-gray-500">10</p>
            </div>
            <div className="bg-secondaryBg rounded-md p-4 shadow-md">
              <h3 className="text-lg font-bold">Number of series</h3>
              <p className="text-gray-500">10</p>
            </div>
            <div className="bg-secondaryBg rounded-md p-4 shadow-md">
              <h3 className="text-lg font-bold">Total of uploaded videos</h3>
              <p className="text-gray-500">20</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">Users</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-secondaryBg rounded-md p-4 shadow-md">
              <h3 className="text-lg font-bold">Registed users</h3>
              <p className="text-gray-500">10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
