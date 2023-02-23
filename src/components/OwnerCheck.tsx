import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

const OwnerCheck = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || session?.user.role !== "OWNER") {
      setTimeout(() => {
        void router.push("/");
      }, 3000);
    }
  }, [router, session, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2">
        <p className="text-center text-5xl font-bold">Memuat...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user.role !== "OWNER") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-5xl font-bold">Tidak dapat mengakses halaman ini</p>
        <p>
          Mengalihkan ke{" "}
          <Link href="/" className="link">
            halaman utama
          </Link>{" "}
          dalam 3 detik...
        </p>
      </div>
    );
  }

  return <div className="p-2">{children}</div>;
};

export default OwnerCheck;
