import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./components/Landing";
import { SignUp } from "./components/SignUp";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { TreeRecommendation } from "./components/TreeRecommendation";
import { ApplicationStatus } from "./components/ApplicationStatus";
import { TreeList } from "./components/TreeList";
import { CarbonVisualization } from "./components/CarbonVisualization";
import { Certification } from "./components/Certification";
import { ESGReport } from "./components/ESGReport";
import { ExpertReport } from "./components/ExpertReport";
import { AdminPage } from "./components/AdminPage";
import { LogoShowcase } from "./components/LogoShowcase";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "signup", Component: SignUp },
      { path: "login", Component: Login },
      { path: "dashboard", Component: Dashboard },
      { path: "recommend", Component: TreeRecommendation },
      { path: "applications", Component: ApplicationStatus },
      { path: "trees", Component: TreeList },
      { path: "carbon", Component: CarbonVisualization },
      { path: "certification", Component: Certification },
      { path: "esg-report", Component: ESGReport },
      { path: "expert-report", Component: ExpertReport },
      { path: "admin", Component: AdminPage },
      { path: "brand", Component: LogoShowcase },
      { path: "*", Component: NotFound },
    ],
  },
]);
