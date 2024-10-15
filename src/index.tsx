import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { FROG_APP_CONFIG } from "./utils/constants.js";

import { app as daoApp } from "./frames/dao-home.js";
import { app as proposalApp } from "./frames/proposal.js";

export const app = new Frog(FROG_APP_CONFIG);

app.frame("/", (c) => {
  return c.res({
    image:
      "https://daohaus.mypinata.cloud/ipfs/QmaMUgNbwFpVp7KDLPPUQtuJfZ9GaySNBd6D74bizLLhsu",
    intents: [
      // <Button.Link href="https://warpcast.com/~/channel/farcastle/join">
      //   Join Channel
      // </Button.Link>,
    ],
  });
});

app.route("/dao", daoApp);
app.route("/proposal", proposalApp);

const isCloudflareWorker = typeof caches !== "undefined";
if (isCloudflareWorker) {
  // @ts-ignore
  const manifest = await import("__STATIC_CONTENT_MANIFEST");
  const serveStaticOptions = { manifest, root: "./" };
  app.use("/*", serveStatic(serveStaticOptions));
  devtools(app, { assetsPath: "/frog", serveStatic, serveStaticOptions });
} else {
  devtools(app, { serveStatic });
}

export default app;
