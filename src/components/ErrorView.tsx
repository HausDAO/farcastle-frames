/** @jsxImportSource frog/jsx */
import { Rows, Row } from "../ui.js";
import { Text } from "../ui.js";

interface ErrorViewProps {
  message: string;
}

export function ErrorView({ message }: ErrorViewProps) {
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
        <Text size="48">Error: {message}</Text>
      </Row>
    </Rows>
  );
}
