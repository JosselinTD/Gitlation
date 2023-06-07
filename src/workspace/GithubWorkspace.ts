import { useCallback, useEffect, useState } from "react";
import GithubDatasource from "../datasource/GithubDatasource";
import { Branch, Repository, File } from "../datasource/types";
import {
  Config,
  TranslationKeys,
  TranslationKeysContent,
  Translations,
} from "./types";

export default class GithubWorkspace {
  public repositories: Repository[] | undefined;
  public repository: Repository | undefined;
  public language: string | undefined;
  public keys: TranslationKeys | undefined;
  public translations: Translations | undefined;

  private listeners: (() => void)[] = [];

  private datasource: GithubDatasource | undefined;
  private branches: Branch[] | undefined;
  private master: Branch | undefined;
  private branch: Branch | undefined;
  private configuration: Config | undefined;
  private translationFile: File | undefined;

  public useRefresh() {
    const [, updateState] = useState({});
    const forceUpdate = useCallback(() => updateState({}), []);
    useEffect(() => {
      this.addListener(forceUpdate);
      return () => this.removeListener(forceUpdate);
    }, []);
  }

  public addListener(listener: () => void) {
    this.listeners.push(listener);
  }
  public removeListener(listener: () => void) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  async setToken(token: string) {
    this.datasource = new GithubDatasource(token);
    this.repositories = await this.datasource?.getAllRepositories();

    this.repository = undefined;
    this.language = undefined;
    this.translations = undefined;
    this.branches = undefined;
    this.master = undefined;
    this.branch = undefined;
    this.configuration = undefined;
    this.translationFile = undefined;

    this.triggerListeners();
  }
  async setRepository(repository: Repository) {
    this.repository = repository;
    this.branches = await this.datasource?.getAllBranches(this.repository);
    this.master = this.branches?.find((branch) => branch.name === "master");

    this.language = undefined;
    this.translations = undefined;
    this.branch = undefined;
    this.configuration = undefined;
    this.translationFile = undefined;

    this.triggerListeners();
  }
  async setLanguage(language: string) {
    if (!this.branches || !this.master) throw Error();
    this.language = language;
    this.branch = this.branches?.find(
      (branch) => branch.name === this.getBranchName()
    );
    await this.setConfiguration(this.branch || this.master);
    await this.setKeys(this.branch || this.master);
    await this.setTranslationFile(this.branch || this.master);

    this.triggerListeners();
  }
  async saveTranslations() {
    if (
      !this.datasource ||
      !this.repository ||
      !this.language ||
      !this.translationFile
    )
      throw Error();
    if (!this.branch) {
      this.branch = await this.datasource?.createLanguageBranch(
        this.repository,
        this.getBranchName()
      );
      const [translationFile, commit] = await this.datasource.createFileCommit(
        this.branch,
        this.language,
        {
          path: this.translationFile.path,
          content: JSON.stringify(this.translations),
        }
      );
      this.translationFile = translationFile;
      this.branch.sha = commit.sha;
    } else {
      const [translationFile, commit] = await this.datasource.createFileCommit(
        this.branch,
        this.language,
        {
          path: this.translationFile.path,
          content: JSON.stringify(this.translations),
          sha: this.translationFile.sha,
        }
      );
      this.translationFile = translationFile;
      this.branch.sha = commit.sha;
    }
    this.translations = JSON.parse(this.translationFile.content);

    this.triggerListeners();
  }

  public hasToken() {
    return !!this.datasource;
  }
  public hasBranches() {
    return !!this.branches;
  }
  public isReady() {
    return !!this.translations;
  }

  private async setConfiguration(branch: Branch) {
    if (!branch) throw Error();
    this.configuration = JSON.parse(
      (await this.datasource?.getFile(branch, ".gitlation.json"))?.content || ""
    );
    if (!this.configuration)
      throw Error("No configuration file found on branch " + branch.name);
  }
  private async setKeys(branch: Branch) {
    if (!branch || !this.configuration) throw Error();
    this.keys = this.harmonizeKeys(
      JSON.parse(
        (await this.datasource?.getFile(branch, this.configuration.keyFile))
          ?.content || "{}"
      )
    );
    if (!this.keys)
      throw Error("No keys file file found on branch " + branch.name);
  }
  private async setTranslationFile(branch: Branch) {
    if (!this.configuration || !this.language) throw Error();
    try {
      this.translationFile = await this.datasource?.getFile(
        branch,
        this.configuration.output.replace("{LANG}", this.language)
      );
    } catch (e) {
      if ((e as Error).message === "Not Found") {
        this.translationFile = {
          path: this.configuration.output.replace("{LANG}", this.language),
          content: "{}",
        };
      } else {
        throw e;
      }
    }
    this.translations = JSON.parse(this.translationFile?.content || "");
  }
  private triggerListeners() {
    for (let listener of this.listeners) {
      listener();
    }
  }
  private getBranchName() {
    return `Translate-${this.language}`;
  }
  private harmonizeKeys(
    nonFormattedKeys: string[] | Translations | TranslationKeys
  ): TranslationKeys {
    if (Array.isArray(nonFormattedKeys)) {
      return nonFormattedKeys.reduce((acc: TranslationKeys, key: string) => {
        acc[key] = {};
        return acc;
      }, {});
    }
    let formattedKeys: TranslationKeys = {};
    Object.keys(nonFormattedKeys).forEach((key: string) => {
      if (typeof nonFormattedKeys[key] === "string") {
        formattedKeys[key] = {
          defaultValue: nonFormattedKeys[key] as string,
        };
      } else {
        formattedKeys[key] = nonFormattedKeys[key] as TranslationKeysContent;
      }
    });
    return formattedKeys;
  }
}
