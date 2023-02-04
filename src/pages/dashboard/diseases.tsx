import { useId } from "react";
import AdminCheck from "../../components/AdminCheck";
import ModalAddDisease from "../../components/Modal/ModalAddDisease";

const Diseases = () => {
  const addModalId = useId();

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
              <th>Code</th>
              <th>Symptoms</th>
              <th>Factors</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover">
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>D01</td>
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
              <td>D02</td>
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
              <td>D03</td>
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
