import { gql } from "graphql-request";

export const GET_DAO = gql`
  query dao($daoid: String!) {
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
        where: {
          cancelled: false
          sponsored: true
          processed: false
          actionFailed: false
        }
      ) {
        id
        proposalId
        proposalType
        title
        description
        noBalance
        yesBalance
        currentlyPassing
        graceEnds
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
