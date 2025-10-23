'use client';

import { createTheme, ThemeProvider, Button, ButtonProps } from "@/lib/mui-optimized";

const theme = createTheme({
  typography: {
    fontFamily: "League Spartan",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'League Spartan';
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'contained' },
              style: {
                backgroundColor: '#648A65',
                borderRadius: 50,
                color: "#FFFCF2",
                height: 54,
                paddingX: 3,
                paddingY: 2,
                textTransform: 'none'
              }
            },
            {
              props: { variant: 'outlined' },
              style: {
                borderRadius: 50,
                color: "#648A65",
                border: '2px solid #648A65',
                textTransform: 'none'
              }
            },
          ]
        }
      }
    }
  },
});

export const UIButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Button { ...rest }>
        {children}
      </Button>
    </ThemeProvider>
  );
};
