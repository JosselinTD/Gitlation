import { createBrowserRouter } from "react-router-dom";
import ProjectSelection from "../pages/ProjectSelection";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProjectSelection />,
  },
]);
