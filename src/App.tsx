import { Box, Container } from "@mui/material";
import "./App.css";
import TokenField from "./components/molecules/TokenField";
import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./lib/router";
import * as Octokit from "./lib/octokit.js";

function App() {
  const [isAuthentified, setIsAuthentified] = useState(false);
  function onValidate(token: string) {
    setIsAuthentified(true);
    Octokit.init(token);
  }

  return (
    <Container sx={{ maxHeight: "100%", overflowY: "scroll" }}>
      {!isAuthentified ? (
        <Box sx={{ width: "350px", margin: "auto" }}>
          <TokenField onValidate={onValidate} />
        </Box>
      ) : (
        <RouterProvider router={router} />
      )}
    </Container>
  );
}

export default App;
