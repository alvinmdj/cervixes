import Metatags from "components/Metatags";
import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Metatags />
      <div className="hero min-h-[calc(100vh-4rem)] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Cervixes</h1>
            <p className="py-6">
              Take Control of Your Health with <strong>Cervixes</strong> - The
              User-Friendly Expert System for Cervical Cancer Detection.
            </p>
            <Link href="/diagnose" className="btn-primary btn">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
