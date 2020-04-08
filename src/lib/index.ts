export let formattedNumber = (num: number | null): string => {
  if (num === null) {
    return "";
  }

  let str = num.toString().split(".")[0];
  let length = str.length;

  // @ts-ignore
  return [...str]
    .reduceRight(
      (formattedStr, char, index) =>
        (length - index) % 3 === 0 && index !== 0
          ? [...formattedStr, "," + char]
          : [...formattedStr, char],
      []
    )
    .reverse()
    .join("");
};
