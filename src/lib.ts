export let formattedNumber = (num: number): string => {
  let str = num.toString();
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
