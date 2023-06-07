import { Autocomplete, Card, CardContent, TextField } from "@mui/material";
import { useContext } from "react";
import { WorkspaceContext } from "../../workspace/WorkspaceContext";
import allLanguages from "../../workspace/codelist.json";

export default function LanguageField() {
  const workspace = useContext(WorkspaceContext);
  workspace.useRefresh();
  return (
    <Card>
      <CardContent>
        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              label="Language"
              name="language"
              autoComplete="off"
            />
          )}
          options={allLanguages}
          value={workspace.language || null}
          size="small"
          onChange={(_event, value) =>
            workspace.setLanguage(value || undefined)
          }
          disabled={!workspace.targetBranch}
        />
      </CardContent>
    </Card>
  );
}
