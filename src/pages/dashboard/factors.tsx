import AdminCheck from "components/AdminCheck";
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
      toast.error("An error occured, try again later...");
    },
    onSuccess: () => {
      toast.success("Deleted!");

      // invalidate symptom list cache
      void utils.factors.list.invalidate();
    },
  });

  const { data: diseasesData } = api.diseases.list.useQuery();

  useEffect(() => {
    if (diseasesData) {
      if (diseasesData.length === 0) {
        toast.error("Please add disease(s) before adding symptom(s)");
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
    <AdminCheck>
      <label htmlFor={addModalId} className="btn mb-2">
        Add Factor
      </label>
      <ModalAddFactor modalId={addModalId} diseasesOption={diseasesOption} />
      <ModalEditFactor
        modalId={editModalId}
        factor={selectedFactor}
        diseasesOption={diseasesOption}
      />
      <ModalDeleteConfirmation
        modalId={deleteConfirmationModalId}
        title="Confirm Delete Factor"
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
            <th>Name</th>
            <th>Weight</th>
            <th>Diseases</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="text-center">
                Loading data...
              </td>
            </tr>
          )}
          {data?.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                No entries found...
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
                      <span>No associated diseases.</span>
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
                      Edit
                    </label>
                    <label
                      htmlFor={deleteConfirmationModalId}
                      className="btn-error btn-sm btn flex-1"
                      onClick={() => onClickAction(factor)}
                    >
                      Remove
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
