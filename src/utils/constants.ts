import "dotenv/config";

import { vars } from "../ui";

type KEYCHAIN = {
  [key: string]: string;
};

export const GRAPH_URL = (chainId: string, graphKey: string) => {
  const urls: KEYCHAIN = {
    "0xa": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/CgH5vtz9CJPdcSmD3XEh8fCVDjQjnRwrSawg71T1ySXW`,
    "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW`,
  };
  return urls[chainId];
};

export const FROG_APP_CONFIG = {
  title: "FARCASTLE",
  browserLocation: "https://farcastle.net/",
  origin: "https://frames.farcastle.net/",
  assetsPath: "/",
  ui: { vars },
};
