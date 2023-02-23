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
    <div className="hero min-h-[calc(100vh-4rem)]">
      <div className="hero-content w-full flex-col justify-around text-center lg:flex-row-reverse lg:text-left">
        <Image
          src="/hero-illus.jpg"
          width={500}
          height={300}
          alt="hero illustration"
          className="rounded-3xl"
        />
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold">CERVIXES</h1>
          <p className="py-6">
            Sistem Pakar untuk Diagnosis Penyakit Kanker Serviks Menggunakan
            Metode Dempster-Shafer
          </p>
          <Link href="/diagnose" className="btn-primary btn">
            Coba Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};
