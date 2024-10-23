import { Button } from "frog";
import { request } from "graphql-request";

import { GRAPH_URL, TX_CHAIN_ID } from "../utils/constants.js";
import { GET_PROPOSAL, GET_PROPOSAL_DATA } from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { isChainId, isAddress, isNumberish } from "../utils/validators.js";
import { ProposalView } from "../components/ProposalView.js";
import {
  formatDaoDescription,
  formatProposalTitle,
  formatShortDateTimeFromSeconds,
  getProposalTypeLabel,
} from "../utils/dao-data-formatters.js";
import { truncateAddress } from "../utils/helpers.js";
import {
  getProposalStatus,
  PROPOSAL_STATUS,
} from "../utils/proposals-status.js";

// @ts-ignore
export const proposalFrame = async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const proposalids = c.req.param("proposalids");
  const idArr = proposalids.split(",");
  const proposalid = idArr[0];

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

  const proposalData = await request<any>(url, GET_PROPOSAL, {
    daoid,
    proposalid,
  });

  const proposal = proposalData.proposals[0];

  if (!proposal) {
    return c.res({
      image: <ErrorView message="Proposal Not Found" />,
    });
  }
  const proposalType = getProposalTypeLabel(proposal.proposalType);
  const title = formatProposalTitle(proposal.title);
  const description = formatDaoDescription(proposal.description);
  const createdAt = formatShortDateTimeFromSeconds(proposal.createdAt);
  const votingEnds = formatShortDateTimeFromSeconds(proposal.votingEnds);
  const graceEnds = formatShortDateTimeFromSeconds(proposal.graceEnds);
  const submittedBy = truncateAddress(proposal.proposedBy);

  const nextProposalid = idArr[1];
  const remainingids = nextProposalid && idArr.slice(1, idArr.length);

  const status = getProposalStatus(proposal);

  let intents = [
    <Button action={`/vote/${chainid}/${daoid}/${proposalid}`}>Vote</Button>,
  ];

  console.log("status", status);

  if (status === PROPOSAL_STATUS.needsProcessing) {
    intents.push(
      <Button.Transaction
        target={`/tx/execute/${chainid}/${daoid}/${proposalid}`}
      >
        Execute
      </Button.Transaction>
    );
  }

  if (nextProposalid) {
    intents.push(
      <Button
        action={`/proposal/${chainid}/${daoid}/${remainingids.join(",")}`}
      >
        Next
      </Button>
    );
  }
  intents.push(
    <Button action={`/dao/${chainid}/${daoid}`}>Back to DAO</Button>
  );

  return c.res({
    action: "/success/execute",
    image: (
      <ProposalView
        proposalid={proposalid}
        proposalType={proposalType}
        createdAt={createdAt}
        name={title}
        description={description}
        submittedBy={submittedBy}
        votingEnds={votingEnds}
        graceEnds={graceEnds}
      />
    ),
    intents,
  });
};

// @ts-ignore
export const executeTransaction = async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const proposalid = c.req.param("proposalid");

  // @ts-ignore
  const graphKey = c.env?.GRAPH_KEY || process.env.GRAPH_KEY;
  const url = chainid && GRAPH_URL(chainid, graphKey);

  const prop = await request<any>(url, GET_PROPOSAL_DATA, {
    daoid,
    proposalid,
  });

  const proposalData = prop.proposals[0].proposalData;

  return c.contract({
    abi: [
      {
        inputs: [
          { internalType: "uint32", name: "id", type: "uint32" },
          { internalType: "bytes", name: "proposalData", type: "bytes" },
        ],
        name: "processProposal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    chainId: TX_CHAIN_ID[chainid],
    functionName: "processProposal",
    args: [proposalid, proposalData],
    to: daoid as `0x${string}`,
  });
};
