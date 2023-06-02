import AdminCheck from "components/AdminCheck";
import Metatags from "components/Metatags";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "utils/api";

const Dashboard = () => {
  const { data: session } = useSession();

  const { data } = api.dashboards.count.useQuery();

  console.log(data);

  return (
    <>
      <Metatags title="Cervixes - Admin dashboard" />
      <AdminCheck>
        <h2 className="mb-5 text-2xl font-bold sm:text-4xl">
          Selamat datang, {session?.user.name}!
        </h2>
        {data && (
          <div className="flex flex-col flex-wrap items-center gap-2 sm:flex-row sm:items-start">
            <Link href="/dashboard/diseases">
              <div className="stats mb-3 w-[275px] justify-center border-4 border-zinc-200 text-center font-bold shadow transition hover:bg-zinc-200">
                <div className="stat">
                  <div className="stat-title">Total Penyakit Ditambahkan</div>
                  <div className="stat-value text-primary">
                    {data?.diseasesCount}
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/symptoms">
              <div className="stats mb-3 w-[275px] justify-center border-4 border-zinc-200 text-center font-bold shadow transition hover:bg-zinc-200">
                <div className="stat">
                  <div className="stat-title">Total Gejala Ditambahkan</div>
                  <div className="stat-value text-blue-900 dark:text-blue-300">
                    {data?.symptomsCount}
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/factors">
              <div className="stats mb-3 w-[275px] justify-center border-4 border-zinc-200 text-center font-bold shadow transition hover:bg-zinc-200">
                <div className="stat">
                  <div className="stat-title">Total Faktor Ditambahkan</div>
                  <div className="stat-value text-sky-700 dark:text-sky-300">
                    {data?.factorsCount}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </AdminCheck>
    </>
  );
};

export default Dashboard;
