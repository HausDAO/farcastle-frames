import { Button } from "frog";
import { request } from "graphql-request";

import { GRAPH_URL } from "../utils/constants.js";
import { GET_PROPOSAL } from "../utils/graph-queries.js";
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

  let intents = [
    <Button action={`/vote/${chainid}/${daoid}/${proposalid}`}>Vote</Button>,
  ];

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
