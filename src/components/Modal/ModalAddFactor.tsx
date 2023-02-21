import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import type { DiseasesOption } from "pages/dashboard/factors";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { api } from "utils/api";
import { z } from "zod";

// validation schema is also used by server
export const addFactorSchema = z.object({
  name: z.string().min(1, { message: "Name field is required" }),
  weight: z.number().min(1).max(10),
  diseases: z.string().array().min(1, "Must select at least 1 disease(s)"),
});

type AddFactorSchema = z.infer<typeof addFactorSchema>;

type Props = {
  modalId: string;
  diseasesOption: DiseasesOption[] | undefined;
};

const ModalAddFactor = ({ modalId, diseasesOption }: Props) => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const [selectedDiseases, setSelectedDiseases] = useState<DiseasesOption[]>();

  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFactorSchema>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(addFactorSchema),
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

  const { mutate } = api.factors.create.useMutation({
    onSuccess: () => {
      toast.success("Create success!");

      // close modal
      if (toggleRef.current) toggleRef.current.checked = false;

      // reset input
      resetInput();

      // invalidate factors list cache
      void utils.factors.list.invalidate();
    },
    onError: ({ message }) => toast.error(message),
  });

  const onSubmit = (values: AddFactorSchema) => {
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
          <h3 className="text-center text-lg font-bold">Add new factor</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Factor name"
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
                <span className="label-text">Weight</span>
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

export default ModalAddFactor;
