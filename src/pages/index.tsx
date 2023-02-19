import Metatags from "components/Metatags";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Metatags />
      <Hero />
    </>
  );
};

export default Home;

const Hero = () => {
  return (
    <div className="hero min-h-[calc(100vh-4rem)] bg-gradient-to-r from-indigo-300 to-blue-200">
      <div className="hero-content w-full flex-col justify-around text-center lg:flex-row-reverse lg:text-left">
        <Image
          src="/hero-illus.jpg"
          width={500}
          height={500}
          alt="hero illustration"
          className="rounded-3xl shadow-xl"
        />
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
  );
};
