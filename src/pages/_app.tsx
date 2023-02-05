import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";

import { api } from "utils/api";

import MainLayout from "components/Layout/MainLayout";
import "styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextNProgress />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
