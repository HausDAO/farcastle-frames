import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { request } from "graphql-request";

import { Row, Rows, Text, VStack } from "../components/ui.js";
import { FROG_APP_CONFIG, GRAPH_URL } from "../utils/constants.js";
import { GET_PROPOSALS } from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { isChainId, isAddress, isNumberish } from "../utils/validators.js";
import { nowInSeconds } from "../utils/helpers.js";

const PER_PAGE = 2;

export const app = new Frog(FROG_APP_CONFIG);

// proposals/0x2105/0x43188a21e27482a7a1a13b1022b4e4050a981f5b/0

app.frame("/", (c) => {
  return c.res({
    image: <ErrorView message="Invalid Proposal Params" />,
    intents: [],
  });
});

app.frame("/:chainid/:daoid/:page", async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const page = c.req.param("page");

  // @ts-ignore
  const graphKey = c.env?.GRAPH_KEY || process.env.GRAPH_KEY;
  const url = chainid && GRAPH_URL(chainid, graphKey);

  const validDaoid = isAddress(daoid);
  const validChainid = isChainId(chainid);
  const validPage = isNumberish(page);

  if (!validDaoid || !validChainid || !validPage || !url) {
    return c.res({
      image: <ErrorView message="Invalid Params" />,
    });
  }

  const skip = Number(page) * PER_PAGE;

  const proposalData = await request<any>(url, GET_PROPOSALS, {
    daoid,
    now: Math.floor(nowInSeconds()).toString(),
    skip,
  });

  console.log("proposalData", proposalData);

  const proposals = proposalData.proposals;

  if (!proposals.length) {
    return c.res({
      image: <ErrorView message="Proposals Not Found" />,
    });
  }

  const hasNext = proposals.length > PER_PAGE;
  const hasPrevious = Number(page) > 0;

  const viewProposals =
    proposals.length != 1
      ? proposals.slice(0, proposals.length - 1)
      : proposals;

  const propList = viewProposals.map((prop: { proposalId: string }) => {
    return <Text size="18">ProposalId {prop.proposalId}</Text>;
  });

  let intents = [];
  if (hasPrevious) {
    intents.push(
      <Button action={`/${chainid}/${daoid}/${Number(page) - 1}`}>
        Previous
      </Button>
    );
  }
  if (hasNext) {
    intents.push(
      <Button action={`/${chainid}/${daoid}/${page + 1}`}>Next</Button>
    );
  }

  return c.res({
    image: (
      <Rows grow>
        <Row
          backgroundColor="darkPurple"
          color="moonstone"
          textAlign="center"
          textTransform="uppercase"
          alignHorizontal="center"
          alignVertical="center"
        >
          <Text size="24">Proposal page: {Number(page) + 1}</Text>
          <VStack gap="2">{propList}</VStack>
        </Row>
      </Rows>
    ),
    intents,
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
