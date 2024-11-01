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

// @ts-ignore
export const voteFrame = async (c) => {
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

  const proposalData = await request<any>(url, GET_PROPOSAL_VOTES, {
    daoid,
    proposalid,
  });

  const proposal = proposalData.proposals[0];

  if (!proposal) {
    return c.res({
      image: <ErrorView message="Proposal Not Found" />,
    });
  }

  const status = getProposalStatus(proposal);
  const yes = voteCount(proposal.yesBalance);
  const no = voteCount(proposal.noBalance);
  const title = formatProposalTitle(proposal.title);
  const proposalType = getProposalTypeLabel(proposal.proposalType);

  let statusText: string = status;
  if (status === PROPOSAL_STATUS.voting) {
    const votingEnds = formatShortDateTimeFromSeconds(proposal.votingEnds);
    statusText = `Voting open until ${votingEnds}`;
  }
  if (status === PROPOSAL_STATUS.grace) {
    const graceEnds = formatShortDateTimeFromSeconds(proposal.graceEnds);
    statusText = `In grace period until ${graceEnds}`;
  }

  let intents: FrameIntent | FrameIntent[] = [
    <Button.Link
      href={`https://admin.daohaus.club/#/molochv3/${chainid}/${daoid}/proposal/${proposalid}`}
    >
      Details
    </Button.Link>,
    <Button action={`/molochv3/${chainid}/${daoid}/proposals/${proposalids}`}>
      Back
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
        target={`/tx/vote/${chainid}/${daoid}/${proposalid}/false`}
      >
        No
      </Button.Transaction>,
      ...intents,
    ];
  }
  if (status === PROPOSAL_STATUS.needsProcessing) {
    intents = [
      <Button.Transaction
        target={`/tx/execute/${chainid}/${daoid}/${proposalid}`}
      >
        Execute
      </Button.Transaction>,
      ...intents,
    ];
  }

  return c.res({
    action: `/success/vote/${chainid}/${daoid}`,
    image: (
      <VoteView
        proposalid={proposalid}
        yes={yes}
        no={no}
        name={title}
        proposalType={proposalType}
        status={statusText}
        executable={status === PROPOSAL_STATUS.needsProcessing}
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

  const voteValue = approved === "true";

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
    args: [Number(proposalid), voteValue],
    to: daoid as `0x${string}`,
  });
};
