export function priceStringToNumber(priceString: string) {
  priceString = priceString.replace(/\s/g, "");

  while (isNaN(Number(priceString))) {
    priceString = priceString.slice(0, -1);
  }

  const price = Number(priceString);
  if (price === 0) throw new Error("Unable to parse string as Number.");
  return price;
}
