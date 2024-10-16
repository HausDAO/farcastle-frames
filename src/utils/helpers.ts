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
