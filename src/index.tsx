import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { Row, Rows, Text, vars } from "./ui.js";
import { GRAPH_URL } from "./utils/constants.js";
import { postData } from "./utils/helpers.js";
import { daoHomeQuery } from "./utils/graph-queries.js";
import { ErrorView } from "./components/ErrorView.js";

// import { neynar } from 'frog/hubs'

export const app = new Frog({
  title: "FARCASTLE",
  browserLocation: "https://farcastle.net/",
  origin: "https://frames.farcastle.net/",
  assetsPath: "/",
  ui: { vars },
});

app.frame("/", (c) => {
  return c.res({
    image: (
      <Rows grow>
        <Row
          backgroundColor="darkPurple"
          color="white"
          textAlign="center"
          textTransform="uppercase"
          alignHorizontal="center"
          alignVertical="center"
        >
          <Text size="48">Farcastle</Text>
        </Row>
      </Rows>
    ),
    intents: [],
  });
});

app.frame("/:chainid/:daoid", async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");

  const url = GRAPH_URL[chainid];

  console.log("chainid", chainid);
  console.log("daoid", daoid);
  console.log("url", url);

  // handle error
  // // invalid daoid or chainid
  // // no url

  const daoData = await postData(url, {
    query: daoHomeQuery(daoid),
  });

  console.log("daoData", daoData);

  // handle error
  // // no dao data

  if (!daoData.data.dao) {
    return c.res({
      image: <ErrorView message="Castle Not Found" />,
    });
  }

  const name = daoData.data.dao.name;
  const vaultCount = daoData.data.dao.vaults.length;
  const proposalCount = daoData.data.dao.proposalCount;
  const memberCount = daoData.data.dao.activeMemberCount;

  return c.res({
    image: (
      <Rows grow>
        <Row
          backgroundColor="darkPurple"
          color="white"
          textAlign="center"
          textTransform="uppercase"
          alignHorizontal="center"
          alignVertical="center"
        >
          <Text size="24">Your Castle</Text>
          <Text size="16">{daoid}</Text>
          <Text size="16">on {chainid}</Text>
          <Text size="16">{name}</Text>
          <Text size="16">member: {memberCount}</Text>
          <Text size="16">proposals: {proposalCount}</Text>
          <Text size="16">vaults: {vaultCount}</Text>
        </Row>
      </Rows>
    ),
    intents: [],
  });
});

const isCloudflareWorker = typeof caches !== "undefined";
if (isCloudflareWorker) {
  const manifest = await import("__STATIC_CONTENT_MANIFEST");
  const serveStaticOptions = { manifest, root: "./" };
  app.use("/*", serveStatic(serveStaticOptions));
  devtools(app, { assetsPath: "/frog", serveStatic, serveStaticOptions });
} else {
  devtools(app, { serveStatic });
}

export default app;
