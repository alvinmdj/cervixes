import AdminCheck from "components/AdminCheck";
import Metatags from "components/Metatags";
import ModalAddSymptom from "components/Modal/ModalAddSymptom";
import ModalDeleteConfirmation from "components/Modal/ModalDeleteConfirmation";
import ModalEditSymptom from "components/Modal/ModalEditSymptom";
import { useEffect, useId, useState } from "react";
import { toast } from "react-hot-toast";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";

export type DiseasesOption = {
  label: string;
  value: string;
};

type SymptomType = RouterOutputs["symptoms"]["list"][number];

const Symptoms = () => {
  const addModalId = useId();
  const editModalId = useId();
  const deleteConfirmationModalId = useId();

  const [diseasesOption, setDiseasesOption] = useState<
    DiseasesOption[] | undefined
  >();

  const [selectedSymptom, setSelectedSymptom] = useState<SymptomType>();

  const handleActionClick = (clickedFactor: SymptomType) => {
    setSelectedSymptom(clickedFactor);
  };

  const utils = api.useContext();

  const { mutate } = api.symptoms.delete.useMutation({
    onError: () => {
      toast.error("Terjadi kesalahan pada server, coba lagi nanti...");
    },
    onSuccess: () => {
      toast.success("Berhasil dihapus!");

      // invalidate symptom list cache
      void utils.symptoms.list.invalidate();
    },
  });

  const { data: diseasesData } = api.diseases.list.useQuery();

  useEffect(() => {
    if (diseasesData) {
      if (diseasesData.length === 0) {
        toast.error(
          "Mohon untuk menambahkan data penyakit sebelum menambahkan data gejala!"
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
      <Metatags title="Cervixes - Manage symptoms data" />
      <AdminCheck>
        <label htmlFor={addModalId} className="btn mb-2">
          Tambahkan Gejala
        </label>
        <ModalAddSymptom modalId={addModalId} diseasesOption={diseasesOption} />
        <ModalEditSymptom
          modalId={editModalId}
          symptom={selectedSymptom}
          diseasesOption={diseasesOption}
        />
        <ModalDeleteConfirmation
          modalId={deleteConfirmationModalId}
          title="Konfirmasi Hapus Gejala"
          onClick={() => {
            if (selectedSymptom) mutate({ symptomId: selectedSymptom.id });
          }}
        />
        <SymptomList
          editModalId={editModalId}
          deleteConfirmationModalId={deleteConfirmationModalId}
          onClickAction={handleActionClick}
        />
      </AdminCheck>
    </>
  );
};

export default Symptoms;

const SymptomList = ({
  editModalId,
  deleteConfirmationModalId,
  onClickAction,
}: {
  editModalId: string;
  deleteConfirmationModalId: string;
  onClickAction: (clickedFactor: SymptomType) => void;
}) => {
  const { data, isLoading } = api.symptoms.list.useQuery();

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
            data.map((symptom, index) => (
              <tr key={symptom.id}>
                <th>{index + 1}</th>
                <td>{symptom.name}</td>
                <td>{symptom.weight}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {symptom.diseases.length ? (
                      symptom.diseases.map((disease) => (
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
                      onClick={() => onClickAction(symptom)}
                    >
                      Ubah
                    </label>
                    <label
                      htmlFor={deleteConfirmationModalId}
                      className="btn-error btn-sm btn flex-1"
                      onClick={() => onClickAction(symptom)}
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
