import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import Metatags from "../components/Metatags";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Metatags />
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl text-black">
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
        <AuthShowcase />
      </div>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-slate-700">
        {sessionData && (
          <span>
            Logged in as {sessionData.user?.name} ({sessionData.user.role})
          </span>
        )}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-slate-700/10 px-10 py-3 font-semibold text-slate-700 no-underline transition hover:bg-slate-700/20"
        onClick={
          sessionData
            ? () => void signOut()
            : () =>
                void signIn("google", {
                  callbackUrl: window.location.href, // current url
                })
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
