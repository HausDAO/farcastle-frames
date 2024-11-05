import { gql } from "graphql-request";

export const GET_DAO = gql`
  query dao($daoid: String!, $now: String!) {
    dao(id: $daoid) {
      id
      createdAt
      name
      activeMemberCount
      proposalCount
      vaults(where: { active: true }) {
        id
      }
      proposals(
        first: 101
        orderBy: createdAt
        orderDirection: desc
        where: { cancelled: false, sponsored: true, graceEnds_gt: $now }
      ) {
        id
        proposalId
        proposalType
        title
        description
      }
      profile: records(
        first: 1
        orderBy: createdAt
        orderDirection: desc
        where: { table: "daoProfile" }
      ) {
        content
      }
    }
  }
`;

export const GET_PROPOSALS = gql`
  query proposals($daoid: String!, $skip: Int!, $now: String!) {
    proposals(
      first: 3
      skip: $skip
      orderBy: createdAt
      orderDirection: desc
      where: {
        dao: $daoid
        sponsored: true
        cancelled: false
        graceEnds_gt: $now
      }
    ) {
      id
      createdAt
      proposalId
    }
  }
`;

export const GET_PROPOSAL = gql`
  query proposal($daoid: String!, $proposalid: String!) {
    proposals(where: { proposalId: $proposalid, dao: $daoid }) {
      createdAt
      proposalId
      proposalType
      title
      description
      graceEnds
      votingStarts
      votingEnds
      proposedBy
      sponsored
      cancelled
      passed
      actionFailed
      expiration
      votingPeriod
      gracePeriod
      processed
      noBalance
      yesBalance
    }
  }
`;

export const GET_PROPOSAL_DATA = gql`
  query proposal($daoid: String!, $proposalid: String!) {
    proposals(where: { proposalId: $proposalid, dao: $daoid }) {
      proposalData
    }
  }
`;

export const GET_PROPOSAL_VOTES = gql`
  query proposal($daoid: String!, $proposalid: String!) {
    proposals(where: { proposalId: $proposalid, dao: $daoid }) {
      id
      createdAt
      title
      proposalType
      sponsored
      cancelled
      passed
      actionFailed
      processed
      votingStarts
      votingEnds
      expiration
      graceEnds
      votingPeriod
      gracePeriod
      yesBalance
      noBalance
      maxTotalSharesAndLootAtYesVote
      dao {
        minRetentionPercent
        totalShares
        quorumPercent
      }
    }
  }
`;
