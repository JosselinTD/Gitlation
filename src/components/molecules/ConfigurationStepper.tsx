import { useContext, useState } from "react";
import { WorkspaceContext } from "../../workspace/WorkspaceContext";
import { Step, StepLabel, Stepper } from "@mui/material";
import GithubWorkspace from "../../workspace/GithubWorkspace";

const steps = [
  "Set credentials",
  "Select a repository",
  "Select a target branch",
  "Select a language",
];

export default function ConfigurationStepper() {
  const workspace = useContext(WorkspaceContext);
  workspace.useRefresh();

  const [activeStep, setActiveStep] = useState(0);

  const currentStep = getCurrentStep(workspace);
  if (activeStep !== currentStep) {
    setActiveStep(currentStep);
  }

  return (
    <Stepper activeStep={activeStep}>
      {steps.map((label) => {
        return (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}

function getCurrentStep(workspace: GithubWorkspace): number {
  if (workspace.isReady()) {
    return 4;
  }
  if (workspace.hasToken() && workspace.repository && workspace.targetBranch) {
    return 3;
  }
  if (workspace.hasToken() && workspace.repository) {
    return 2;
  }
  if (workspace.hasToken()) {
    return 1;
  }
  return 0;
}
