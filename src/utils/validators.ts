const ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
const VALID_CHAINS = ["0x2105", "0xa"];

export type EthAddress = `0x${string}`;

export const isAddress = (id: string) => {
  return id.match(ADDRESS_REGEX);
};
export const isChainId = (id: string) => {
  return VALID_CHAINS.includes(id.toLowerCase());
};
export const isArray = (item: unknown): item is unknown[] =>
  Array.isArray(item);
export const isNumber = (item: unknown): item is number =>
  typeof item === "number";
export const isString = (item: unknown): item is string =>
  typeof item === "string";
export const isBoolean = (item: unknown): item is boolean =>
  typeof item === "boolean";
export const isNumberish = (item: unknown): item is string | number =>
  isNumber(item) || isNumberString(item);
export const isObject = (item: unknown) => {
  if (item instanceof Object) return true;
  try {
    if (isString(item)) {
      JSON.parse(item as string);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
export const isNumberString = (item: unknown) =>
  isString(item) && !isNaN(parseFloat(item)) && isFinite(Number(item));
export const isLengthOf = (item: unknown, length: number) =>
  isArray(item) && item.length === length;
