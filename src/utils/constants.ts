import {
  HAUS_NETWORK_DATA,
  Keychain,
  KeychainList,
  NetworkConfig,
  ValidNetwork,
  getNetworkName,
} from "@daohaus/keychain-utils";

type KEYCHAIN = {
  [key: string]: string;
};

export const GRAPH_URL: KEYCHAIN = {
  "0xaa36a7": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/8Syem3ZN88cut1wL8AqPHNo658Px7M2CkRuHAGuxvf6j`,
  "0x64": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/EGG5xEkiKKtGa9frTfBSmL2w7ZmzPDke5ZuvxDRwQcGe`,
  "0xa": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/55wEbRchfvjtWsy5NqLc4hp9C7xbX9yk8bAr3UQA8F7x`,
  "0xa4b1": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/BeGugH1TsMspZ7Nov1Uq2PQ98X78sqjuEy1JFGLyNgt5`,
  "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/6vyAqRpCyrhLsfd6TfYAssvKywKhxJykkDbPxJZ4ZcEr`,
};

export const YEETER_DAO_REFERRER = "DHOnboarderShamanSummoner";

export const targetNetworks: Keychain<NetworkConfig> = {
  "0xaa36a7": HAUS_NETWORK_DATA["0xaa36a7"],
  "0x64": HAUS_NETWORK_DATA["0x64"],
  "0xa": HAUS_NETWORK_DATA["0xa"],
  "0xa4b1": HAUS_NETWORK_DATA["0xa4b1"],
  "0x2105": HAUS_NETWORK_DATA["0x2105"],
};

export const targetNetworksForSelect = () => {
  return Object.keys(targetNetworks).map((key) => {
    return {
      name: getNetworkName(key)?.toUpperCase(),
      value: key,
    };
  });
};

export const DEFAULT_CHAIN_ID = "0x64";

export const getValidChainId = (chainId?: string) => {
  return targetNetworks[chainId as ValidNetwork]?.chainId || DEFAULT_CHAIN_ID;
};

export const YEETER_CONTRACTS: KeychainList = {
  ONBOARDER_SUMMONER: {
    "0x64": "0x313f9A3C9A5041e9be00cf88b18962581A4eFb35",
    "0xa": "0x2875aEbb4472E5E579a2A5290c7B5A3C90484D5F",
    "0xa4b1": "0x2875aEbb4472E5E579a2A5290c7B5A3C90484D5F",
    "0x2105": "0x2875aEbb4472E5E579a2A5290c7B5A3C90484D5F",
    "0xaa36a7": "0x2875aEbb4472E5E579a2A5290c7B5A3C90484D5F",
  },
  ETH_YEETER_SINGLETON: {
    "0x64": "0xbe056B4187387D1Cb503370FeA2815e42981DfdF",
    "0xa": "0x8D60971eFf778966356c1cADD76d525E7B25cc6b",
    "0xa4b1": "0x8D60971eFf778966356c1cADD76d525E7B25cc6b",
    "0x2105": "0x8D60971eFf778966356c1cADD76d525E7B25cc6b",
    "0xaa36a7": "0x62fF4Ca410E9e58f5ce8B2Ad03695EF0ad990381",
  },
};

export const YEETER_SHAMAN_PERMISSIONS = "2";
export const DEFAULT_YEETER_VALUES = {
  isShares: false,
  feeRecipients: ["0xD0f8720846890a7961945261FE5012E4cA39918e"],
  feeAmounts: ["30000"],
  lootPerYeet: "100",
  multiplier: "100",
};
export const DEFAULT_SUMMON_VALUES = {
  votingPeriodInSeconds: 43200,
  gracePeriodInSeconds: 21600,
  newOffering: "0",
  quorum: "0",
  sponsorThreshold: "1000000000000000000",
  minRetention: "66",
  votingTransferable: false,
  nvTransferable: false,
  shareAmounts: "1000000000000000000",
};
