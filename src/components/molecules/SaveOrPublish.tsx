import PublishIcon from "@mui/icons-material/Publish";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useContext } from "react";
import { WorkspaceContext } from "../../workspace/WorkspaceContext";

export default function SaveOrPublish() {
  const workspace = useContext(WorkspaceContext);
  workspace.useRefresh();

  const actions = [
    {
      icon: <SaveIcon />,
      name: "Save",
      action: () => workspace.saveTranslations(),
    },
    {
      icon: <PublishIcon />,
      name: "Publish",
    },
  ];

  if (!workspace.isReady()) {
    return <></>;
  }
  return (
    <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon openIcon={<CloseIcon />} icon={<CheckIcon />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
