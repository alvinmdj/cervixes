import { useId, useState } from "react";
import { toast } from "react-hot-toast";
import AdminCheck from "../../components/AdminCheck";
import ModalAddDisease from "../../components/Modal/ModalAddDisease";
import ModalDeleteConfirmation from "../../components/Modal/ModalDeleteConfirmation";
import { api } from "../../utils/api";

const Diseases = () => {
  const addModalId = useId();
  const deleteConfirmationModalId = useId();

  const [selectedDiseaseId, setSelectedDiseaseId] = useState("");

  const utils = api.useContext();

  const { data, isLoading } = api.diseases.list.useQuery();

  const { mutate } = api.diseases.delete.useMutation({
    onError: () => {
      toast.error("An error occured, try again later...");
    },
    onSuccess: () => {
      toast.success("Deleted!");

      // invalidate disease list cache
      void utils.diseases.list.invalidate();
    },
  });

  return (
    <AdminCheck>
      <label htmlFor={addModalId} className="btn mb-2">
        Add Disease
      </label>
      <ModalAddDisease modalId={addModalId} />
      <ModalDeleteConfirmation
        modalId={deleteConfirmationModalId}
        title="Confirm Delete Disease"
        onClick={() => mutate({ diseaseId: selectedDiseaseId })}
      />
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Symptoms</th>
              <th>Factors</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center">
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
                        <span>No associated symptoms.</span>
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
                        <span>No associated factors.</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-info btn-sm btn flex-1">
                        Edit
                      </button>
                      <label
                        htmlFor={deleteConfirmationModalId}
                        className="btn-error btn-sm btn flex-1"
                        onClick={() => setSelectedDiseaseId(disease.id)}
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

export default Diseases;
