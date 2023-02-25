import type { OptionType } from "pages/diagnose";

export const dempsterShafer = (selectedOptions: OptionType[]): OptionType[] => {
  if (selectedOptions.length === 1) {
    return [
      selectedOptions[0] as OptionType,
      {
        id: selectedOptions[0]?.id as string,
        name: selectedOptions[0]?.name as string,
        diseases: [] as [],
        weight: 1 - Number(selectedOptions[0]?.weight),
      },
    ];
  }

  // Conflict indicator
  const CONFLICT = "CONFLICT_NO_SAME_DISEASE";

  let limit = 2;
  let initialIndex = 0;
  let totalConflictVal = 0;
  let tempOption: OptionType[] = [];
  let currentOption: OptionType[] = [];
  let calcResult: OptionType[] = [];
  let nextResult: OptionType[] = [];

  while (selectedOptions.length > initialIndex) {
    /**
     * set the tempOption mass func:
     * requires 2 mass func at first iteration
     * requires 1 mass func for next iteration, because
     * the other mass func will be provided from the previous iteration
     **/
    for (let i = 0; i < limit; i++) {
      if (initialIndex >= selectedOptions.length) break;
      tempOption.push(selectedOptions[initialIndex] as OptionType);
      initialIndex++;
    }

    // setup each mass func value and its theta value
    tempOption.forEach((curr) => {
      const m = curr.weight;
      const mTheta = 1 - curr.weight;
      currentOption.push(
        {
          id: curr.id,
          name: curr.name,
          diseases: curr.diseases,
          weight: m,
        },
        {
          id: curr.id,
          name: curr.name,
          diseases: [],
          weight: mTheta,
        }
      );
    });

    console.log("curr =>", tempOption);
    console.log("currentOption =>", currentOption);

    // do the multiplication between m1 & m2
    for (let i = 0; i < currentOption.length; i++) {
      for (let j = i + 1; j < currentOption.length; j++) {
        if (currentOption[i]?.id !== currentOption[j]?.id) {
          let diseases: string[] | undefined = [];
          if (
            !currentOption[i]?.diseases.length &&
            !currentOption[j]?.diseases.length
          )
            diseases = [];
          else if (!currentOption[i]?.diseases.length)
            diseases = currentOption[j]?.diseases;
          else if (!currentOption[j]?.diseases.length)
            diseases = currentOption[i]?.diseases;
          else {
            const sameDiseases = currentOption[i]?.diseases.filter((disease) =>
              currentOption[j]?.diseases.includes(disease)
            );

            if (sameDiseases?.length === 0) diseases = [CONFLICT];
            else diseases = sameDiseases;
          }

          calcResult.push({
            id: initialIndex.toString(),
            name: "calcResult",
            diseases: diseases as string[],
            weight:
              (currentOption[i]?.weight as number) *
              (currentOption[j]?.weight as number),
          });
        }
      }
    }

    console.log("mult =>", calcResult);

    // merge (add) weight value for mass func with same diseases
    calcResult.forEach((multResult) => {
      const diseasesString = JSON.stringify(multResult.diseases.sort());
      const existingDiseases = nextResult.find(
        (res) => JSON.stringify(res.diseases.sort()) === diseasesString
      );
      if (
        multResult.diseases.length === 1 &&
        multResult.diseases[0] === CONFLICT
      ) {
        totalConflictVal += multResult.weight;
      } else if (existingDiseases) {
        existingDiseases.weight += multResult.weight;
      } else {
        nextResult.push(multResult);
      }
    });

    // divide total weight with (1 - total of conflict value)
    nextResult.forEach((m) => {
      m.weight = m.weight / (1 - totalConflictVal);
    });

    console.log("next =>", nextResult);

    // if no more selected option, return the last calculation as result
    if (initialIndex >= selectedOptions.length) {
      console.log("last result!");
      return nextResult;
    }

    // reset value for next iteration
    tempOption = [];
    currentOption = [];
    calcResult = [];
    totalConflictVal = 0;

    // set limit to 1 instead of 2, because the other mass function
    // will be set below from the tempOption mass function
    limit = 1;

    // set the next iteration's first mass function with the current mass function
    currentOption.push(...nextResult);

    // reset value for next iteration
    nextResult = [];
  }

  return nextResult;
};
