import AdminCheck from "../../components/AdminCheck";

const Symptoms = () => {
  return (
    <AdminCheck>
      <button className="btn mb-2">Add Symptom</button>
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
            <tr className="hover">
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>9</td>
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
              <td>2</td>
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
              <td>5</td>
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

export default Symptoms;
