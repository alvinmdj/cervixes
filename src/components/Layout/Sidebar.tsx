import type { ReactNode } from "react";
import Navbar from "./Navbar";

const Sidebar = ({ content }: { content: ReactNode }) => {
  const drawerId = "my-drawer";
  return (
    <div className="drawer">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Navbar drawerId={drawerId} />
        {content}
      </div>
      <div className="drawer-side">
        <label htmlFor={drawerId} className="drawer-overlay"></label>
        <ul className="menu w-80 bg-base-100 p-4">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
