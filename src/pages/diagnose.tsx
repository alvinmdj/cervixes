import clsx from "clsx";
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

    setIsProcessing(false);
  };

  // Clear all checkboxes while also clear all the selected factors & symptoms from the state
  function handleResetClick() {
    setSelectedFactors([]);
    setSelectedSymptoms([]);
    setClearCheckboxes(true);
    setTimeout(() => {
      setClearCheckboxes(false);
    }, 100);
  }

  return (
    <div>
      <h1 className="my-3 text-center text-2xl font-extrabold">
        Diagnose Cervical Cancer
      </h1>

      <div className="mx-5 mt-5">
        <div
          className="mb-4"
          key={clearCheckboxes ? "clear-symptoms" : "not-clear-symptoms"}
        >
          <h2 className="mb-3 text-xl font-bold">
            Choose all the symptoms you feel
          </h2>
          {diagnoseOptions.isLoading && <OptionSkeleton />}
          {diagnoseOptions.data &&
            uniqueSymptoms &&
            uniqueSymptoms.map((symptom) => (
              <div key={symptom.id} className="mb-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  className="checkbox"
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
                          ? prevState.filter((s) => s.name !== symptom.name)
                          : prevState
                      );
                    }
                  }}
                />
                {symptom.name}
              </div>
            ))}
        </div>

        <div
          className="mb-4"
          key={clearCheckboxes ? "clear-factors" : "not-clear-factors"}
        >
          <h2 className="mb-3 text-xl font-bold">
            Choose all the factors you feel
          </h2>
          {diagnoseOptions.isLoading && <OptionSkeleton />}
          {diagnoseOptions.data &&
            uniqueFactors &&
            uniqueFactors.map((factor) => (
              <div key={factor.id} className="mb-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  className="checkbox"
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
                          ? prevState.filter((f) => f.name !== factor.name)
                          : prevState
                      );
                    }
                  }}
                />
                {factor.name}
              </div>
            ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
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
              selectedFactors.length === 0 &&
                selectedSymptoms.length === 0 &&
                "btn-disabled"
            )}
            onClick={handleResetClick}
          >
            Hapus Pilihan
          </button>
        </div>

        {result.length !== 0 && <p>{JSON.stringify(result)}</p>}
      </div>
    </div>
  );
};

export default Diagnose;

const OptionSkeleton = () => (
  <>
    <div className="mb-3 flex">
      <div className="mr-3 h-6 w-6 animate-pulse rounded-md bg-gray-200" />
      <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
    </div>
    <div className="mb-3 flex">
      <div className="mr-3 h-6 w-6 animate-pulse rounded-md bg-gray-200" />
      <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
    </div>
    <div className="mb-3 flex">
      <div className="mr-3 h-6 w-6 animate-pulse rounded-md bg-gray-200" />
      <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
    </div>
  </>
);
