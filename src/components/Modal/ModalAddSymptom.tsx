import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import type { DiseasesOption } from "pages/dashboard/symptoms";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { api } from "utils/api";
import { z } from "zod";

// validation schema is also used by server
export const addSymptomSchema = z.object({
  name: z.string().min(1, { message: "Nama gejala harus diisi" }),
  weight: z
    .number()
    .min(0.25, { message: "Bobot harus lebih besar dari 0" })
    .max(10),
  diseases: z
    .string()
    .array()
    .min(1, "Harus memilih setidaknya 1 penyakit terkait"),
});

type AddSymptomSchema = z.infer<typeof addSymptomSchema>;

type Props = {
  modalId: string;
  diseasesOption: DiseasesOption[] | undefined;
};

const ModalAddSymptom = ({ modalId, diseasesOption }: Props) => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const [selectedDiseases, setSelectedDiseases] = useState<DiseasesOption[]>();

  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddSymptomSchema>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(addSymptomSchema),
    defaultValues: {
      weight: 0,
      diseases: [],
    },
  });

  const weightValue = watch("weight");

  const resetInput = () => {
    reset();
    setSelectedDiseases([]);
  };

  const utils = api.useContext();

  const { mutate } = api.symptoms.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menambahkan gejala!");

      // close modal
      if (toggleRef.current) toggleRef.current.checked = false;

      // reset input
      resetInput();

      // invalidate symptoms list cache
      void utils.symptoms.list.invalidate();
    },
    onError: ({ message }) => toast.error(message),
  });

  const onSubmit = (values: AddSymptomSchema) => {
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
          <h3 className="text-center text-lg font-bold">Tambah gejala</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    onChange={(val) => {
                      setSelectedDiseases(val.map((c) => c));
                      onChange(val.map((c) => c.value));
                    }}
                    value={selectedDiseases}
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
              <label
                onClick={resetInput}
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

export default ModalAddSymptom;
