export const normalizeCharacters = (string: string): string => {
  let r = string;

  r = r.replace(new RegExp(/\Ξ/g), "E");
  // r = r.replace(new RegExp(/\s/g), "");
  // r = r.replace(new RegExp(/[àáâãäå]/g), "a");
  // r = r.replace(new RegExp(/æ/g), "ae");
  // r = r.replace(new RegExp(/ç/g), "c");
  // r = r.replace(new RegExp(/[èéêë]/g), "e");
  // r = r.replace(new RegExp(/[ìíîï]/g), "i");
  // r = r.replace(new RegExp(/ñ/g), "n");
  // r = r.replace(new RegExp(/[òóôõö]/g), "o");
  // r = r.replace(new RegExp(/œ/g), "oe");
  // r = r.replace(new RegExp(/[ùúûü]/g), "u");
  // r = r.replace(new RegExp(/[ýÿ]/g), "y");
  // r = r.replace(new RegExp(/\W/g), "");
  return r;
};
export const truncateString = (string: string, length: number) =>
  `${string.slice(0, length)} ...`;

export const formatDaoName = (name?: string) => {
  if (!name) return "-";
  return normalizeCharacters(name);
};
export const formatDaoDescription = (description?: string) => {
  if (!description) return "-";
  const normal = normalizeCharacters(description);
  return normal.length > 125
    ? truncateString(normalizeCharacters(description), 125)
    : normal;
};
