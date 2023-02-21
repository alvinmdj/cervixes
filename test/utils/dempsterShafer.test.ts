import { describe, expect, it } from "vitest";
import { dempsterShafer } from "../../src/utils/dempsterShafer";

// normal input
const input = [
  {
    id: "clechgh7f0006mo08jxs6k2b7",
    name: "G1",
    weight: 0.8,
    diseases: ["P1", "P2", "P3"],
  },
  {
    id: "clechgv1z0008mo08p1spd33l",
    name: "G2",
    weight: 0.3,
    diseases: ["P1", "P2"],
  },
  {
    id: "clechh6zx0001ld08qtdcuusq",
    name: "G3",
    weight: 0.6,
    diseases: ["P3"],
  },
];

// rearrange input order
const input2 = [
  {
    id: "clechh6zx0001ld08qtdcuusq",
    name: "G3",
    weight: 0.6,
    diseases: ["P3"],
  },
  {
    id: "clechgh7f0006mo08jxs6k2b7",
    name: "G1",
    weight: 0.8,
    diseases: ["P1", "P2", "P3"],
  },
  {
    id: "clechgv1z0008mo08p1spd33l",
    name: "G2",
    weight: 0.3,
    diseases: ["P1", "P2"],
  },
];

const expectedResult = [
  {
    id: "3",
    name: "multiplyResult",
    diseases: ["P1", "P2"],
    weight: 0.14634146341463414,
  },
  {
    id: "3",
    name: "multiplyResult",
    diseases: ["P3"],
    weight: 0.5121951219512194,
  },
  {
    id: "3",
    name: "multiplyResult",
    diseases: ["P1", "P2", "P3"],
    weight: 0.27317073170731704,
  },
  {
    id: "3",
    name: "multiplyResult",
    diseases: [],
    weight: 0.06829268292682925,
  },
];

// rearrange expected result, but with same values
const expectedResult2 = [
  {
    id: "3",
    name: "multiplyResult",
    diseases: ["P3"],
    weight: 0.5121951219512194,
  },
  {
    id: "3",
    name: "multiplyResult",
    diseases: ["P1", "P2"],
    weight: 0.14634146341463414,
  },
  {
    id: "3",
    name: "multiplyResult",
    diseases: ["P1", "P2", "P3"],
    weight: 0.2731707317073171,
  },
  {
    id: "3",
    name: "multiplyResult",
    diseases: [],
    weight: 0.06829268292682925,
  },
];

describe("run dempster shafer calculation function", () => {
  it("return correct calculation results", () => {
    const result = dempsterShafer(input);

    expect(result).toEqual(expectedResult);
  });

  it("return same correct calculation results despite different input order", () => {
    const result = dempsterShafer(input2);

    expect(result).toEqual(expectedResult2);
  });
});
