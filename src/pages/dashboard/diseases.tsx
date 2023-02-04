import { useId } from "react";
import AdminCheck from "../../components/AdminCheck";
import ModalAddDisease from "../../components/Modal/ModalAddDisease";
import { api } from "../../utils/api";

const Diseases = () => {
  const addModalId = useId();

  const { data, isLoading } = api.diseases.list.useQuery();

  return (
    <AdminCheck>
      <label htmlFor={addModalId} className="btn mb-2">
        Add Disease
      </label>
      <ModalAddDisease modalId={addModalId} />
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
                        disease.factors.map((symptom) => (
                          <div key={symptom.id} className="badge badge-lg">
                            {symptom.name}
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
                      <button className="btn-error btn-sm btn flex-1">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            <tr className="hover">
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-lg">Mual</div>
                  <div className="badge badge-lg">Merasa malas</div>
                  <div className="badge badge-lg">Jantung berdenyut</div>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-lg">Kurang tidur</div>
                  <div className="badge badge-lg">Banyak makan</div>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-info btn-sm btn flex-1">Edit</button>
                  <button className="btn-error btn-sm btn flex-1">
                    Remove
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-lg">Mual</div>
                  <div className="badge badge-lg">Merasa malas</div>
                  <div className="badge badge-lg">Jantung berdenyut</div>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-lg">Kurang tidur</div>
                  <div className="badge badge-lg">Banyak makan</div>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-info btn-sm btn flex-1">Edit</button>
                  <button className="btn-error btn-sm btn flex-1">
                    Remove
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-lg">Mual</div>
                  <div className="badge badge-lg">Merasa malas</div>
                  <div className="badge badge-lg">Jantung berdenyut</div>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-lg">Kurang tidur</div>
                  <div className="badge badge-lg">Banyak makan</div>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-info btn-sm btn flex-1">Edit</button>
                  <button className="btn-error btn-sm btn flex-1">
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminCheck>
  );
};

export default Diseases;
