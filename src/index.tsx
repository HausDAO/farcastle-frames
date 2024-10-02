import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { Row, Rows, Text, vars } from "./ui.js";

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

  console.log("chainid", chainid);
  console.log("daoid", daoid);

  //   // const graphKey = c.env?.GRAPH_KEY || process.env.GRAPH_KEY;

  //   // if (!graphKey) {
  //   //   throw new Error("GRAPH_KEY Missing");
  //   // }

  //   // const yeetData = await postData(GRAPH_ENDPOINT(graphKey), {
  //   //   query: `{yeeter(id: "${yeeterid.toLowerCase()}") {id endTime startTime minTribute multiplier goal balance dao { id }}}`,
  //   // });

  //   // if (!yeetData.data.yeeter) {
  //   //   return c.res({
  //   //     image: <ErrorView message="Yeeter Not Found" />,
  //   //   });
  //   // }

  //   // const now = Date.now() / 1000;
  //   // const isActive =
  //   //   now > Number(yeetData.data.yeeter.startTime) &&
  //   //   now < Number(yeetData.data.yeeter.endTime);

  //   // const daoid = yeetData.data.yeeter.dao.id;

  //   // const name = metaRes.data.records[0].dao.name;

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
          <Text size="48">Your Castle</Text>
          <Text size="20">{daoid}</Text>
          <Text size="20">on {chainid}</Text>
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
