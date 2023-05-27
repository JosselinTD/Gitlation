import { PropsWithChildren } from "react";
import { CssBaseline } from "@mui/material";
import { WorkspaceContext } from "./workspace/WorkspaceContext";
import GithubWorkspace from "./workspace/GithubWorkspace";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <WorkspaceContext.Provider value={new GithubWorkspace()}>
      <CssBaseline />
      {children}
    </WorkspaceContext.Provider>
  );
}
