import "dotenv/config";

type KEYCHAIN = {
  [key: string]: string;
};
// console.log("process.env", process.env.LOCAL_DEV);

// if (process.env.DEV_ENV !== "local") {
//   console.log("setting env");
//   process.env.GRAPH_KEY = env.GRAPH_KEY;
// }
// console.log("process.env.GRAPH_KEY", process.env.GRAPH_KEY);

// c.env?.GRAPH_KEY || process.env.GRAPH_KEY;

export const GRAPH_URL = (chainId: string, graphKey: string) => {
  const urls: KEYCHAIN = {
    "0xa": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/CgH5vtz9CJPdcSmD3XEh8fCVDjQjnRwrSawg71T1ySXW`,
    "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW`,
  };
  return urls[chainId];
};

// export const GRAPH_URL: KEYCHAIN = {
//   "0xa": `https://gateway-arbitrum.network.thegraph.com/api/${process.env.GRAPH_KEY}/subgraphs/id/CgH5vtz9CJPdcSmD3XEh8fCVDjQjnRwrSawg71T1ySXW`,

//   "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${process.env.GRAPH_KEY}/subgraphs/id/7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW`,
// };

// export function GRAPH_ENDPOINT(graphKey: string): string {
//   return `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/6vyAqRpCyrhLsfd6TfYAssvKywKhxJykkDbPxJZ4ZcEr`;
// }
