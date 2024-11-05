/** @jsxImportSource frog/jsx */
import { Rows, Row } from './ui.js';
import { Heading, Text } from './ui.js';

interface ErrorViewProps {
  message: string;
}

export function ErrorView({ message }: ErrorViewProps) {
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
          Game Over
        </Heading>
        <Text color="aliceBlue" size="24">
          {message}
        </Text>
      </Row>
    </Rows>
  );
}
