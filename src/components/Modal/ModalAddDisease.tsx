import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// validation schema is also used by server
export const addDiseaseSchema = z.object({
  name: z.string().min(1, { message: "Name field is required" }),
});

type AddDiseaseSchema = z.infer<typeof addDiseaseSchema>;

const ModalAddDisease = ({ modalId }: { modalId: string }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDiseaseSchema>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(addDiseaseSchema),
  });

  const onSubmit = (values: AddDiseaseSchema) => {
    console.log(values);
  };

  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-center text-lg font-bold">Add new disease</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Disease name"
                className="input-bordered input w-full"
                {...register("name")}
              />
              {errors.name?.message && (
                <p className="text-sm text-red-500">{errors.name?.message}</p>
              )}
            </div>
            <div className="modal-action">
              <label
                onClick={() => reset()}
                htmlFor={modalId}
                className="btn-ghost btn bg-base-200"
              >
                Cancel
              </label>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalAddDisease;
