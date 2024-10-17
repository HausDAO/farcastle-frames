import { normalizeCharacters } from "./helpers";

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
