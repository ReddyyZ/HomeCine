import React from "react";
import Logo from "../Logo";
import * as Icons from "react-icons/io5";
import { IconBaseProps } from "react-icons";
import "./style.css";
import { Link, useLocation } from "react-router-dom";

export type SidebarItemProps = {
  icon: string;
  label: string;
  route: string;
};

type SideBarProps = {
  items: SidebarItemProps[];
  onLogout: () => void;
};

export default function Sidebar({ items, onLogout }: SideBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  function SidebarBtn(item: SidebarItemProps, index: number) {
    const Icon = (Icons as any)[
      item.icon
    ] as React.ComponentType<IconBaseProps>;
    const color = item.route === location.pathname ? "#FFA726" : "#E0E0E0";

    return (
      <li key={index}>
        <Link
          to={item.route}
          className={
            "borderAnimation border-borderColor flex w-full cursor-pointer items-center gap-3 border-b-1 p-2"
          }
          style={{ textDecoration: "none" }}
        >
          <Icon size={24} fill={color} />
          <p style={{ color }}>{item.label}</p>
        </Link>
      </li>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <div
          id="sidebar"
          className={`bg-secondaryBg relative mr-4 flex min-h-screen w-72 flex-col px-4 py-6 text-white md:max-w-72`}
        >
          <div className="mb-12">
            <Logo size="small" />
          </div>
          <ul className="flex w-full flex-col gap-3">
            {items.map(SidebarBtn)}
          </ul>
          <button className="mt-auto flex cursor-pointer items-center gap-3 p-2 transition-opacity duration-200 hover:opacity-70">
            <Icons.IoExit size={24} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="fixed w-0 md:hidden">
        <div
          id="mobile-sidebar"
          className={`animate-sidebarClose bg-secondaryBg relative mr-4 flex min-h-screen w-72 flex-col px-4 py-6 text-white md:max-w-72`}
        >
          <div className="mb-12">
            <Logo size="small" />
          </div>
          <ul className="mb-12 flex w-full flex-col gap-3">
            {items.map(SidebarBtn)}
          </ul>
          <button
            onClick={onLogout}
            className="mt-auto flex cursor-pointer items-center gap-3 p-2 transition-opacity duration-200 hover:opacity-70"
          >
            <Icons.IoExit size={24} />
            Logout
          </button>
          <button
            className="bg-secondaryBg absolute top-0 right-0 translate-x-[100%] translate-y-8 transform cursor-pointer rounded-r-sm p-2 md:hidden"
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
                document
                  .getElementById("mobile-sidebar")
                  ?.classList.remove("animate-sidebarOpen");
                document
                  .getElementById("mobile-sidebar")
                  ?.classList.add("animate-sidebarClose");
              } else {
                setIsOpen(true);
                document
                  .getElementById("mobile-sidebar")
                  ?.classList.remove("animate-sidebarClose");
                document
                  .getElementById("mobile-sidebar")
                  ?.classList.add("animate-sidebarOpen");
              }
            }}
          >
            {!isOpen ? <Icons.IoMenu size={24} /> : <Icons.IoClose size={24} />}
          </button>
        </div>
      </div>
    </>
  );
}
