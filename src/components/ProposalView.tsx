import { Rows, Row, Box, Heading, Spacer, Columns, Column } from './ui.js';
import { Text } from './ui.js';

interface ProposalViewProps {
  proposalid: string | number;
  proposalType: string;
  name: string;
  description: string;
  submittedBy: string;
  votingEnds?: string;
}

export function ProposalView({
  proposalid,
  proposalType,
  name,
  description,
  submittedBy,
  votingEnds,
}: ProposalViewProps) {
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
            {description}
          </Text>
        </Row>
        <Row height="1/6">
          <Columns>
            <Column width="3/6" gap="16">
              <Heading font="VT323" color="moonstone" size="32">
                Submitted By
              </Heading>
              <Text color="aliceBlue" size="24">
                {submittedBy}
              </Text>
            </Column>
            <Column width="3/6" gap="16">
              <Heading font="VT323" color="moonstone" size="32">
                Voting Ends
              </Heading>
              <Text color="aliceBlue" size="24">
                {votingEnds}
              </Text>
            </Column>
          </Columns>
        </Row>
        <Spacer size="26" />
      </Rows>
    </Box>
  );
}
