import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

const Navbar = ({ drawerId }: { drawerId?: string }) => {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    toast.loading("Redirecting...", { duration: 3000 });
    void signIn("google", {
      callbackUrl: window.location.href, // current url
    });
  };

  const handleSignOut = () => {
    toast.loading("Signing out...", { duration: 3000 });
    void signOut({ callbackUrl: "/" });
  };

  return (
    <div className="navbar bg-green-100 shadow">
      {drawerId && (
        <div className="flex-none lg:hidden">
          <label htmlFor={drawerId} className="btn-ghost btn-square btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
      )}
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl font-extrabold">
          CERVIXES
        </Link>
      </div>
      <div className="flex-none gap-2">
        {status === "loading" && (
          <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />
        )}
        {status === "unauthenticated" && (
          <button
            className="btn-ghost btn-sm btn gap-2 border-slate-400"
            onClick={handleSignIn}
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <span>Sign in</span>
          </button>
        )}
        {status === "authenticated" && (
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="w-10 rounded-full border">
                <Image
                  src={session.user.image || "/profile.jpg"}
                  alt="Profile Image"
                  width={40}
                  height={40}
                />
              </div>
            </label>
            <div
              tabIndex={0}
              className="card dropdown-content card-compact w-64 bg-base-100 shadow"
            >
              <div className="card-body">
                <h3 className="text-center font-bold">
                  Selamat datang, {session.user.name?.split(" ")[0]}!
                </h3>
                <div className="flex flex-col gap-2">
                  <span
                    className="cursor-pointer rounded-lg p-2 transition hover:bg-base-200 active:bg-base-300"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
