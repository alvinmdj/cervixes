import AdminCheck from "components/AdminCheck";
import ModalAddSymptom from "components/Modal/ModalAddSymptom";
import ModalDeleteConfirmation from "components/Modal/ModalDeleteConfirmation";
import ModalEditSymptom from "components/Modal/ModalEditSymptom";
import { useId, useState } from "react";
import { toast } from "react-hot-toast";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";

const Symptoms = () => {
  const addModalId = useId();
  const editModalId = useId();
  const deleteConfirmationModalId = useId();

  const [selectedSymptom, setSelectedSymptom] =
    useState<RouterOutputs["symptoms"]["list"][number]>();

  const utils = api.useContext();

  const { data, isLoading } = api.symptoms.list.useQuery();

  const { mutate } = api.symptoms.delete.useMutation({
    onError: () => {
      toast.error("An error occured, try again later...");
    },
    onSuccess: () => {
      toast.success("Deleted!");

      // invalidate symptom list cache
      void utils.symptoms.list.invalidate();
    },
  });

  return (
    <AdminCheck>
      <label htmlFor={addModalId} className="btn mb-2">
        Add Symptom
      </label>
      <ModalAddSymptom modalId={addModalId} />
      <ModalEditSymptom modalId={editModalId} symptom={selectedSymptom} />
      <ModalDeleteConfirmation
        modalId={deleteConfirmationModalId}
        title="Confirm Delete Symptom"
        onClick={() => {
          if (selectedSymptom) mutate({ symptomId: selectedSymptom.id });
        }}
      />
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
                        <span>No associated diseases.</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <label
                        htmlFor={editModalId}
                        className="btn-info btn-sm btn flex-1"
                        onClick={() => setSelectedSymptom(symptom)}
                      >
                        Edit
                      </label>
                      <label
                        htmlFor={deleteConfirmationModalId}
                        className="btn-error btn-sm btn flex-1"
                        onClick={() => setSelectedSymptom(symptom)}
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
    </AdminCheck>
  );
};

export default Symptoms;
