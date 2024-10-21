import { Rows, Row, Box, Heading, Spacer, Columns, Column } from "./ui.js";
import { Text } from "./ui.js";

interface ProposalViewProps {
  proposalid: string | number;
  proposalType: string;
  createdAt?: string;
  name: string;
  description: string;
  submittedBy: string;
  votingEnds?: string;
  graceEnds?: string;
}

export function ProposalView({
  proposalid,
  proposalType,
  createdAt,
  name,
  description,
  submittedBy,
  votingEnds,
  graceEnds,
}: ProposalViewProps) {
  return (
    <Box grow alignVertical="center" backgroundColor="raisinBlack" padding="32">
      <Rows>
        <Row height="5/6">
          <Text color="aliceBlue" size="18">
            {`${proposalid} | ${proposalType} | ${createdAt}`}
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
            <Column width="2/6" gap="12">
              <Heading font="VT323" color="moonstone" size="18">
                Submitted by
              </Heading>
              <Text color="aliceBlue" size="14">
                {submittedBy}
              </Text>
            </Column>
            <Column width="2/6" gap="12">
              <Heading font="VT323" color="moonstone" size="18">
                Voting ends
              </Heading>
              <Text color="aliceBlue" size="14">
                {votingEnds}
              </Text>
            </Column>
            <Column width="2/6" gap="12">
              <Heading font="VT323" color="moonstone" size="18">
                Grace ends
              </Heading>
              <Text color="aliceBlue" size="14">
                {graceEnds}
              </Text>
            </Column>
          </Columns>
        </Row>
      </Rows>
    </Box>
  );
}
