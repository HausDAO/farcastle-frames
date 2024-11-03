/** @jsxImportSource frog/jsx */
import { Rows, Row } from './ui.js';
import { Heading, Text } from './ui.js';

interface SuccessViewProps {
  type: string;
  message?: string;
}

const messages: {
  [key: string]: string;
} = {
  vote: 'Vote Counted',
  execute: 'Proposal Executed',
};

export function SuccessView({ type, message }: SuccessViewProps) {
  const bodyText = message || messages[type];
  return (
    <Rows grow>
      <Row
        backgroundColor="raisinBlack"
        textAlign="center"
        textTransform="uppercase"
        alignHorizontal="center"
        alignVertical="center"
      >
        <Heading font="VT323" color="moonstone" size="64">
          You Win
        </Heading>
        <Text color="aliceBlue" size="24">
          {bodyText}
        </Text>
      </Row>
    </Rows>
  );
}
