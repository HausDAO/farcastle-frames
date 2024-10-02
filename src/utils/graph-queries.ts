export const daoHomeQuery = (daoid: string) =>
  `{dao(id: "${daoid.toLowerCase()}") {id name proposalCount activeMemberCount vaults (where: {active: true}) { id }}}`;

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
