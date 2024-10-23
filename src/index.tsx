import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { FROG_APP_CONFIG } from "./utils/constants.js";

import { daoHomeFrame } from "./frames/dao-home.js";
import { proposalFrame } from "./frames/proposal.js";
import { voteFrame, voteTransaction } from "./frames/vote.js";
import { app as styleApp } from "./frames/style.js";
import { SuccessView } from "./components/SuccessView.js";

export const app = new Frog(FROG_APP_CONFIG);

app.frame("/", (c) => {
  return c.res({
    image:
      "https://daohaus.mypinata.cloud/ipfs/QmaMUgNbwFpVp7KDLPPUQtuJfZ9GaySNBd6D74bizLLhsu",
  });
});

app.frame("dao/:chainid/:daoid", async (c) => {
  return daoHomeFrame(c);
});

app.frame("proposal/:chainid/:daoid/:proposalids", async (c) => {
  return proposalFrame(c);
});
app.frame("vote/:chainid/:daoid/:proposalid", async (c) => {
  return voteFrame(c);
});

app.transaction("/tx/:chainid/:daoid/:proposalid/:approved", (c) => {
  return voteTransaction(c);
});

app.frame("/success/:type", (c) => {
  const type = c.req.param("type");
  return c.res({
    image: <SuccessView type={type} />,
  });
});

app.route("/style", styleApp);

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
