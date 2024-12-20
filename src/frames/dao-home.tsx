import { Button } from "frog";
import { request } from "graphql-request";

import { GRAPH_URL } from "../utils/constants.js";
import { GET_DAO } from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { parseContent } from "../utils/helpers.js";
import { isChainId, isAddress } from "../utils/validators.js";
import { DaoView } from "../components/DaoView.js";
import {
  formatDaoDescription,
  formatDaoImg,
  formatDaoName,
} from "../utils/dao-data-formatters.js";
import { filterActive } from "../utils/proposals-status.js";

// @ts-ignore
export const daoHomeFrame = async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");

  // @ts-ignore
  const graphKey = c.env?.GRAPH_KEY || process.env.GRAPH_KEY;
  const url = chainid && GRAPH_URL(chainid, graphKey);
  const validDaoid = isAddress(daoid);
  const validChainid = isChainId(chainid);

  if (!validDaoid || !validChainid || !url) {
    return c.res({
      image: <ErrorView message="Invalid Params" />,
    });
  }

  const daoData = await request<any>(url, GET_DAO, {
    daoid,
  });

  if (!daoData.dao) {
    return c.res({
      image: <ErrorView message="DAO Not Found" />,
    });
  }

  const name = formatDaoName(daoData.dao.name);
  const proposals = filterActive(daoData.dao.proposals);
  const activeProposalCount = proposals.length || "0";
  const proposalCount = daoData.dao.proposalCount;
  const vaultCount = daoData.dao.vaults.length || "0";
  const memberCount = daoData.dao.activeMemberCount;
  const profile =
    daoData.dao.profile[0] && parseContent(daoData.dao.profile[0].content);
  const description = formatDaoDescription(profile?.description);
  const daoImg = formatDaoImg(profile?.avatarImg);

  const nextProposalId =
    Number(activeProposalCount) && Number(proposals[0].proposalId);
  const proposalIds = nextProposalId && proposals.map((p) => p.proposalId);

  let proposalParams;
  if (Number(activeProposalCount) && proposalIds) {
    proposalParams =
      proposalIds.length > 1
        ? `${nextProposalId}_${proposalIds.join(",")}`
        : proposalIds.join(",");
  }

  let intents = [
    <Button.Link
      href={`https://admin.daohaus.club/#/molochv3/${chainid}/${daoid}/members`}
    >
      Members
    </Button.Link>,
    <Button.Link
      href={`https://admin.daohaus.club/#/molochv3/${chainid}/${daoid}/safes`}
    >
      Safes
    </Button.Link>,
  ];

  if (Number(activeProposalCount) > 0) {
    intents = [
      <Button
        action={`/molochv3/${chainid}/${daoid}/proposals/${proposalParams}`}
      >
        {`${activeProposalCount} Active Proposal${
          Number(activeProposalCount) > 1 ? "s" : ""
        }`}
      </Button>,
      ...intents,
    ];
  } else {
    intents = [
      <Button.Link
        href={`https://admin.daohaus.club/#/molochv3/${chainid}/${daoid}/proposals`}
      >
        Proposals
      </Button.Link>,
      ...intents,
    ];
  }

  return c.res({
    image: (
      <DaoView
        name={name}
        description={description}
        memberCount={memberCount}
        vaultCount={vaultCount}
        proposalCount={proposalCount}
        img={daoImg}
      />
    ),
    intents,
  });
};
