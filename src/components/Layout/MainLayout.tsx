import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  // Unauthenticated | User
  if (!session || session.user.role === "USER") {
    return (
      <>
        <Navbar />
        <div className="bg-green-100">{children}</div>
      </>
    );
  }

  // Owner | Admin
  return (
    <>
      <Sidebar content={children} />
    </>
  );
};

export default MainLayout;
