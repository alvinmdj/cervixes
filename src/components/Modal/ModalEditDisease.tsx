import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";
import { z } from "zod";

// validation schema is also used by server
export const editDiseaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Name field is required" }),
});

type EditDiseaseSchema = z.infer<typeof editDiseaseSchema>;

type Props = {
  modalId: string;
  disease: RouterOutputs["diseases"]["list"][number] | undefined;
};

const ModalEditDisease = ({ modalId, disease }: Props) => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditDiseaseSchema>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(editDiseaseSchema),
  });

  const utils = api.useContext();

  const { mutate } = api.diseases.update.useMutation({
    onSuccess: () => {
      toast.success("Update success!");

      // close modal
      if (toggleRef.current) toggleRef.current.checked = false;

      // invalidate disease list cache
      void utils.diseases.list.invalidate();
    },
    onError: ({ message }) => toast.error(message),
  });

  const onSubmit = (values: EditDiseaseSchema) => {
    mutate(values);
  };

  useEffect(() => {
    if (disease) {
      setValue("id", disease.id);
      setValue("name", disease.name);
    }
  }, [disease, setValue]);

  return (
    <>
      <input
        type="checkbox"
        id={modalId}
        ref={toggleRef}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-center text-lg font-bold">Edit disease</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <input type="hidden" {...register("id")} />
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Disease name"
                className={clsx(
                  "input-bordered input w-full",
                  errors.name && "input-error"
                )}
                {...register("name")}
              />
              {errors.name?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="modal-action">
              <label htmlFor={modalId} className="btn-ghost btn bg-base-200">
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

export default ModalEditDisease;
