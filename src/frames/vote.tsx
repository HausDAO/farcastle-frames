import { Button, FrameIntent, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { request } from "graphql-request";

import { Row, Rows, Text } from "../components/ui.js";
import { FROG_APP_CONFIG, GRAPH_URL, TX_CHAIN_ID } from "../utils/constants.js";
import { GET_PROPOSAL_VOTES } from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { SuccessView } from "../components/SuccessView.js";
import { isChainId, isAddress, isNumberish } from "../utils/validators.js";
import {
  getProposalStatus,
  PROPOSAL_STATUS,
} from "../utils/proposals-status.js";
import { fromWei } from "../utils/helpers.js";

export const app = new Frog(FROG_APP_CONFIG);

app.frame("/", (c) => {
  return c.res({
    image: <ErrorView message="Invalid Proposal Params" />,
    intents: [],
  });
});

// /proposal/0x2105/0x43188a21e27482a7a1a13b1022b4e4050a981f5b/4

app.frame("/:chainid/:daoid/:proposalid/", async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const proposalid = c.req.param("proposalid");

  // @ts-ignore
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

  const proposalData = await request<any>(url, GET_PROPOSAL_VOTES, {
    daoid,
    proposalid,
  });

  const proposal = proposalData.proposals[0];

  console.log("proposal", proposal);

  // display yes v no

  // if status is in voting
  // // find user address to see if voted and if member - might need another query
  // // show button if not
  // else
  // //  display based on status

  // success view not working

  if (!proposal) {
    return c.res({
      image: <ErrorView message="Proposal Not Found" />,
    });
  }

  const status = getProposalStatus(proposal);
  const yes = fromWei(proposal.yesBalance);
  const no = fromWei(proposal.noBalance);

  console.log("status", status);
  console.log("PROPOSAL_STATUS.voting", PROPOSAL_STATUS.voting);

  let intents: FrameIntent | FrameIntent[] = [];
  if (status === PROPOSAL_STATUS.voting) {
    intents = [
      <Button.Transaction target={`/tx/${chainid}/${daoid}/${proposalid}/true`}>
        Yes
      </Button.Transaction>,
      <Button.Transaction
        target={`/tx/${chainid}/${daoid}/${proposalid}/false`}
      >
        No
      </Button.Transaction>,
    ];
  }

  return c.res({
    action: "/success",
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
          <Text size="16">yes: {yes}</Text>
          <Text size="16">no: {no}</Text>
        </Row>
      </Rows>
    ),
    intents,
  });
});

app.transaction("/tx/:chainid/:daoid/:proposalid/:approved", (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const proposalid = c.req.param("proposalid");
  const approved = c.req.param("approved");
  console.log('approved === "true"', approved === "true");

  return c.contract({
    abi: [
      {
        inputs: [
          { internalType: "uint32", name: "id", type: "uint32" },
          { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "submitVote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    chainId: TX_CHAIN_ID[chainid],
    functionName: "submitVote",
    args: [Number(proposalid), approved === "true"],
    to: daoid as `0x${string}`,
  });
});

app.frame("/success", (c) => {
  console.log("yolo");
  return c.res({
    image: <SuccessView message="Your Vote Counted" />,
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
