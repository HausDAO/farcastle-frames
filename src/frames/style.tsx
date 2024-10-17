import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { request } from 'graphql-request';

import {
  Box,
  Row,
  Rows,
  Columns,
  Column,
  Heading,
  Text,
} from "../components/ui.js";
import { FROG_APP_CONFIG } from "../utils/constants.js";
// import { GET_DAO } from '../utils/graph-queries.js';
// import { ErrorView } from '../components/ErrorView.js';
// import { nowInSeconds, parseContent } from '../utils/helpers.js';
// import { isChainId, isAddress } from '../utils/validators.js';

export const app = new Frog(FROG_APP_CONFIG);

// style/0x2105/0x1503bd5f6f082f7fbd36438cc416cd67849c0bec

app.frame("/", (c) => {
  const name = "Big Boner DAO";
  const memberCount = "11";
  const vaultCount = "2";
  const proposalCount = "69";

  return c.res({
    image: (
      <Box
        grow
        alignVertical="center"
        backgroundColor="raisinBlack"
        padding="32"
      >
        <Rows>
          <Row height="3/4">
            <Columns grow>
              <Column width="5/7" gap="16">
                <Heading font="VT323" color="moonstone" size="48">
                  {name}
                </Heading>
                <Text color="aliceBlue" size="24">
                  Description
                </Text>
              </Column>
              <Column width="2/7"></Column>
            </Columns>
          </Row>
          <Row height="1/4">
            <Columns>
              <Column width="1/4" gap="16">
                <Heading font="VT323" color="moonstone" size="32">
                  Members
                </Heading>
                <Text color="aliceBlue" size="24">
                  {memberCount}
                </Text>
              </Column>
              <Column width="1/4" gap="16">
                <Heading font="VT323" color="moonstone" size="32">
                  Safes
                </Heading>
                <Text color="aliceBlue" size="24">
                  {vaultCount}
                </Text>
              </Column>
              <Column width="2/4" gap="16">
                <Heading font="VT323" color="moonstone" size="32">
                  Active Proposals
                </Heading>
                <Text color="aliceBlue" size="24">
                  {proposalCount}
                </Text>
              </Column>
            </Columns>
          </Row>
        </Rows>
      </Box>
    ),
    intents: [],
  });
});

app.frame("/style", async (c) => {
  console.log("/style route accessed");
  const name = "Boner";
  const vaultCount = "2";
  const proposalCount = "69";

  return c.res({
    image: (
      <Rows grow>
        <Row
          backgroundColor="darkPurple"
          color="moonstone"
          textAlign="center"
          textTransform="uppercase"
          alignHorizontal="center"
          alignVertical="center"
        >
          <Text size="16">{name}</Text>
          <Text size="16">Active Proposals: {proposalCount}</Text>
          <Text size="16">Safes: {vaultCount}</Text>
        </Row>
      </Rows>
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
