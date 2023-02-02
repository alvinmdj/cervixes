import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

const Sidebar = ({ content }: { content: ReactNode }) => {
  const drawerId = "my-drawer";

  const menus = [
    {
      name: "Manage Diseases",
      to: "/dashboard/diseases",
    },
    {
      name: "Manage Symptoms",
      to: "/dashboard/symptoms",
    },
  ];

  return (
    <div className="drawer-mobile drawer">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Navbar drawerId={drawerId} />
        <div className="p-2">{content}</div>
      </div>
      <div className="drawer-side shadow">
        <label htmlFor={drawerId} className="drawer-overlay"></label>
        <ul className="menu w-80 gap-2 bg-base-100 p-4">
          <Link href="/dashboard" className="btn">
            Admin Dashboard
          </Link>
          {menus.map((menu, index) => (
            <li key={index}>
              <Link href={menu.to} className="btn-outline btn font-bold">
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
