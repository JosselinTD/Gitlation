export type Repository = {
  name: string;
  owner: string;
};

export type Branch = {
  repository: Repository;
  name: string;
  sha: string;
};

export type Commit = {
  branch: Branch;
  message: string;
  sha: string;
};

export type File = {
  path: string;
  sha?: string;
  content: string;
};

export type PullRequest = {
  repository: Repository;
  head: Branch;
  base: Branch;
  id: number;
};
