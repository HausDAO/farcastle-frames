import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { request } from "graphql-request";

import { Row, Rows, Text, vars } from "./ui.js";
import { GRAPH_URL } from "./utils/constants.js";
import { GET_DAO } from "./utils/graph-queries.js";
import { ErrorView } from "./components/ErrorView.js";
import { nowInSeconds, parseContent } from "./utils/helpers.js";
import { isChainId, isAddress } from "./utils/validators.js";

import { app as proposalApp } from "./proposal.js";

// import { neynar } from 'frog/hubs'

// 𝛓ⲧⲟⲛⲉⲕⲉⲉⲣⲉꞅ𝛓

export const app = new Frog({
  title: "FARCASTLE",
  browserLocation: "https://farcastle.net/",
  origin: "https://frames.farcastle.net/",
  assetsPath: "/",
  ui: { vars },
});

app.frame("/", (c) => {
  return c.res({
    image:
      "https://daohaus.mypinata.cloud/ipfs/QmaMUgNbwFpVp7KDLPPUQtuJfZ9GaySNBd6D74bizLLhsu",
    intents: [
      <Button.Link href="https://warpcast.com/~/channel/farcastle/join">
        Join Channel
      </Button.Link>,
    ],
  });
});

app.frame("/dao/:chainid/:daoid", async (c) => {
  const chainid = c.req.param("chainid");
  const daoid = c.req.param("daoid");

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
    now: nowInSeconds(),
  });

  console.log("daoData", daoData);

  if (!daoData.dao) {
    return c.res({
      image: <ErrorView message="DAO Not Found" />,
    });
  }

  const name = daoData.dao.name;
  const vaultCount = daoData.dao.vaults.length || "0";
  const proposalCount = daoData.dao.proposals.length || "0";
  const memberCount = daoData.dao.activeMemberCount;
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
          {profile?.avatarImg ? (
            <img
              src={profile.avatarImg}
              width="300px"
              height="300px"
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                backgroundColor: "#341A34",
              }}
            />
          )}
        </Row>
      </Rows>
    ),
    intents: [],
  });
});

app.route("/proposal", proposalApp);

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
