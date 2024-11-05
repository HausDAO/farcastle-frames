import { PROPOSAL_STATUS } from '../utils/proposals-status.js';
import {
  Rows,
  Row,
  Box,
  Heading,
  Spacer,
  Columns,
  Column,
  Text,
} from './ui.js';

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
        <Row height="5/6">
          <Text color="aliceBlue" size="18">
            {`${proposalid} | ${proposalType}`}
          </Text>
          <Spacer size="12" />

          <Heading font="VT323" color="moonstone" size="48">
            {name}
          </Heading>
          <Spacer size="12" />
          <Text color="aliceBlue" size="24">
            {status}
          </Text>
          {executable && (
            <Text color="rustyRed" size="12">
              *Proposals must be executed in order
            </Text>
          )}
        </Row>
        <Row height="1/6">
          <Columns>
            <Column width="1/4" gap="16">
              <Heading font="VT323" color="moonstone" size="32">
                Yes
              </Heading>
              <Text color="rasedaGreen" size="24">
                {yes}
              </Text>
            </Column>
            <Column width="1/4" gap="16">
              <Heading font="VT323" color="moonstone" size="32">
                No
              </Heading>
              <Text color="rustyRed" size="24">
                {no}
              </Text>
            </Column>
          </Columns>
        </Row>
        <Spacer size="26" />
      </Rows>
    </Box>
  );
}
