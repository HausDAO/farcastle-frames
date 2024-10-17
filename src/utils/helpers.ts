import { formatEther } from "viem";

export const postData = async (url = "", data = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (e) {
    console.log("error", e);
    return e;
  }
};

export const nowInSeconds = (): number => new Date().getTime() / 1000;

export const parseContent = (content: string | undefined) => {
  if (content) {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.log("err", e);
      return;
    }
  }
};

export const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;
export const charLimit = (str: string | undefined, limit: number) =>
  str && str.length > limit ? `${str.slice(0, limit)}...` : str;
export const fromWei = (amt: string): string => {
  return formatEther(BigInt(amt)).toString();
};
export const toBigInt = (
  amt?: string | number | boolean | bigint
): bigint | undefined => {
  if (amt) {
    return BigInt(amt as string | number | boolean | bigint);
  }
};
export const isJSON = (obj: unknown) => {
  try {
    JSON.parse(obj as string);
    return true;
  } catch (e) {
    return false;
  }
};
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
