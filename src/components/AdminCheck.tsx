import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

const AdminCheck = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      !session ||
      session.user.role === "USER"
    ) {
      setTimeout(() => {
        void router.push("/");
      }, 3000);
    }
  }, [router, session, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2">
        <p className="text-6xl font-bold">Loading...</p>
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    !session ||
    session.user.role === "USER"
  ) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2">
        <p className="text-6xl font-bold">Access denied</p>
        <p>
          Redirecting to{" "}
          <Link href="/" className="link">
            homepage
          </Link>{" "}
          in 3 seconds...
        </p>
      </div>
    );
  }

  return <div className="p-2">{children}</div>;
};

export default AdminCheck;
