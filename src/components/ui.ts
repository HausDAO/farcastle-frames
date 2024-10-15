import { createSystem } from "frog/ui";

export const {
  Box,
  Columns,
  Column,
  Heading,
  HStack,
  Rows,
  Row,
  Spacer,
  Text,
  VStack,
  vars,
} = createSystem({
  colors: {
    darkPurple: "#17151F",
    purple: "#341A34",
    lightPurple: "#B276FF",
    blue: "#00B1CC",
    white: "#EAF8FF",
    darkRed: "#440C13",
    red: "#F22E41",
  },
  fonts: {
    default: [
      {
        name: "Inter",
        source: "google",
        weight: 400,
      },
    ],
  },
});
