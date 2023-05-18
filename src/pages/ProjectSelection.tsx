import { useEffect, useState } from "react";
import * as Octokit from "../lib/octokit";
import ProjectSelector from "../components/organisms/ProjectSelector";
import { Container } from "@mui/material";

export default function ProjectSelection() {
  const [repos, setRepos] = useState<Octokit.Repo[]>([]);
  useEffect(() => {
    Octokit.getRepos().then(setRepos);
  });
  return (
    <Container>
      <ProjectSelector repos={repos} />
    </Container>
  );
}
