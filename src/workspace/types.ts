export type Config = {
  keyFile: string;
  output: string;
};
export type Translations = {
  [key: string]: string;
};
export type TranslationKeysContent = {
  [key: string]: string;
};
export type TranslationKeys = {
  [key: string]: TranslationKeysContent;
};
