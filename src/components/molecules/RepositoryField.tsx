import { Autocomplete, Card, CardContent, TextField } from "@mui/material";
import { useContext } from "react";
import { WorkspaceContext } from "../../workspace/WorkspaceContext";

export default function RepositoryField() {
  const workspace = useContext(WorkspaceContext);
  workspace.useRefresh();
  return (
    <Card>
      <CardContent>
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Repository" />}
          options={workspace.repositories || []}
          getOptionLabel={(option) => option.name}
          size="small"
          value={workspace.repository || null}
          onChange={(_event, value) =>
            workspace.setRepository(value || undefined)
          }
        />
      </CardContent>
    </Card>
  );
}
