import { Button } from "frog";
import { request } from "graphql-request";

import { GRAPH_URL, TX_CHAIN_ID } from "../utils/constants.js";
import { GET_PROPOSAL, GET_PROPOSAL_DATA } from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { isChainId, isAddress, isNumberish } from "../utils/validators.js";
import { ProposalView } from "../components/ProposalView.js";
import {
  formatProposalDescription,
  formatProposalTitle,
  formatShortDateTimeFromSeconds,
  getProposalTypeLabel,
} from "../utils/dao-data-formatters.js";
import { truncateAddress } from "../utils/helpers.js";

// @ts-ignore
export const proposalFrame = async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const proposalids = c.req.param("proposalids");
  const idArr = proposalids.split("_");
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
  const description = formatProposalDescription(proposal.description);
  const votingEnds = formatShortDateTimeFromSeconds(proposal.votingEnds);
  const submittedBy = truncateAddress(proposal.proposedBy);

  const nextProposalid =
    idArr[1] &&
    idArr[1].split(",")[idArr[1].split(",").indexOf(proposalid) + 1];

  let intents = [
    <Button
      action={`/molochv3/${chainid}/${daoid}/proposals/${proposalids}/vote`}
    >
      Votes
    </Button>,
    <Button.Link
      href={`https://admin.daohaus.club/#/molochv3/${chainid}/${daoid}/proposal/${proposalid}`}
    >
      Details
    </Button.Link>,
  ];

  const previousProposalid =
    idArr[1] &&
    idArr[1].split(",")[idArr[1].split(",").indexOf(proposalid) - 1];

  if (previousProposalid) {
    intents.push(
      <Button
        action={`/molochv3/${chainid}/${daoid}/proposals/${previousProposalid}_${idArr[1]}`}
      >
        Back
      </Button>
    );
  }

  if (nextProposalid) {
    intents.push(
      <Button
        action={`/molochv3/${chainid}/${daoid}/proposals/${nextProposalid}_${idArr[1]}`}
      >
        Next
      </Button>
    );
  }

  if (intents.length < 4) {
    intents.push(
      <Button action={`/molochv3/${chainid}/${daoid}`}>DAO Home</Button>
    );
  }

  return c.res({
    action: "/success/execute",
    image: (
      <ProposalView
        proposalid={proposalid}
        proposalType={proposalType}
        name={title}
        description={description}
        submittedBy={submittedBy}
        votingEnds={votingEnds}
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
