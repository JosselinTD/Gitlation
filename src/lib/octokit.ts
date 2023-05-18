import { Octokit } from "octokit";

let octokit: Octokit;
let repos: Repo[] = [];

export type Repo = {
  owner: string;
  repo: string;
};

export function init(token: string) {
  octokit = new Octokit({ auth: token });
}

export async function getRepos(): Promise<Repo[]> {
  if (!getRepos.isRunning && !repos.length) {
    getRepos.isRunning = true;
    const reposResponse = await octokit.request("GET /user/repos", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      per_page: 99999,
    });
    repos = reposResponse.data.map((repo) => ({
      repo: repo.name,
      owner: repo.owner.login,
    }));
    getRepos.isRunning = false;
  }

  return repos;
}

getRepos.isRunning = false;
