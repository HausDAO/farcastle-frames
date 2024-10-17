/** @jsxImportSource frog/jsx */
import { Rows, Row } from "./ui.js";
import { Text } from "./ui.js";

interface ErrorViewProps {
  message: string;
}

export function SuccessView({ message }: ErrorViewProps) {
  return (
    <Rows grow>
      <Row
        backgroundColor="darkPurple"
        color="white"
        textAlign="center"
        textTransform="uppercase"
        alignHorizontal="center"
        alignVertical="center"
      >
        <Text size="48">You Win</Text>
        <Text size="32">{message}</Text>
      </Row>
    </Rows>
  );
}
