import "dotenv/config";

type KEYCHAIN = {
  [key: string]: string;
};

console.log("process.env.GRAPH_KEY", process.env.GRAPH_KEY);

export const GRAPH_URL: KEYCHAIN = {
  "0xa": `https://gateway-arbitrum.network.thegraph.com/api/${process.env.GRAPH_KEY}/subgraphs/id/CgH5vtz9CJPdcSmD3XEh8fCVDjQjnRwrSawg71T1ySXW`,

  "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${process.env.GRAPH_KEY}/subgraphs/id/7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW`,
};
