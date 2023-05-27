import { useContext, useState } from "react";
import { WorkspaceContext } from "../../workspace/WorkspaceContext";
import { Step, StepLabel, Stepper } from "@mui/material";

const steps = ["Set credentials", "Select a repository", "Select a language"];

export default function ConfigurationStepper() {
  const workspace = useContext(WorkspaceContext);
  workspace.useRefresh();

  const [activeStep, setActiveStep] = useState(0);

  if (activeStep !== 1 && workspace.hasToken() && !workspace.repository) {
    setActiveStep(1);
  } else if (activeStep !== 2 && workspace.hasToken() && workspace.repository) {
    setActiveStep(2);
  }

  return (
    <Stepper activeStep={activeStep}>
      {steps.map((label) => {
        const stepProps: { completed?: boolean } = {};
        if (workspace.isReady()) {
          stepProps.completed = true;
        }
        return (
          <Step key={label} {...stepProps}>
            <StepLabel>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}
