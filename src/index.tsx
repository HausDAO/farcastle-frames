import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { request } from "graphql-request";

import { Row, Rows, Text, vars } from "./ui.js";
import { GRAPH_URL } from "./utils/constants.js";
import { GET_DAO } from "./utils/graph-queries.js";
import { ErrorView } from "./components/ErrorView.js";
import { nowInSeconds, parseContent } from "./utils/helpers.js";

// import { neynar } from 'frog/hubs'

export const app = new Frog({
  title: "FARCASTLE",
  browserLocation: "https://farcastle.net/",
  origin: "https://frames.farcastle.net/",
  assetsPath: "/",
  ui: { vars },
});

// dao/0x2105/0x1503bd5f6f082f7fbd36438cc416cd67849c0bec

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

app.frame("/dao/:chainid/:daoid", async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");

  const url = chainid && GRAPH_URL[chainid];

  console.log("chainid", chainid);
  console.log("daoid", daoid);
  console.log("url", url);

  // handle error
  // // invalid daoid or chainid
  // // no url

  const daoData = await request<any>(url, GET_DAO, {
    daoid,
    now: nowInSeconds(),
  });

  console.log("daoData", daoData);

  // handle error
  // // no dao data

  if (!daoData.dao) {
    return c.res({
      image: <ErrorView message="Castle Not Found" />,
    });
  }

  const name = daoData.dao.name;
  const vaultCount = daoData.dao.vaults.length || "0";
  const proposalCount = daoData.dao.proposals.length || "0";
  const memberCount = daoData.dao.activeMemberCount;
  // TODO: fallback for missing image
  const profile =
    daoData.dao.profile[0] && parseContent(daoData.dao.profile[0].content);

  console.log("profile", profile);

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
          <Text size="16">active proposals: {proposalCount}</Text>
          <Text size="16">vaults: {vaultCount}</Text>
          {profile?.avatarImg && (
            <img
              src={profile.avatarImg}
              width="300px"
              height="300px"
              style={{ borderRadius: "50%" }}
            />
          )}
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
