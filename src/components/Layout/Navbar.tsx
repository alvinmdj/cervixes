import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

const Navbar = ({ drawerId }: { drawerId?: string }) => {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    toast.loading("Redirecting...");
    void signIn("google", {
      callbackUrl: window.location.href, // current url
    });
  };

  const handleSignOut = () => {
    toast.loading("Signing out...");
    void signOut();
  };

  return (
    <div className="navbar bg-base-100 shadow">
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
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Cervixes
        </Link>
      </div>
      <div className="flex-none gap-2">
        {status === "loading" && (
          <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />
        )}
        {status === "unauthenticated" && (
          <button className="btn-sm btn" onClick={handleSignIn}>
            Sign in
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
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <span onClick={handleSignOut}>Sign out</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
