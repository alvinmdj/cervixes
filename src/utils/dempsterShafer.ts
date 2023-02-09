import type { OptionType } from "pages/diagnose";

export const dempsterShafer = (selectedOptions: OptionType[]): OptionType[] => {
  // Conflict indicator
  const CONFLICT = "CONFLICT_NO_SAME_DISEASE";

  let limit = 2;
  let initialIndex = 0;
  let totalConflictVal = 0;
  let current: OptionType[] = [];
  let massFunc: OptionType[] = [];
  let multiplyResult: OptionType[] = [];
  let nextMassFunc: OptionType[] = [];

  while (selectedOptions.length > initialIndex) {
    // set the current mass func:
    // requires 2 mass func at first iteration
    // requires 1 mass func for next iteration, because
    // the other mass func will be provided from the previous iteration
    for (let i = 0; i < limit; i++) {
      if (initialIndex >= selectedOptions.length) break;
      current.push(selectedOptions[initialIndex] as OptionType);
      initialIndex++;
    }

    // setup each mass func value and its theta value
    current.forEach((curr) => {
      const m = curr.weight;
      const mTheta = 1 - curr.weight;
      massFunc.push(
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
    console.log("massFunc =>", massFunc);

    // do the multiplication between m1 & m2
    for (let i = 0; i < massFunc.length; i++) {
      for (let j = i + 1; j < massFunc.length; j++) {
        if (massFunc[i]?.name !== massFunc[j]?.name) {
          let diseases: string[] | undefined = [];
          if (!massFunc[i]?.diseases.length && !massFunc[j]?.diseases.length)
            diseases = [];
          else if (!massFunc[i]?.diseases.length)
            diseases = massFunc[j]?.diseases;
          else if (!massFunc[j]?.diseases.length)
            diseases = massFunc[i]?.diseases;
          else {
            const sameDiseases = massFunc[i]?.diseases.filter((disease) =>
              massFunc[j]?.diseases.includes(disease)
            );

            if (sameDiseases?.length === 0) diseases = [CONFLICT];
            else diseases = sameDiseases;
          }

          multiplyResult.push({
            name: "multiplyResult",
            diseases: diseases as string[],
            weight:
              (massFunc[i]?.weight as number) * (massFunc[j]?.weight as number),
          });
        }
      }
    }

    console.log("mult =>", multiplyResult);

    // merge weight value for mass func with same diseases
    multiplyResult.forEach((element) => {
      const diseasesString = JSON.stringify(element.diseases.sort());
      const existingElement = nextMassFunc.find(
        (outputElement) =>
          JSON.stringify(outputElement.diseases.sort()) === diseasesString
      );
      if (element.diseases.length === 1 && element.diseases[0] === CONFLICT) {
        totalConflictVal += element.weight;
      } else if (existingElement) {
        existingElement.weight += element.weight;
      } else {
        nextMassFunc.push(element);
      }
    });

    // divide total weight with (1 - total of conflict value)
    nextMassFunc.forEach((m) => {
      m.weight = m.weight / (1 - totalConflictVal);
    });

    console.log("next =>", nextMassFunc);

    // if no more selected option, return the last calculation as result
    if (initialIndex >= selectedOptions.length) {
      console.log("last result!");
      return nextMassFunc;
    }

    // reset value for next iteration
    current = [];
    massFunc = [];
    multiplyResult = [];
    totalConflictVal = 0;

    // set limit to 1 instead of 2, because the other mass function
    // will be set below from the current mass function
    limit = 1;

    // set the next iteration's first mass function with the current mass function
    massFunc.push(...nextMassFunc);

    // reset value for next iteration
    nextMassFunc = [];
  }

  return nextMassFunc;
};
