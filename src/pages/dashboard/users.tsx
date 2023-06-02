import Metatags from "components/Metatags";
import OwnerCheck from "components/OwnerCheck";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { api } from "utils/api";

const Factors = () => {
  const utils = api.useContext();

  const { data, isLoading } = api.users.list.useQuery();

  const promote = api.users.promote.useMutation({
    onError: () => {
      toast.error("Terjadi kesalahan pada server, coba lagi nanti...");
    },
    onSuccess: () => {
      toast.success("Berhasil mempromosikan pengguna!");

      // invalidate user list cache
      void utils.users.list.invalidate();
    },
  });

  const demote = api.users.demote.useMutation({
    onError: () => {
      toast.error("Terjadi kesalahan pada server, coba lagi nanti...");
    },
    onSuccess: () => {
      toast.success("Berhasil menurunkan pengguna!");

      // invalidate user list cache
      void utils.users.list.invalidate();
    },
  });

  return (
    <>
      <Metatags title="Cervixes - Manage user roles" />
      <OwnerCheck>
        <h1 className="mb-2 text-xl font-bold">Kelola Pengguna</h1>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Posisi</th>
                <th>Kelola</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="text-center">
                    Memuat data...
                  </td>
                </tr>
              )}
              {data?.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">
                    Belum ada data...
                  </td>
                </tr>
              )}
              {data &&
                data.map((user, index) => (
                  <tr key={user.id}>
                    <th>{index + 1}</th>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        <Image
                          src={user.image || "/profile.jpg"}
                          width={40}
                          height={40}
                          alt={`${user.name as string}'s profile image`}
                        />
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role === "USER" && (
                        <button
                          className="btn-success btn"
                          onClick={() => promote.mutate({ userId: user.id })}
                        >
                          Tingkatkan menjadi Admin
                        </button>
                      )}
                      {user.role === "ADMIN" && (
                        <button
                          className="btn-error btn"
                          onClick={() => demote.mutate({ userId: user.id })}
                        >
                          Turunkan menjadi User
                        </button>
                      )}
                      {user.role === "OWNER" && <p>Tidak tersedia.</p>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </OwnerCheck>
    </>
  );
};

export default Factors;
