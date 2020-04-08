export let formattedNumber = (num: number): string => {
  let str = num.toString();
  let length = str.length;
  let commas = str.length % 3;

  // @ts-ignore
  return [...str]
    .reduceRight(
      (formattedStr, char, index) =>
        (index + 1) % 3 === 0
          ? [...formattedStr, "," + char]
          : [...formattedStr, char],
      []
    )
    .reverse()
    .join("");
};
