import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { request } from "graphql-request";

import { Row, Rows, Text, vars } from "./ui.js";
import { GRAPH_URL } from "./utils/constants.js";
import { GET_PROPOSAL } from "./utils/graph-queries.js";
import { ErrorView } from "./components/ErrorView.js";
import { isChainId, isAddress, isNumberish } from "./utils/validators.js";

// import { neynar } from 'frog/hubs'

export const app = new Frog({
  title: "FARCASTLE",
  browserLocation: "https://farcastle.net/",
  origin: "https://frames.farcastle.net/",
  assetsPath: "/",
  ui: { vars },
});

//  0x2105/0x1503bd5f6f082f7fbd36438cc416cd67849c0bec/6

app.frame("/", (c) => {
  return c.res({
    image: (
      <Rows grow>
        <Row
          backgroundColor="darkPurple"
          color="white"
          textAlign="center"
          textTransform="uppercase"
          alignHorizontal="center"
          alignVertical="center"
        >
          <Text size="48">Farcastle Proposal</Text>
        </Row>
      </Rows>
    ),
    intents: [],
  });
});

app.frame("/:chainid/:daoid/:proposalid", async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const proposalid = c.req.param("proposalid");

  const graphKey = c.env?.GRAPH_KEY || process.env.GRAPH_KEY;
  const url = chainid && GRAPH_URL(chainid, graphKey);

  const validDaoid = isAddress(daoid);
  const validChainid = isChainId(chainid);
  const validProposalid = isNumberish(proposalid);

  if (!validDaoid || !validChainid || !validProposalid || !url) {
    return c.res({
      image: <ErrorView message="Invalid Params" />,
    });
  }

  const proposalData = await request<any>(url, GET_PROPOSAL, {
    daoid,
    proposalid,
  });

  console.log("proposalData", proposalData);
  const proposal = proposalData.proposals[0];

  if (!proposal) {
    return c.res({
      image: <ErrorView message="Proposal Not Found" />,
    });
  }

  const createdAt = proposal.createdAt;

  return c.res({
    image: (
      <Rows grow>
        <Row
          backgroundColor="darkPurple"
          color="white"
          textAlign="center"
          textTransform="uppercase"
          alignHorizontal="center"
          alignVertical="center"
        >
          <Text size="24">Proposal {proposalid}</Text>
          <Text size="16">{daoid}</Text>
          <Text size="16">on {chainid}</Text>
          <Text size="16">at {createdAt}</Text>
        </Row>
      </Rows>
    ),
    intents: [],
  });
});

const isCloudflareWorker = typeof caches !== "undefined";
if (isCloudflareWorker) {
  const manifest = await import("__STATIC_CONTENT_MANIFEST");
  const serveStaticOptions = { manifest, root: "./" };
  app.use("/*", serveStatic(serveStaticOptions));
  devtools(app, { assetsPath: "/frog", serveStatic, serveStaticOptions });
} else {
  devtools(app, { serveStatic });
}

export default app;
