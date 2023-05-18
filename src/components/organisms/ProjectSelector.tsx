import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Repo } from "../../lib/octokit";

export type ProjectSelectorProps = {
  repos: Repo[];
};

export default function ProjectSelector({ repos }: ProjectSelectorProps) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={2}>
      {repos.map((repo) => (
        <Card key={repo.repo} sx={{ width: "200px", cursor: "pointer" }}>
          <CardContent>
            <Typography variant="h5">{repo.repo}</Typography>
            <Typography variant="subtitle1" sx={{ display: "inline-block" }}>
              by
            </Typography>{" "}
            <Typography variant="h6" sx={{ display: "inline-block" }}>
              {repo.owner}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
