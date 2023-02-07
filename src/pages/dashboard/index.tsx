import AdminCheck from "components/AdminCheck";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "utils/api";

const Dashboard = () => {
  const { data: session } = useSession();

  const { data } = api.dashboards.count.useQuery();

  console.log(data);

  return (
    <AdminCheck>
      <h2 className="mb-5 text-2xl font-bold sm:text-4xl">
        Welcome back, {session?.user.name}!
      </h2>
      {data && (
        <div className="flex flex-col flex-wrap items-center gap-2 sm:flex-row sm:items-start">
          <Link href="/dashboard/diseases">
            <div className="stats mb-3 w-[250px] justify-center border-4 border-zinc-200 text-center font-bold shadow transition hover:bg-zinc-200">
              <div className="stat">
                <div className="stat-title">Total Diseases Added</div>
                <div className="stat-value text-primary">
                  {data?.diseasesCount}
                </div>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/symptoms">
            <div className="stats mb-3 w-[250px] justify-center border-4 border-zinc-200 text-center font-bold shadow transition hover:bg-zinc-200">
              <div className="stat">
                <div className="stat-title">Total Symptoms Added</div>
                <div className="stat-value text-blue-900 dark:text-blue-300">
                  {data?.symptomsCount}
                </div>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/factors">
            <div className="stats mb-3 w-[250px] justify-center border-4 border-zinc-200 text-center font-bold shadow transition hover:bg-zinc-200">
              <div className="stat">
                <div className="stat-title">Total Factors Added</div>
                <div className="stat-value text-sky-700 dark:text-sky-300">
                  {data?.factorsCount}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </AdminCheck>
  );
};

export default Dashboard;
