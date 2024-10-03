const ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
const VALID_CHAINS = ["0x2105", "0xa"];

export const isDaoid = (id: string) => {
  return id.match(ADDRESS_REGEX);
};

export const isChainId = (id: string) => {
  return VALID_CHAINS.includes(id.toLowerCase());
};
