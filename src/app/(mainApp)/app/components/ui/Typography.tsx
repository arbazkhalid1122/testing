'use client';

import { createTheme, ThemeProvider, Typography, TypographyProps } from "@/lib/mui-optimized";

const theme = createTheme({
  typography: {
    fontFamily: "League Spartan",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'League Spartan';
        };
      `,
    },
  },
});

export const UITypography = ({ children, ...rest }: TypographyProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Typography lineHeight={1} { ...rest }>
        {children}
      </Typography>
    </ThemeProvider>
  );
};
