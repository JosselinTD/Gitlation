import Grid from "@mui/material/Unstable_Grid2";
import TokenField from "../molecules/TokenField";
import RepositoryField from "../molecules/RepositoryField";
import LanguageField from "../molecules/LanguageField";
import TranslationsField from "../molecules/TranslationsField";
import ConfigurationStepper from "../molecules/ConfigurationStepper";
import SaveOrPublish from "../molecules/SaveOrPublish";

export default function Workspace() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={1}>
          <TokenField />
        </Grid>
        <Grid xs={9}>
          <RepositoryField />
        </Grid>
        <Grid xs={2}>
          <LanguageField />
        </Grid>
        <Grid xs={12}>
          <ConfigurationStepper />
        </Grid>
        <Grid xs={5}>
          <TranslationsField />
        </Grid>
      </Grid>
      <SaveOrPublish />
    </>
  );
}
