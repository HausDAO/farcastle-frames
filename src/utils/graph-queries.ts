import { gql } from "graphql-request";

export const GET_DAO = gql`
  query dao($daoid: String!, $now: String!) {
    dao(id: $daoid) {
      id
      createdAt
      name
      activeMemberCount
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
      }
    }
  }
`;

// activeProposals: proposals(
//     first: 101
//     orderBy: createdAt
//     orderDirection: desc
//     where: { cancelled: false, sponsored: true, graceEnds_gt: $now }

// profile: records(
//     first: 1
//     orderBy: createdAt
//     orderDirection: desc
//     where: { table: "daoProfile" }
//   ) {
//     createdAt
//     createdBy
//     contentType
//     content
//   }

// vaults (where: {active: true}){
//     id
//     createdAt
//     active
//     ragequittable
//     name
//     safeAddress
//   }
