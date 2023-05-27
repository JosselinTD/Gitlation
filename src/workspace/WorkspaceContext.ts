import { createContext } from "react";
import GithubWorkspace from "./GithubWorkspace";

export const WorkspaceContext = createContext<GithubWorkspace>(
  new GithubWorkspace()
);
