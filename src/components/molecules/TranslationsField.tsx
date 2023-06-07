import { useContext } from "react";
import { WorkspaceContext } from "../../workspace/WorkspaceContext";
import { Stack, TextField } from "@mui/material";

export default function TranslationsField() {
  const workspace = useContext(WorkspaceContext);
  workspace.useRefresh();

  return (
    <Stack spacing={2}>
      {workspace.keys &&
        Object.keys(workspace.keys).map((translationKey) => (
          <TextField
            key={translationKey}
            label={translationKey}
            placeholder={
              workspace.keys
                ? workspace.keys[translationKey].defaultValue
                : undefined
            }
            defaultValue={
              workspace.translations && workspace.translations[translationKey]
            }
            onChange={(event) =>
              workspace.translations
                ? (workspace.translations[translationKey] = event.target.value)
                : undefined
            }
            multiline
            rows={5}
          />
        ))}
    </Stack>
  );
}
