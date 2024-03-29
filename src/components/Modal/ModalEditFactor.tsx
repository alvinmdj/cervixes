import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import type { DiseasesOption } from "pages/dashboard/factors";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Select from "react-select";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";
import { z } from "zod";

// validation schema is also used by server
export const editFactorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Nama faktor harus diisi" }),
  weight: z
    .number()
    .min(0.25, { message: "Bobot harus lebih besar dari 0" })
    .max(10),
  diseases: z
    .string()
    .array()
    .min(1, "Harus memilih setidaknya 1 penyakit terkait"),
});

type EditFactorSchema = z.infer<typeof editFactorSchema>;

type Props = {
  modalId: string;
  factor: RouterOutputs["factors"]["list"][number] | undefined;
  diseasesOption: DiseasesOption[] | undefined;
};

const ModalEditFactor = ({ modalId, factor, diseasesOption }: Props) => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const [defaultDiseases, setDefaultDiseases] = useState<DiseasesOption[]>();

  const {
    control,
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditFactorSchema>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(editFactorSchema),
  });

  const weightValue = watch("weight");

  const utils = api.useContext();

  const { mutate } = api.factors.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil memperbarui faktor!");

      // close modal
      if (toggleRef.current) toggleRef.current.checked = false;

      // invalidate factor list cache
      void utils.factors.list.invalidate();
    },
    onError: (error) => {
      if (error.data && error.data?.httpStatus >= 500) {
        toast.error("Terjadi kesalahan pada server");
      } else {
        toast.error(error.message);
      }
    },
  });

  const onSubmit = (values: EditFactorSchema) => {
    mutate(values);
  };

  useEffect(() => {
    if (factor) {
      setDefaultDiseases(
        factor.diseases.map((disease) => ({
          label: disease.name,
          value: disease.id,
        }))
      );
      setValue(
        "diseases",
        factor.diseases.map((disease) => disease.id)
      );

      setValue("id", factor.id);
      setValue("name", factor.name);
      setValue("weight", factor.weight);
    }
  }, [factor, setValue]);

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
          <h3 className="text-center text-lg font-bold">Ubah faktor</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("id")} />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nama faktor</span>
              </label>
              <input
                type="text"
                placeholder="Nama faktor"
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Bobot faktor</span>
                <span>{weightValue}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                className="range"
                step="0.25"
                {...register("weight", {
                  valueAsNumber: true,
                })}
              />
              {errors.weight?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.weight?.message}
                </p>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Penyakit terkait</span>
              </label>
              <Controller
                control={control}
                name="diseases"
                render={({ field: { onChange, name, ref } }) => (
                  <Select
                    ref={ref}
                    name={name}
                    placeholder="Pilih penyakit terkait..."
                    value={defaultDiseases}
                    onChange={(val) => {
                      setDefaultDiseases(val.map((c) => c));
                      onChange(val.map((c) => c.value));
                    }}
                    isMulti
                    menuPlacement="top"
                    maxMenuHeight={200}
                    options={diseasesOption}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.diseases?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.diseases?.message}
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

export default ModalEditFactor;
