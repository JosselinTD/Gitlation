import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import useLocalStorage from "../../lib/useLocalStorage";
import { WorkspaceContext } from "../../workspace/WorkspaceContext";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

export type TokenFieldProps = {
  onValidate: (token: string) => void;
};

export default function TokenField() {
  const workspace = useContext(WorkspaceContext);
  workspace.useRefresh();
  const [savedToken, saveToken] = useLocalStorage("github_token", "");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    (async () => {
      if (savedToken && !workspace.hasToken()) {
        await workspace.setToken(savedToken);
        setOpen(false);
      }
    })();
  }, [savedToken, setOpen]);

  async function handleValidate(token: string, rememberMe: boolean) {
    await workspace.setToken(token);
    setOpen(false);
    if (rememberMe) {
      saveToken(token);
    }
  }
  return (
    <Card>
      <CardContent>
        <IconButton aria-label="set-token" onClick={() => setOpen(!open)}>
          <Badge
            variant="dot"
            color={workspace.hasToken() ? "success" : "error"}
          >
            <VpnKeyIcon />
          </Badge>
        </IconButton>
      </CardContent>
      <TokenDialog open={open} onValidate={handleValidate} />
    </Card>
  );
}

type TokenDialogProps = {
  open: boolean;
  onValidate: (token: string, remember: boolean) => void;
};

function TokenDialog({ open, onValidate }: TokenDialogProps) {
  const token = useRef("");
  const rememberMe = useRef(false);
  return (
    <Dialog open={open}>
      <Stack
        alignItems="stretch"
        justifyContent="center"
        spacing={2}
        sx={{ padding: "10px", width: "400px" }}
      >
        <TextField
          label="Github token"
          placeholder="Enter your github token"
          onChange={(event) => (token.current = event.target.value)}
          sx={{ width: "100%" }}
        />
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={() => onValidate(token.current, rememberMe.current)}
          >
            Validate
          </Button>
          <FormControlLabel
            control={<Switch />}
            label="Remember me"
            onChange={(_event, checked) => (rememberMe.current = checked)}
          />
        </Stack>
      </Stack>
    </Dialog>
  );
}
