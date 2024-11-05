import { Rows, Row, Box, Columns, Column, Heading } from "./ui.js";
import { Text } from "./ui.js";

interface DaoViewProps {
  name: string;
  description: string;
  memberCount: string;
  vaultCount: string;
  proposalCount: string;
  img?: string;
}

export function DaoView({
  name,
  description,
  memberCount,
  vaultCount,
  proposalCount,
  img,
}: DaoViewProps) {
  return (
    <Box grow alignVertical="center" backgroundColor="raisinBlack" padding="32">
      <Rows>
        <Row height="3/4">
          <Columns grow>
            <Column width="5/7" gap="16">
              <Heading font="VT323" color="moonstone" size="48">
                {name}
              </Heading>
              <Text color="aliceBlue" size="24">
                {description}
              </Text>
            </Column>
            <Column width="1/7">
              {img && (
                <img
                  src={img}
                  width="300px"
                  height="300px"
                  style={{ borderRadius: "50%" }}
                />
              )}
            </Column>
          </Columns>
        </Row>
        <Row height="1/4">
          <Columns>
            <Column width="1/4" gap="16">
              <Heading font="VT323" color="moonstone" size="32">
                Proposals
              </Heading>
              <Text color="aliceBlue" size="24">
                {proposalCount}
              </Text>
            </Column>
            <Column width="1/4" gap="16">
              <Heading font="VT323" color="moonstone" size="32">
                Members
              </Heading>
              <Text color="aliceBlue" size="24">
                {memberCount}
              </Text>
            </Column>
            <Column width="2/4" gap="16">
              <Heading font="VT323" color="moonstone" size="32">
                Safes
              </Heading>
              <Text color="aliceBlue" size="24">
                {vaultCount}
              </Text>
            </Column>
          </Columns>
        </Row>
      </Rows>
    </Box>
  );
}
