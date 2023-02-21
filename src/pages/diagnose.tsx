import clsx from "clsx";
import AlertDisclaimer from "components/Alert/AlertDisclaimer";
import Metatags from "components/Metatags";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";
import { dempsterShafer } from "utils/dempsterShafer";

type SymptomType = RouterOutputs["diagnoses"]["getOptions"]["symptoms"][number];
type FactorType = RouterOutputs["diagnoses"]["getOptions"]["factors"][number];
export type OptionType = SymptomType | FactorType;

const Diagnose = () => {
  const diagnoseOptions = api.diagnoses.getOptions.useQuery();

  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<FactorType[]>([]);
  const [result, setResult] = useState<OptionType[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clearCheckboxes, setClearCheckboxes] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);

  const uniqueSymptoms = diagnoseOptions.data?.symptoms.filter(
    (symptom, index, array) => {
      // Keep the symptom only if it's the first occurrence in the array
      return array.findIndex((s) => s.name === symptom.name) === index;
    }
  );

  const uniqueFactors = diagnoseOptions.data?.factors.filter(
    (factor, index, array) => {
      // Keep the factor only if it's the first occurrence in the array
      return array.findIndex((f) => f.name === factor.name) === index;
    }
  );

  const handleDiagnose = () => {
    setIsProcessing(true);

    // Merge array of symptoms and factors
    const base: OptionType[] = [...selectedSymptoms, ...selectedFactors];

    // Cancel diagnose if selected options less than 2
    if (base.length === 0) {
      toast.error("Mohon untuk memilih setidaknya satu pilihan yang tersedia.");
      setIsProcessing(false);
      return;
    }

    // Calculate diagnose result using dempster-shafer method
    setResult(dempsterShafer(base));
    setOpenResultModal(true);
    setIsProcessing(false);
  };

  // Clear all checkboxes while also clear all the selected factors & symptoms from the state
  const handleResetClick = () => {
    setSelectedFactors([]);
    setSelectedSymptoms([]);
    setClearCheckboxes(true);
    setTimeout(() => {
      setClearCheckboxes(false);
    }, 100);
  };

  const handleCloseResultModal = () => {
    setOpenResultModal(false);
  };

  return (
    <>
      <Metatags />
      <div className="py-12 pt-4">
        <ResultModal
          result={result}
          openResultModal={openResultModal}
          handleCloseResultModal={handleCloseResultModal}
        />

        <h1 className="my-3 text-center text-2xl font-extrabold">
          Sistem Pakar Diagnosis Kanker Serviks
        </h1>

        <div className="mx-auto flex w-11/12 items-center justify-around gap-3">
          <div className="mt-5">
            <div
              className="mb-4"
              key={clearCheckboxes ? "clear-symptoms" : "not-clear-symptoms"}
            >
              <h2 className="mb-2 text-xl font-bold">
                Adakah gejala-gejala yang Anda alami di bawah ini?
              </h2>
              <p className="mb-3 text-sm">
                Berikan tanda ✅ pada gejala yang sesuai.
              </p>
              {diagnoseOptions.isLoading && <OptionSkeleton />}
              {diagnoseOptions.data &&
                uniqueSymptoms &&
                uniqueSymptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-center gap-3">
                    <label className="label mb-3 cursor-pointer rounded-lg bg-green-50 px-2 shadow-md transition hover:bg-teal-100">
                      <input
                        type="checkbox"
                        className="checkbox-accent checkbox checkbox-lg"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSymptoms((prevState) =>
                              prevState
                                ? [
                                    ...prevState.filter(
                                      (s) => s.name !== symptom.name
                                    ),
                                    ...diagnoseOptions.data.symptoms.filter(
                                      (s) => s.name === symptom.name
                                    ),
                                  ]
                                : [symptom]
                            );
                          } else {
                            setSelectedSymptoms((prevState) =>
                              prevState
                                ? prevState.filter(
                                    (s) => s.name !== symptom.name
                                  )
                                : prevState
                            );
                          }
                        }}
                      />
                      <span className="label-text ml-3 text-base">
                        {symptom.name}
                      </span>
                    </label>
                  </div>
                ))}
            </div>

            <div
              className="mb-3"
              key={clearCheckboxes ? "clear-factors" : "not-clear-factors"}
            >
              <h2 className="mb-2 text-xl font-bold">
                Adakah faktor-faktor yang Anda alami di bawah ini?
              </h2>
              <p className="mb-3 text-sm">
                Berikan tanda ✅ pada faktor yang sesuai.
              </p>
              {diagnoseOptions.isLoading && <OptionSkeleton />}
              {diagnoseOptions.data &&
                uniqueFactors &&
                uniqueFactors.map((factor) => (
                  <div key={factor.id} className="flex items-center gap-3">
                    <label className="label mb-3 cursor-pointer rounded-lg bg-green-50 px-2 shadow-md transition hover:bg-teal-100">
                      <input
                        type="checkbox"
                        className="checkbox-accent checkbox checkbox-lg"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFactors((prevState) =>
                              prevState
                                ? [
                                    ...prevState.filter(
                                      (f) => f.name !== factor.name
                                    ),
                                    ...diagnoseOptions.data.factors.filter(
                                      (f) => f.name === factor.name
                                    ),
                                  ]
                                : [factor]
                            );
                          } else {
                            setSelectedFactors((prevState) =>
                              prevState
                                ? prevState.filter(
                                    (f) => f.name !== factor.name
                                  )
                                : prevState
                            );
                          }
                        }}
                      />
                      <span className="label-text ml-3 text-base">
                        {factor.name}
                      </span>
                    </label>
                  </div>
                ))}
            </div>

            <AlertDisclaimer />

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className={clsx(
                  "btn-primary btn",
                  (diagnoseOptions.isLoading || isProcessing) && "btn-disabled"
                )}
                onClick={handleDiagnose}
              >
                {isProcessing ? "Menjalankan Diagnosa..." : "Periksa Sekarang"}
              </button>
              <button
                className={clsx(
                  "btn-error btn",
                  (diagnoseOptions.isLoading || isProcessing) && "btn-disabled"
                )}
                onClick={handleResetClick}
              >
                Hapus Pilihan
              </button>
            </div>
          </div>
          <Image
            src="/diagnose-illus.png"
            width={450}
            height={450}
            alt="diagnose illustration"
            className="hidden self-start lg:block"
          />
        </div>
      </div>
    </>
  );
};

export default Diagnose;

const ResultModal = ({
  result,
  openResultModal,
  handleCloseResultModal,
}: {
  result: OptionType[];
  openResultModal: boolean;
  handleCloseResultModal: () => void;
}) => {
  return (
    <>
      <input
        type="checkbox"
        id="my-modal-5"
        className="modal-toggle"
        checked={openResultModal}
        onChange={() => {
          return;
        }}
      />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="mb-3 text-center text-lg font-bold">
            Hasil Diagnosis
          </h3>
          {/* Result */}
          {/* What to do next */}
          {/* Prevention, etc. */}
          {result.length !== 0 && (
            <p className="py-4">{JSON.stringify(result)}</p>
          )}
          <div className="modal-action">
            <button onClick={handleCloseResultModal} className="btn">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const OptionSkeleton = () => (
  <>
    <div className="mb-4 flex">
      <div className="h-11 w-56 animate-pulse rounded-md bg-gray-200" />
    </div>
    <div className="mb-4 flex">
      <div className="h-11 w-56 animate-pulse rounded-md bg-gray-200" />
    </div>
    <div className="mb-4 flex">
      <div className="h-11 w-56 animate-pulse rounded-md bg-gray-200" />
    </div>
    <div className="mb-4 flex">
      <div className="h-11 w-56 animate-pulse rounded-md bg-gray-200" />
    </div>
    <div className="mb-4 flex">
      <div className="h-11 w-56 animate-pulse rounded-md bg-gray-200" />
    </div>
  </>
);
