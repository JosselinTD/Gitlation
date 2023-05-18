import { ThemeProvider } from "@mui/material";
import { PropsWithChildren } from "react";
import { theme } from "./theme/base";
import { CssBaseline } from "@mui/material";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
