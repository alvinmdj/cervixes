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
  name: z.string().min(1, { message: "Nama penyakit harus diisi" }),
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
      toast.success("Berhasil memperbarui penyakit!");

      // close modal
      if (toggleRef.current) toggleRef.current.checked = false;

      // invalidate disease list cache
      void utils.diseases.list.invalidate();
    },
    onError: (error) => {
      if (error.data && error.data?.httpStatus >= 500) {
        toast.error("Terjadi kesalahan pada server");
      } else {
        toast.error(error.message);
      }
    },
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
          <h3 className="text-center text-lg font-bold">Ubah penyakit</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("id")} />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nama penyakit</span>
              </label>
              <input
                type="text"
                placeholder="Nama penyakit"
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
                Batalkan
              </label>
              <button type="submit" className="btn">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalEditDisease;
