import Metatags from "components/Metatags";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { toast } from "react-hot-toast";

const Home: NextPage = () => {
  return (
    <>
      <Metatags />
      <div className="hero min-h-[calc(100vh-4rem)] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn-primary btn">Get Started</button>
          </div>
        </div>
      </div>
      <div className="m-2 flex flex-col items-center gap-2">
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />
        <AuthShowcase />
      </div>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-slate-700">
        {sessionData && (
          <span>
            Logged in as {sessionData.user?.name} ({sessionData.user.role})
          </span>
        )}
      </p>
      <button
        className="rounded-full bg-slate-700/10 px-10 py-3 font-semibold text-slate-700 no-underline transition hover:bg-slate-700/20"
        onClick={
          sessionData
            ? () => {
                toast.loading("Signing out...");
                void signOut();
              }
            : () => {
                toast.loading("Redirecting...");
                void signIn("google", {
                  callbackUrl: window.location.href, // current url
                });
              }
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
