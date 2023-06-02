import AdminCheck from "components/AdminCheck";
import Metatags from "components/Metatags";
import ModalAddFactor from "components/Modal/ModalAddFactor";
import ModalDeleteConfirmation from "components/Modal/ModalDeleteConfirmation";
import ModalEditFactor from "components/Modal/ModalEditFactor";
import { useEffect, useId, useState } from "react";
import { toast } from "react-hot-toast";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";

export type DiseasesOption = {
  label: string;
  value: string;
};

type FactorType = RouterOutputs["factors"]["list"][number];

const Factors = () => {
  const addModalId = useId();
  const editModalId = useId();
  const deleteConfirmationModalId = useId();

  const [diseasesOption, setDiseasesOption] = useState<
    DiseasesOption[] | undefined
  >();

  const [selectedFactor, setSelectedFactor] = useState<FactorType>();

  const handleActionClick = (clickedFactor: FactorType) => {
    setSelectedFactor(clickedFactor);
  };

  const utils = api.useContext();

  const { mutate } = api.factors.delete.useMutation({
    onError: () => {
      toast.error("Terjadi kesalahan pada server, coba lagi nanti...");
    },
    onSuccess: () => {
      toast.success("Berhasil dihapus!");

      // invalidate symptom list cache
      void utils.factors.list.invalidate();
    },
  });

  const { data: diseasesData } = api.diseases.list.useQuery();

  useEffect(() => {
    if (diseasesData) {
      if (diseasesData.length === 0) {
        toast.error(
          "Mohon untuk menambahkan data penyakit sebelum menambahkan data faktor!"
        );
        return;
      }
      setDiseasesOption(
        diseasesData.map((disease) => ({
          value: disease.id,
          label: disease.name,
        }))
      );
    }
  }, [diseasesData]);

  return (
    <>
      <Metatags title="Cervixes - Manage risk factors data" />
      <AdminCheck>
        <label htmlFor={addModalId} className="btn mb-2">
          Tambahkan Faktor
        </label>
        <ModalAddFactor modalId={addModalId} diseasesOption={diseasesOption} />
        <ModalEditFactor
          modalId={editModalId}
          factor={selectedFactor}
          diseasesOption={diseasesOption}
        />
        <ModalDeleteConfirmation
          modalId={deleteConfirmationModalId}
          title="Konfirmasi Hapus Faktor"
          onClick={() => {
            if (selectedFactor) mutate({ factorId: selectedFactor.id });
          }}
        />
        <FactorList
          editModalId={editModalId}
          deleteConfirmationModalId={deleteConfirmationModalId}
          onClickAction={handleActionClick}
        />
      </AdminCheck>
    </>
  );
};

export default Factors;

const FactorList = ({
  editModalId,
  deleteConfirmationModalId,
  onClickAction,
}: {
  editModalId: string;
  deleteConfirmationModalId: string;
  onClickAction: (clickedFactor: FactorType) => void;
}) => {
  const { data, isLoading } = api.factors.list.useQuery();

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Bobot</th>
            <th>Penyakit</th>
            <th></th>
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
            data.map((factor, index) => (
              <tr key={factor.id}>
                <th>{index + 1}</th>
                <td>{factor.name}</td>
                <td>{factor.weight}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {factor.diseases.length ? (
                      factor.diseases.map((disease) => (
                        <div key={disease.id} className="badge badge-lg">
                          {disease.name}
                        </div>
                      ))
                    ) : (
                      <span>Belum ada penyakit terkait.</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor={editModalId}
                      className="btn-info btn-sm btn flex-1"
                      onClick={() => onClickAction(factor)}
                    >
                      Ubah
                    </label>
                    <label
                      htmlFor={deleteConfirmationModalId}
                      className="btn-error btn-sm btn flex-1"
                      onClick={() => onClickAction(factor)}
                    >
                      Hapus
                    </label>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
