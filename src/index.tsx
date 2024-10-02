import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { vars } from "./ui.js";

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
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          FARCASTLE
        </div>
      </div>
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

  //   // if (!isActive) {
  //   //   return c.res({
  //   //     image: <ErrorView message="Yeeter Not Active" />,
  //   //   });
  //   // }

  //   // const daoid = yeetData.data.yeeter.dao.id;

  //   // const metaRes = await postData(DH_GRAPH_ENDPOINT(graphKey), {
  //   //   query: `{records(where: { dao: "${daoid.toLowerCase()}", table: "yeetDetails" }, orderBy: createdAt, orderDirection: desc) {id content dao { name } }}`,
  //   // });

  //   // const meta = addParsedContent(metaRes.data.records[0].content);

  //   // if (!metaRes.data.records[0]) {
  //   //   return c.res({
  //   //     image: <ErrorView message="Missing Yeeter Mission" />,
  //   //   });
  //   // }

  //   // const name = metaRes.data.records[0].dao.name;
  //   // const mission = meta?.missionStatement || "No Mission";
  //   // const balance = formatEther(yeetData.data.yeeter.balance);
  //   // const endTime =
  //   //   formatShortDateTimeFromSeconds(yeetData.data.yeeter.endTime) || "No End";
  //   // const goal = formatEther(yeetData.data.yeeter.goal);
  //   // const minTribute = formatEther(yeetData.data.yeeter.minTribute);

  return c.res({
    action: `/success/${daoid}`,
    headers: {
      "Cache-Control": "max-age=0",
    },
    image: (
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {`Your castle: ${daoid} on: ${chainid}`}
        </div>
      </div>
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
