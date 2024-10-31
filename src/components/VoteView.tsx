import { PROPOSAL_STATUS } from "../utils/proposals-status.js";
import {
  Rows,
  Row,
  Box,
  Heading,
  Spacer,
  Columns,
  Column,
  Text,
} from "./ui.js";

interface VoteViewProps {
  proposalid: string | number;
  proposalType: string;
  name: string;
  yes?: string;
  no?: string;
  status?: string;
  executable: boolean;
}

export function VoteView({
  proposalid,
  proposalType,
  name,
  yes,
  no,
  status,
  executable,
}: VoteViewProps) {
  return (
    <Box grow alignVertical="center" backgroundColor="raisinBlack" padding="32">
      <Rows>
        <Row height="3/6">
          <Text color="aliceBlue" size="18">
            {`${proposalid} | ${proposalType}`}
          </Text>
          <Spacer size="12" />

          <Heading font="VT323" color="moonstone" size="48">
            {name}
          </Heading>
          <Text color="aliceBlue" size="18">
            {status}
          </Text>
          {executable && (
            <Text color="rustyRed" size="12">
              *Proposals must be executed in order
            </Text>
          )}
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
