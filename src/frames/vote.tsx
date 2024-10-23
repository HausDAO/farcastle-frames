import { Button, FrameIntent } from "frog";
import { request } from "graphql-request";

import { GRAPH_URL, TX_CHAIN_ID } from "../utils/constants.js";
import { GET_PROPOSAL_VOTES } from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { isChainId, isAddress, isNumberish } from "../utils/validators.js";
import {
  getProposalStatus,
  PROPOSAL_STATUS,
} from "../utils/proposals-status.js";
import { VoteView } from "../components/VoteView.js";
import {
  formatProposalTitle,
  formatShortDateTimeFromSeconds,
  getProposalTypeLabel,
  voteCount,
} from "../utils/dao-data-formatters.js";

// TODO: find out of user is a member
// intents based on in voting

// @ts-ignore
export const voteFrame = async (c) => {
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

  // console.log("proposal", proposal);

  if (!proposal) {
    return c.res({
      image: <ErrorView message="Proposal Not Found" />,
    });
  }

  const status = getProposalStatus(proposal);
  const yes = voteCount(proposal.yesBalance);
  const no = voteCount(proposal.noBalance);
  const title = formatProposalTitle(proposal.title);
  const createdAt = formatShortDateTimeFromSeconds(proposal.createdAt);
  const proposalType = getProposalTypeLabel(proposal.proposalType);

  console.log("status", status);
  // console.log("PROPOSAL_STATUS.voting", PROPOSAL_STATUS.voting);

  let intents: FrameIntent | FrameIntent[] = [
    <Button action={`/proposal/${chainid}/${daoid}/${proposalid}`}>
      Proposal
    </Button>,
  ];
  if (status === PROPOSAL_STATUS.voting) {
    intents = [
      <Button.Transaction
        target={`/tx/vote/${chainid}/${daoid}/${proposalid}/true`}
      >
        Yes
      </Button.Transaction>,
      <Button.Transaction
        target={`/tx/${chainid}/${daoid}/${proposalid}/false`}
      >
        No
      </Button.Transaction>,
      ...intents,
    ];
  }

  return c.res({
    action: "/success/vote",
    image: (
      <VoteView
        proposalid={proposalid}
        yes={yes}
        no={no}
        name={title}
        createdAt={createdAt}
        proposalType={proposalType}
      />
    ),
    intents,
  });
};

// @ts-ignore
export const voteTransaction = (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");
  const proposalid = c.req.param("proposalid");
  const approved = c.req.param("approved");

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
};
