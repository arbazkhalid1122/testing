// Optimized MUI imports to reduce bundle size
// Import only what's needed instead of entire modules

// Core MUI components - import individually for better tree shaking
export { default as Box } from '@mui/material/Box';
export { default as Container } from '@mui/material/Container';
export { default as Grid2 } from '@mui/material/Grid2';
export { default as Divider } from '@mui/material/Divider';
export { default as Card } from '@mui/material/Card';
export { default as CardContent } from '@mui/material/CardContent';
export { default as TextField } from '@mui/material/TextField';
export { default as Stack } from '@mui/material/Stack';
export { default as Step } from '@mui/material/Step';
export { default as StepLabel } from '@mui/material/StepLabel';
export { default as Stepper } from '@mui/material/Stepper';
export { default as LinearProgress } from '@mui/material/LinearProgress';
export { default as Autocomplete } from '@mui/material/Autocomplete';
export { default as ListItem } from '@mui/material/ListItem';
export { default as ListItemText } from '@mui/material/ListItemText';
export { default as Paper } from '@mui/material/Paper';
export { default as Typography } from '@mui/material/Typography';
export { default as Button } from '@mui/material/Button';
export { default as StepConnector } from '@mui/material/StepConnector';

// Export classes and types
export { linearProgressClasses } from '@mui/material/LinearProgress';
export { stepConnectorClasses } from '@mui/material/StepConnector';

// MUI styled and theming
export { default as styled } from '@mui/material/styles/styled';
export { default as createTheme } from '@mui/material/styles/createTheme';
export { default as ThemeProvider } from '@mui/material/styles/ThemeProvider';

// MUI icons - import only what's needed
export { default as CheckIcon } from '@mui/icons-material/Check';

// MUI Joy components
export { default as Textarea } from '@mui/joy/Textarea';

// MUI styles
export { default as makeStyles } from '@mui/styles/makeStyles';

// Re-export types
export type { ButtonProps } from '@mui/material/Button';
export type { TypographyProps } from '@mui/material/Typography';
export type { StepIconProps } from '@mui/material/StepIcon';
export type { StepConnectorProps } from '@mui/material/StepConnector';
