import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import type { DiseasesOption } from "pages/dashboard/symptoms";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Select from "react-select";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";
import { z } from "zod";

// validation schema is also used by server
export const editSymptomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Nama gejala harus diisi" }),
  weight: z
    .number()
    .min(1, { message: "Bobot harus berada dalam rentang 1 - 10" })
    .max(10),
  diseases: z
    .string()
    .array()
    .min(1, "Harus memilih setidaknya 1 penyakit terkait"),
});

type EditSymptomSchema = z.infer<typeof editSymptomSchema>;

type Props = {
  modalId: string;
  symptom: RouterOutputs["symptoms"]["list"][number] | undefined;
  diseasesOption: DiseasesOption[] | undefined;
};

const ModalEditSymptom = ({ modalId, symptom, diseasesOption }: Props) => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const [defaultDiseases, setDefaultDiseases] = useState<DiseasesOption[]>();

  const {
    control,
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditSymptomSchema>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(editSymptomSchema),
  });

  const weightValue = watch("weight");

  const utils = api.useContext();

  const { mutate } = api.symptoms.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil memperbarui gejala!");

      // close modal
      if (toggleRef.current) toggleRef.current.checked = false;

      // invalidate symptom list cache
      void utils.symptoms.list.invalidate();
    },
    onError: (error) => {
      if (error.data && error.data?.httpStatus >= 500) {
        toast.error("Terjadi kesalahan pada server");
      } else {
        toast.error(error.message);
      }
    },
  });

  const onSubmit = (values: EditSymptomSchema) => {
    mutate(values);
  };

  useEffect(() => {
    if (symptom) {
      setDefaultDiseases(
        symptom.diseases.map((disease) => ({
          label: disease.name,
          value: disease.id,
        }))
      );
      setValue(
        "diseases",
        symptom.diseases.map((disease) => disease.id)
      );

      setValue("id", symptom.id);
      setValue("name", symptom.name);
      setValue("weight", symptom.weight);
    }
  }, [symptom, setValue]);

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
          <h3 className="text-center text-lg font-bold">Ubah gejala</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("id")} />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nama gejala</span>
              </label>
              <input
                type="text"
                placeholder="Nama gejala"
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
                <span className="label-text">Bobot gejala</span>
                <span>{weightValue}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                className="range"
                step="1"
                {...register("weight", {
                  valueAsNumber: true,
                })}
              />
              <div className="flex w-full justify-between px-2 text-xs">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
              {errors.weight?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.weight?.message}
                </p>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Diseases</span>
              </label>
              <Controller
                control={control}
                name="diseases"
                render={({ field: { onChange, name, ref } }) => (
                  <Select
                    ref={ref}
                    name={name}
                    value={defaultDiseases}
                    placeholder="Pilih penyakit terkait..."
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

export default ModalEditSymptom;
