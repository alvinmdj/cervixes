import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "utils/api";
import { z } from "zod";

// validation schema is also used by server
export const addDiseaseSchema = z.object({
  name: z.string().min(1, { message: "Nama penyakit harus diisi" }),
});

type AddDiseaseSchema = z.infer<typeof addDiseaseSchema>;

const ModalAddDisease = ({ modalId }: { modalId: string }) => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDiseaseSchema>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(addDiseaseSchema),
  });

  const utils = api.useContext();

  const { mutate } = api.diseases.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menambahkan penyakit!");

      // close modal
      if (toggleRef.current) toggleRef.current.checked = false;

      // reset input
      reset();

      // invalidate disease list cache
      void utils.diseases.list.invalidate();
    },
    onError: ({ message }) => toast.error(message),
  });

  const onSubmit = (values: AddDiseaseSchema) => {
    mutate(values);
  };

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
          <h3 className="text-center text-lg font-bold">Tambah penyakit</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              <label
                onClick={() => reset()}
                htmlFor={modalId}
                className="btn-ghost btn bg-base-200"
              >
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

export default ModalAddDisease;
