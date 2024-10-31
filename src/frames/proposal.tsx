import { Button } from "frog";
import { request } from "graphql-request";

import { GRAPH_URL, TX_CHAIN_ID } from "../utils/constants.js";
import {
  GET_DAO,
  GET_PROPOSAL,
  GET_PROPOSAL_DATA,
} from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { isChainId, isAddress, isNumberish } from "../utils/validators.js";
import { ProposalView } from "../components/ProposalView.js";
import {
  formatProposalDescription,
  formatProposalTitle,
  formatShortDateTimeFromSeconds,
  getProposalTypeLabel,
} from "../utils/dao-data-formatters.js";
import { nowInSeconds, truncateAddress } from "../utils/helpers.js";
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
  const description = formatProposalDescription(proposal.description);
  const votingEnds = formatShortDateTimeFromSeconds(proposal.votingEnds);
  const submittedBy = truncateAddress(proposal.proposedBy);

  const nextProposalid = idArr[1];
  const remainingids = nextProposalid && idArr.slice(1, idArr.length);

  // if first prop id is

  let intents = [
    <Button
      action={`/molochv3/${chainid}/${daoid}/proposals/${proposalid}/vote`}
    >
      Votes
    </Button>,
  ];

  if (nextProposalid) {
    intents.push(
      <Button
        action={`/molochv3/${chainid}/${daoid}/proposals/${remainingids.join(
          ","
        )}`}
      >
        Next
      </Button>
    );
  }

  intents.push(
    <Button.Link
      href={`https://admin.daohaus.club/#/molochv3/${chainid}/${daoid}`}
    >
      Details
    </Button.Link>,
    <Button action={`/molochv3/${chainid}/${daoid}`}>DAO Home</Button>
  );

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

// ?/ TODO: how to deal with cached active proposal count

// @ts-ignore
// export const proposalsFrame = async (c) => {
//   const chainid = c.req.param("chainid");
//   const daoid = c.req.param("daoid");

//   // @ts-ignore
//   const graphKey = c.env?.GRAPH_KEY || process.env.GRAPH_KEY;
//   const url = chainid && GRAPH_URL(chainid, graphKey);
//   const validDaoid = isAddress(daoid);
//   const validChainid = isChainId(chainid);

//   if (!validDaoid || !validChainid || !url) {
//     return c.res({
//       image: <ErrorView message="Invalid Params" />,
//     });
//   }

//   const daoData = await request<any>(url, GET_DAO, {
//     daoid,
//     now: Math.floor(nowInSeconds()).toString(),
//   });

//   if (!daoData.dao) {
//     return c.res({
//       image: <ErrorView message="DAO Not Found" />,
//     });
//   }

//   const activeProposalCount = daoData.dao.proposals.length || "0";

//   const nextProposalId =
//     Number(activeProposalCount) && Number(daoData.dao.proposals[0].proposalId);
//   const proposalIds =
//     nextProposalId &&
//     daoData.dao.proposals.map((p: { proposalId: string }) => p.proposalId);

//   // if no active - intent back to dao, intent to view all proposals on daohaus
//   // // message

//   // if active send to other proposal frame?

//   let intents = [
//     <Button.Link
//       href={`https://admin.daohaus.club/#/molochv3/${chainid}/${daoid}`}
//     >
//       on DAOhaus
//     </Button.Link>,
//   ];

//   if (nextProposalId > 0) {
//     intents = [
//       <Button action={`/proposal/${chainid}/${daoid}/${proposalIds.join(",")}`}>
//         {`${activeProposalCount} Active Proposal${
//           activeProposalCount > 1 ? "s" : ""
//         }`}
//       </Button>,
//       ...intents,
//     ];
//   }

//   return c.res({
//     image: (
//       <DaoView
//         name={name}
//         description={description}
//         memberCount={memberCount}
//         vaultCount={vaultCount}
//         proposalCount={proposalCount}
//         img={daoImg}
//       />
//     ),
//     intents,
//   });
// };
