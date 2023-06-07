import { Branch, Commit, Repository, File } from "./types";

export type Datasource = {
  getAllRepositories: () => Promise<Repository[]>;
  getAllBranches: (repository: Repository) => Promise<Branch[]>;
  getFile: (branch: Branch, path: string) => Promise<File>;

  createLanguageBranch: (
    repository: Repository,
    name: string,
    targetBranch: Branch
  ) => Promise<Branch>;
  createFileCommit: (
    branch: Branch,
    language: string,
    file: File
  ) => Promise<[File, Commit]>;
  updateFileCommit: (commit: Commit, file: File) => Promise<[File, Commit]>;
};
