const daoHomeQuery = (daoid: string) =>
  `{dao(id: "${daoid.toLowerCase()}") {id name}}`;
