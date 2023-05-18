import {
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useRef, useState } from "react";
import useLocalStorage from "../../lib/useLocalStorage";

export type TokenFieldProps = {
  onValidate: (token: string) => void;
};

export default function TokenField({ onValidate }: TokenFieldProps) {
  const [savedToken, saveToken] = useLocalStorage("github_token", "");
  const token = useRef("");
  const [rememberMe, setRememberMe] = useState(false);

  if (savedToken) {
    setTimeout(() => {
      onValidate(savedToken);
    });
    return <></>;
  }

  function handleValidate() {
    if (rememberMe) {
      return saveToken(token.current);
    } else {
      onValidate(token.current);
    }
  }
  return (
    <Stack alignItems="stretch" justifyContent="center" spacing={2}>
      <TextField
        label="Github token"
        placeholder="Enter your github token"
        onChange={(event) => (token.current = event.target.value)}
        sx={{ width: "100%" }}
      />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleValidate}>
          Validate
        </Button>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Remember me"
          checked={rememberMe}
          onChange={(_event, checked) => setRememberMe(checked)}
        />
      </Stack>
    </Stack>
  );
}
