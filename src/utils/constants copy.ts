export function GRAPH_ENDPOINT(graphKey: string): string {
  return `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/6vyAqRpCyrhLsfd6TfYAssvKywKhxJykkDbPxJZ4ZcEr`;
}

export function DH_GRAPH_ENDPOINT(graphKey: string): string {
  return `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW`;
}

type KEYCHAIN = {
  [key: string]: string;
};

export const GRAPH_URL: KEYCHAIN = {
  "0xa": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/55wEbRchfvjtWsy5NqLc4hp9C7xbX9yk8bAr3UQA8F7x`,

  "0x2105": `https://gateway-arbitrum.network.thegraph.com/api/${
    import.meta.env.VITE_YEETER_GRAPH_API_KEY
  }/subgraphs/id/6vyAqRpCyrhLsfd6TfYAssvKywKhxJykkDbPxJZ4ZcEr`,
};
