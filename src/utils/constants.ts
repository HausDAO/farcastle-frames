import "dotenv/config";

import { vars } from "../components/ui";

type KEYCHAIN = {
  [key: string]: string;
};

export const GRAPH_URL = (chainId: string, graphKey: string) => {
  const urls: KEYCHAIN = {
    "0xa": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/CgH5vtz9CJPdcSmD3XEh8fCVDjQjnRwrSawg71T1ySXW`,
    "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW`,
    "0x1": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/HouDe2pTdyKM9CTG1aodnPPPhm7U148BCH7eJ4HHwpdQ`,
    "0x64": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/6x9FK3iuhVFaH9sZ39m8bKB5eckax8sjxooBPNKWWK8r`,
    "0xa4b1": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/GPACxuMWrrPSEJpFqupnePJNMfuArpFabrXLnWvXU2bp`,
    "0x89": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/A4su27JYXR5TkPZmiFHzzqMJnmYttfU3FyrdNBDnnu8T`,
  };
  return urls[chainId];
};

type chainIds =
  | "eip155:8453"
  | "eip155:10"
  | "eip155:1"
  | "eip155:100"
  | "eip155:137"
  | "eip155:42161"
  | "eip155:42170"
  | "eip155:84532"
  | "eip155:421614"
  | "eip155:7777777"
  | "eip155:11155111"
  | "eip155:11155420"
  | "eip155:666666666";
export const TX_CHAIN_ID: {
  [key: string]: chainIds;
} = {
  "0xa": "eip155:10",
  "0x2105": "eip155:8453",
  "0x1": "eip155:1",
  "0x64": "eip155:100",
  "0xa4b1": "eip155:42161",
  "0x89": "eip155:137",
};

export const isCloudflareWorker = typeof caches !== "undefined";
const origin = isCloudflareWorker ? "https://frames.farcastle.net" : "";
export const FROG_APP_CONFIG = {
  title: "Farcastle",
  browserLocation: "https://farcastle.net",
  origin,
  assetsPath: "/",
  basePath: "/",
  headers: {
    "cache-control": "max-age=0",
  },
  ui: { vars },
};
