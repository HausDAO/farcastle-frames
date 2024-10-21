/** @jsxImportSource frog/jsx */
import { Rows, Row } from "./ui.js";
import { Text } from "./ui.js";

interface SuccessViewProps {
  // 'vote' or 'custom'
  type: string;
  message?: string;
}

const messages: {
  [key: string]: string;
} = {
  vote: "Your Vote Counts!",
};

export function SuccessView({ type, message }: SuccessViewProps) {
  const bodyText = message || messages[type];
  return (
    <Rows grow>
      <Row
        backgroundColor="darkPurple"
        color="moonstone"
        textAlign="center"
        textTransform="uppercase"
        alignHorizontal="center"
        alignVertical="center"
      >
        <Text size="48">You Win</Text>
        <Text size="32">{bodyText}</Text>
      </Row>
    </Rows>
  );
}
