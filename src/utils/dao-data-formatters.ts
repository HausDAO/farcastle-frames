import { format } from "date-fns";
import { fromWei } from "./helpers";

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
export const truncateString = (string: string, length: number) => {
  return string.length > length ? `${string.slice(0, length)} ...` : string;
};

export const formatDaoName = (name?: string) => {
  if (!name) return "A DAO with no name";
  return normalizeCharacters(name);
};
export const formatDaoDescription = (description?: string) => {
  if (!description) return "-";
  return truncateString(normalizeCharacters(description), 120);
};

export const formatProposalDescription = (description?: string) => {
  if (!description) return "-";
  return truncateString(normalizeCharacters(description), 145);
};
export const formatDaoImg = (imgPath?: string) => {
  if (!imgPath) return;
  if (!/^https?:\/\//i.test(imgPath)) {
    return "https://" + imgPath;
  }
  return imgPath;
};
export const formatProposalTitle = (title?: string) => {
  if (!title) return "A Proposal with no name";
  return truncateString(normalizeCharacters(title), 25);
};

export const PROPOSAL_TYPE_LABELS: Record<string, string> = {
  SIGNAL: "Signal Proposal",
  ISSUE: "Token Proposal",
  ADD_SHAMAN: "Shaman Proposal",
  TRANSFER_ERC20: "Funding Proposal",
  TRANSFER_NETWORK_TOKEN: "Funding Proposal",
  UPDATE_GOV_SETTINGS: "Governance Proposal",
  TOKEN_SETTINGS: "Token Proposal",
  TOKENS_FOR_SHARES: "Token Proposal",
  GUILDKICK: "Token Proposal",
  WALLETCONNECT: "WalletConnect Proposal",
  MULTICALL: "Multicall Proposal",
  ADD_SIGNER: "Add Safe Signer Proposal",
};
export const getProposalTypeLabel = (
  proposalType: string,
  proposalTypes: Record<string, string> = PROPOSAL_TYPE_LABELS
) => proposalTypes?.[proposalType] || "Unknown Proposal Type";

export const formatDateTimeFromSeconds = (
  seconds: string | undefined
): string | undefined => {
  if (!seconds) {
    return;
  }

  return format(new Date(Number(seconds) * 1000), "h:mm aaa MMMM do y");
};

export const formatShortDateTimeFromSeconds = (
  seconds: string | undefined
): string | undefined => {
  if (!seconds) {
    return;
  }

  return format(new Date(Number(seconds) * 1000), "MMM do, p");
};

export const voteCount = (amt: string): string => {
  // export const fromWei = (amt: string): string => {
  //   return formatEther(BigInt(amt)).toString();
  // };
  const num = Number(fromWei(amt));

  return num.toFixed(2).toString();
};
