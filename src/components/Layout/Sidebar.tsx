import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useRef } from "react";
import Navbar from "./Navbar";

const Sidebar = ({ content }: { content: ReactNode }) => {
  const router = useRouter();

  const toggleRef = useRef<HTMLInputElement>(null);

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
    {
      name: "Manage Factors",
      to: "/dashboard/factors",
    },
  ];

  function handleClick() {
    if (toggleRef.current) {
      toggleRef.current.checked = false;
    }
  }

  return (
    <div className="drawer-mobile drawer">
      <input
        id={drawerId}
        type="checkbox"
        className="drawer-toggle"
        ref={toggleRef}
      />
      <div className="drawer-content flex flex-col lg:relative lg:!z-20">
        <Navbar drawerId={drawerId} />
        <div>{content}</div>
      </div>
      <div className="drawer-side shadow lg:relative lg:!z-10">
        <label htmlFor={drawerId} className="drawer-overlay"></label>
        <ul className="menu w-80 gap-2 bg-base-100 p-4">
          <Link
            href="/dashboard"
            onClick={handleClick}
            className="btn-ghost btn text-xl normal-case"
          >
            Admin Dashboard
          </Link>
          {menus.map((menu, index) => (
            <li key={index}>
              <Link
                href={menu.to}
                onClick={handleClick}
                className={clsx(
                  "btn-outline btn font-bold",
                  router.pathname.startsWith(menu.to) && "btn-active"
                )}
              >
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
