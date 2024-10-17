import { createSystem } from 'frog/ui';

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
    raisinBlack: '#17151F',
    darkPurple: '#341A34',
    moonstone: '#00B1CC',
    aliceBlue: '#EAF8FF',
    rasedaGreen: '#707C4E',
    rustyRed: '#CD4A50',
  },
  fonts: {
    default: [
      {
        name: 'Mulish',
        source: 'google',
        weight: 500,
      },
    ],
    VT323: [
      {
        name: 'VT323',
        source: 'google',
        weight: 400,
      },
    ],
  },
});
