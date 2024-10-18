import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { request } from "graphql-request";

import { FROG_APP_CONFIG, GRAPH_URL } from "../utils/constants.js";
import { GET_DAO } from "../utils/graph-queries.js";
import { ErrorView } from "../components/ErrorView.js";
import { nowInSeconds, parseContent } from "../utils/helpers.js";
import { isChainId, isAddress } from "../utils/validators.js";
import { DaoView } from "../components/DaoView.js";
import {
  formatDaoDescription,
  formatDaoImg,
  formatDaoName,
} from "../utils/dao-data-formatters.js";

export const app = new Frog(FROG_APP_CONFIG);

app.frame("/", (c) => {
  return c.res({
    image: <ErrorView message="Invalid Dao Params" />,
    intents: [],
  });
});

app.frame("/:chainid/:daoid", async (c) => {
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
    now: Math.floor(nowInSeconds()).toString(),
  });

  if (!daoData.dao) {
    return c.res({
      image: <ErrorView message="DAO Not Found" />,
    });
  }

  const name = formatDaoName(daoData.dao.name);
  const vaultCount = daoData.dao.vaults.length || "0";
  const proposalCount = daoData.dao.proposals.length || "0";
  const memberCount = daoData.dao.activeMemberCount;
  const profile =
    daoData.dao.profile[0] && parseContent(daoData.dao.profile[0].content);
  const description = formatDaoDescription(profile?.description);
  const daoImg = formatDaoImg(profile?.avatarImg);

  return c.res({
    image: (
      <DaoView
        name={name}
        description={description}
        memberCount={memberCount}
        vaultCount={vaultCount}
        proposalCount={proposalCount}
        // img={profile?.avatarImg}
        img={daoImg}
      />
    ),
    intents: [],
  });
});

const isCloudflareWorker = typeof caches !== "undefined";
if (isCloudflareWorker) {
  // @ts-ignore
  const manifest = await import("__STATIC_CONTENT_MANIFEST");
  const serveStaticOptions = { manifest, root: "./" };
  app.use("/*", serveStatic(serveStaticOptions));
  devtools(app, { assetsPath: "/", serveStatic, serveStaticOptions });
} else {
  devtools(app, { serveStatic });
}

export default app;
