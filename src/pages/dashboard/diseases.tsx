import AdminCheck from "components/AdminCheck";
import Metatags from "components/Metatags";
import ModalAddDisease from "components/Modal/ModalAddDisease";
import ModalDeleteConfirmation from "components/Modal/ModalDeleteConfirmation";
import ModalEditDisease from "components/Modal/ModalEditDisease";
import { useId, useState } from "react";
import { toast } from "react-hot-toast";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";

type DiseaseType = RouterOutputs["diseases"]["list"][number];

const Diseases = () => {
  const addModalId = useId();
  const editModalId = useId();
  const deleteConfirmationModalId = useId();

  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>();

  const handleActionClick = (clickedDisease: DiseaseType) => {
    setSelectedDisease(clickedDisease);
  };

  const utils = api.useContext();

  const { mutate } = api.diseases.delete.useMutation({
    onError: () => {
      toast.error("Terjadi kesalahan pada server, coba lagi nanti...");
    },
    onSuccess: () => {
      toast.success("Berhasil dihapus!");

      // invalidate disease list cache
      void utils.diseases.list.invalidate();
    },
  });

  return (
    <>
      <Metatags title="Cervixes - Manage diseases data" />
      <AdminCheck>
        <label htmlFor={addModalId} className="btn mb-2">
          Tambahkan Penyakit
        </label>
        <ModalAddDisease modalId={addModalId} />
        <ModalEditDisease modalId={editModalId} disease={selectedDisease} />
        <ModalDeleteConfirmation
          modalId={deleteConfirmationModalId}
          title="Konfirmasi Hapus Penyakit"
          onClick={() => {
            if (selectedDisease) mutate({ diseaseId: selectedDisease.id });
          }}
        />
        <DiseaseList
          editModalId={editModalId}
          deleteConfirmationModalId={deleteConfirmationModalId}
          onClickAction={handleActionClick}
        />
      </AdminCheck>
    </>
  );
};

export default Diseases;

const DiseaseList = ({
  editModalId,
  deleteConfirmationModalId,
  onClickAction,
}: {
  editModalId: string;
  deleteConfirmationModalId: string;
  onClickAction: (clickedDisease: DiseaseType) => void;
}) => {
  const { data, isLoading } = api.diseases.list.useQuery();

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Gejala</th>
            <th>Faktor</th>
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
            data.map((disease, index) => (
              <tr key={disease.id}>
                <th>{index + 1}</th>
                <td>{disease.name}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {disease.symptoms.length ? (
                      disease.symptoms.map((symptom) => (
                        <div key={symptom.id} className="badge badge-lg">
                          {symptom.name}
                        </div>
                      ))
                    ) : (
                      <span>Belum ada gejala terkait.</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {disease.factors.length ? (
                      disease.factors.map((factor) => (
                        <div key={factor.id} className="badge badge-lg">
                          {factor.name}
                        </div>
                      ))
                    ) : (
                      <span>Belum ada faktor terkait.</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor={editModalId}
                      className="btn-info btn-sm btn flex-1"
                      onClick={() => onClickAction(disease)}
                    >
                      Ubah
                    </label>
                    <label
                      htmlFor={deleteConfirmationModalId}
                      className="btn-error btn-sm btn flex-1"
                      onClick={() => onClickAction(disease)}
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
