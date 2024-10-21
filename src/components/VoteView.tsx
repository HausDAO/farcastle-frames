import { Rows, Row, Box, Heading, Spacer, Columns, Column } from "./ui.js";
import { Text } from "./ui.js";

interface VoteViewProps {
  proposalid: string | number;
  createdAt?: string;
  proposalType: string;
  name: string;
  yes?: string;
  no?: string;
}

export function VoteView({
  proposalid,
  createdAt,
  proposalType,
  name,
  yes,
  no,
}: VoteViewProps) {
  return (
    <Box grow alignVertical="center" backgroundColor="raisinBlack" padding="32">
      <Rows>
        <Row height="3/6">
          <Text color="aliceBlue" size="18">
            {`${proposalid} | ${proposalType} | ${createdAt}`}
          </Text>
          <Spacer size="12" />

          <Heading font="VT323" color="moonstone" size="48">
            {name}
          </Heading>
          <Spacer size="12" />
        </Row>
        <Row height="3/6">
          <Columns>
            <Column width="1/2" gap="12">
              <Heading font="VT323" color="rasedaGreen" size="48">
                Yes
              </Heading>
              <Text color="rasedaGreen" size="48">
                {yes}
              </Text>
            </Column>
            <Column width="1/2" gap="12">
              <Heading font="VT323" color="rustyRed" size="48">
                No
              </Heading>
              <Text color="rustyRed" size="48">
                {no}
              </Text>
            </Column>
          </Columns>
        </Row>
      </Rows>
    </Box>
  );
}
