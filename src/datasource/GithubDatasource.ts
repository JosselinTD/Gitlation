import { Octokit } from "octokit";
import { Datasource } from "./interface";
import { Repository, Branch, Commit, File } from "./types";
import { decodeFile, encodeFile } from "../lib/base64";
export type RepoResponseData = {
  content: string;
  sha: string;
};
export default class GithubDatasource implements Datasource {
  private octokit: Octokit;
  private master: Branch | undefined;
  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }
  async getAllRepositories() {
    const reposResponse = await this.octokit.request("GET /user/repos", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      per_page: 99999,
    });
    return reposResponse.data.map((repo) => ({
      name: repo.name,
      owner: repo.owner.login,
    }));
  }
  async getAllBranches(repository: Repository) {
    const branchesResponse = await this.octokit.request(
      "GET /repos/{owner}/{repo}/branches",
      {
        owner: repository.owner,
        repo: repository.name,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
        per_page: 99999,
      }
    );
    const allBranches = branchesResponse.data.map((branch) => ({
      repository: repository,
      name: branch.name,
      sha: branch.commit.sha,
    }));
    this.master =
      allBranches.find((branch) => branch.name === "master") || this.master;
    return allBranches;
  }
  async getFile(branch: Branch, path: string) {
    const result = await this.octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: branch.repository.owner,
        repo: branch.repository.name,
        path,
        ref: `refs/heads/${branch.name}`,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return {
      content: decodeFile((result.data as RepoResponseData).content),
      path,
      sha: (result.data as RepoResponseData).sha,
    };
  }
  async createLanguageBranch(
    repository: Repository,
    name: string,
    targetBranch: Branch
  ) {
    if (!this.master) throw Error();
    const createdBranch = await this.octokit.request(
      "POST /repos/{owner}/{repo}/git/refs",
      {
        owner: repository.owner,
        repo: repository.name,
        ref: `refs/heads/${name}`,
        sha: targetBranch.sha,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return {
      repository,
      name,
      sha: createdBranch.data.object.sha,
    };
  }
  async createFileCommit(
    branch: Branch,
    langage: string,
    file: File
  ): Promise<[File, Commit]> {
    const fileCommit = await this.octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: branch.repository.owner,
        repo: branch.repository.name,
        path: file.path,
        message: `:globe_with_meridians: feat(translation): update ${langage}`,
        committer: {
          name: "Translator",
          email: "translator@example.com",
        },
        branch: branch.name,
        content: encodeFile(file.content),
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return [
      {
        ...file,
        sha: fileCommit.data.content?.sha,
      },
      {
        branch,
        message: fileCommit.data.commit.message || "",
        sha: fileCommit.data.commit.sha || "",
      },
    ];
  }
  async updateFileCommit(commit: Commit, file: File): Promise<[File, Commit]> {
    const fileCommit = await this.octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: commit.branch.repository.owner,
        repo: commit.branch.repository.name,
        path: file.path,
        message: commit.message,
        sha: file.sha,
        committer: {
          name: "Translator",
          email: "translator@example.com",
        },
        branch: commit.branch.name,
        content: encodeFile(file.content),
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return [
      {
        ...file,
        sha: fileCommit.data.content?.sha,
      },
      {
        branch: commit.branch,
        message: commit.message,
        sha: fileCommit.data.commit.sha || "",
      },
    ];
  }
}
