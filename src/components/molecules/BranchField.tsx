import { Autocomplete, Card, CardContent, TextField } from "@mui/material";
import { useContext } from "react";
import { WorkspaceContext } from "../../workspace/WorkspaceContext";

export default function BranchField() {
  const workspace = useContext(WorkspaceContext);
  workspace.useRefresh();
  return (
    <Card>
      <CardContent>
        <Autocomplete
          renderInput={(params) => (
            <TextField {...params} label="Target Branch" />
          )}
          options={workspace.branches || []}
          getOptionLabel={(option) => option.name}
          size="small"
          value={workspace.targetBranch || null}
          onChange={(_event, value) =>
            workspace.setTargetBranch(value || undefined)
          }
          disabled={!workspace.hasBranches()}
        />
      </CardContent>
    </Card>
  );
}
