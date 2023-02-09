import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { RouterOutputs } from "utils/api";
import { api } from "utils/api";

type SymptomType = RouterOutputs["diagnoses"]["getOptions"]["symptoms"][number];
type FactorType = RouterOutputs["diagnoses"]["getOptions"]["factors"][number];
type OptionType = SymptomType | FactorType;

const Diagnose = () => {
  const diagnoseOptions = api.diagnoses.getOptions.useQuery();

  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<FactorType[]>([]);

  const [result, setResult] = useState<OptionType[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDiagnose = () => {
    setIsProcessing(true);

    // Conflict indicator
    const CONFLICT = "CONFLICT_NO_SAME_DISEASE";

    // Merge array of symptoms and factors
    const base: OptionType[] = [...selectedSymptoms, ...selectedFactors];

    if (base.length < 2) {
      toast.error("Please choose more than 1 options");
      setIsProcessing(false);
      return;
    }
    console.log("base =>", base);

    let limit = 2;
    let index = 0;
    let current: OptionType[] = [];
    let data: OptionType[] = [];
    let multiplyResult: OptionType[] = [];
    let nextMassFunc: OptionType[] = [];
    let conflictVal = 0;

    while (base.length > index) {
      for (let i = 0; i < limit; i++) {
        if (index >= base.length) break;
        if (base[index]) {
          current.push(base[index] as SymptomType | FactorType);
        }
        index++;
      }

      current.forEach((curr) => {
        const m = curr.weight;
        const mTheta = 1 - curr.weight;
        data.push(
          {
            name: curr.name,
            diseases: curr.diseases,
            weight: m,
          },
          {
            name: curr.name,
            diseases: [],
            weight: mTheta,
          }
        );
      });

      console.log("curr =>", current);
      console.log("data =>", data);

      for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
          if (data[i]?.name !== data[j]?.name) {
            let diseases: string[] | undefined = [];
            if (!data[i]?.diseases.length && !data[j]?.diseases.length)
              diseases = [];
            else if (!data[i]?.diseases.length) diseases = data[j]?.diseases;
            else if (!data[j]?.diseases.length) diseases = data[i]?.diseases;
            else {
              const sameDiseases = data[i]?.diseases.filter((disease) =>
                data[j]?.diseases.includes(disease)
              );

              if (sameDiseases?.length === 0) diseases = [CONFLICT];
              else diseases = sameDiseases as string[];
            }

            multiplyResult.push({
              name: "multiplyResult",
              diseases: diseases as string[],
              weight: (data[i]?.weight as number) * (data[j]?.weight as number),
            });
          }
        }
      }

      console.log("mult =>", multiplyResult);

      multiplyResult.forEach((element) => {
        const diseasesString = JSON.stringify(element.diseases.sort());
        const existingElement = nextMassFunc.find(
          (outputElement) =>
            JSON.stringify(outputElement.diseases.sort()) === diseasesString
        );
        if (element.diseases.length === 1 && element.diseases[0] === CONFLICT) {
          conflictVal += element.weight;
        } else if (existingElement) {
          existingElement.weight += element.weight;
        } else {
          nextMassFunc.push(element);
        }
      });

      nextMassFunc.forEach((m) => {
        m.weight = m.weight / (1 - conflictVal);
      });

      console.log("next =>", nextMassFunc);

      current = [];
      data = [];
      multiplyResult = [];

      if (index >= base.length) {
        console.log("last result!");
        setResult(nextMassFunc);
        break;
      }

      data.push(...nextMassFunc);

      nextMassFunc = [];
      conflictVal = 0;
      limit = 1;
    }

    console.log("data =>", data);

    console.log("curr =>", current);

    setIsProcessing(false);
  };

  return (
    <div>
      <h1 className="my-3 text-center text-2xl font-extrabold">
        Diagnose Cervical Cancer
      </h1>

      <div className="mx-5 mt-5">
        <div className="mb-4">
          <h2 className="mb-3 text-xl font-bold">
            Choose all the symptoms you feel
          </h2>
          {diagnoseOptions.isLoading && <OptionSkeleton />}
          {diagnoseOptions.data &&
            diagnoseOptions.data.symptoms.map((symptom) => (
              <div key={symptom.name} className="mb-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSymptoms((prevState) =>
                        prevState ? [...prevState, symptom] : [symptom]
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

        <div className="mb-4">
          <h2 className="mb-3 text-xl font-bold">
            Choose all the factors you feel
          </h2>
          {diagnoseOptions.isLoading && <OptionSkeleton />}
          {diagnoseOptions.data &&
            diagnoseOptions.data.factors.map((factor) => (
              <div key={factor.name} className="mb-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFactors((prevState) =>
                        prevState ? [...prevState, factor] : [factor]
                      );
                    } else {
                      setSelectedFactors((prevState) =>
                        prevState
                          ? prevState.filter((s) => s.name !== factor.name)
                          : prevState
                      );
                    }
                  }}
                />
                {factor.name}
              </div>
            ))}
        </div>

        <button
          className={clsx(
            "btn-primary btn mt-3",
            (diagnoseOptions.isLoading || isProcessing) && "btn-disabled"
          )}
          onClick={handleDiagnose}
        >
          {isProcessing ? "Diagnosing" : "Diagnose"}
        </button>

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
