'use client';

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, TypographyProps } from "@mui/material";


const theme = createTheme({
  typography: {
    fontFamily: 'PremiumUltra84',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'PremiumUltra84';
        };
      `,
    },
  },
});

export const UIPostCardMessage = ({ children, ...rest }: TypographyProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Typography lineHeight={1} { ...rest }>
        {children}
      </Typography>
    </ThemeProvider>
  );
};
