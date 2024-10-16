import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { request } from "graphql-request";

import { Row, Rows, Text } from "../components/ui.js";
import { FROG_APP_CONFIG, GRAPH_URL } from "../utils/constants.js";
import { GET_PROPOSAL_VOTES } from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { isChainId, isAddress, isNumberish } from "../utils/validators.js";
import { getProposalStatus } from "../utils/proposals-status.js";

export const app = new Frog(FROG_APP_CONFIG);

app.frame("/", (c) => {
  return c.res({
    image: <ErrorView message="Invalid Proposal Params" />,
    intents: [],
  });
});

// 0x2105/0x1503bd5f6f082f7fbd36438cc416cd67849c0bec/7

app.frame("/:chainid/:daoid/:proposalid/", async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const proposalid = c.req.param("proposalid");

  // @ts-ignore
  const graphKey = c.env?.GRAPH_KEY || process.env.GRAPH_KEY;
  const url = chainid && GRAPH_URL(chainid, graphKey);

  console.log("url", url);

  const validDaoid = isAddress(daoid);
  const validChainid = isChainId(chainid);
  const validProposalid = isNumberish(proposalid);

  if (!validDaoid || !validChainid || !validProposalid || !url) {
    return c.res({
      image: <ErrorView message="Invalid Params" />,
    });
  }

  const proposalData = await request<any>(url, GET_PROPOSAL_VOTES, {
    daoid,
    proposalid,
  });

  const proposal = proposalData.proposals[0];

  console.log("proposal", proposal);

  const status = getProposalStatus(proposal);

  if (!proposal) {
    return c.res({
      image: <ErrorView message="Proposal Not Found" />,
    });
  }

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
          <Text size="16">status: {status}</Text>
        </Row>
      </Rows>
    ),
    intents: [],
  });
});

const isCloudflareWorker = typeof caches !== "undefined";
if (isCloudflareWorker) {
  // @ts-ignore
  const manifest = await import("__STATIC_CONTENT_MANIFEST");
  const serveStaticOptions = { manifest, root: "./" };
  app.use("/*", serveStatic(serveStaticOptions));
  devtools(app, { assetsPath: "/", serveStatic, serveStaticOptions });
} else {
  devtools(app, { serveStatic });
}

export default app;
