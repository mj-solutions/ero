import { priceStringToNumber } from "./price-string-to-number";

describe("priceStringToNumber", () => {
  it("Should throw on invalid input", () => {
    const shouldThrow = "g1 990";

    expect(() => priceStringToNumber(shouldThrow)).toThrowError();
  });

  it("Should return a number when input string is valid", () => {
    const shouldParse = [
      "1 990 kr",
      "1 990:-",
      "1 990,00 kr",
      "1 990,00",
      "1 990.00",
      "1 990 kr1 990 kr",
    ];
    shouldParse.forEach((priceString) =>
      expect(priceStringToNumber(priceString)).toBe(1990)
    );
  });
});
