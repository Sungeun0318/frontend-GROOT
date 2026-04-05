import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/common";
import { Landing } from "@/pages/landing";
import { SignUp, Login } from "@/pages/auth";
import { Dashboard } from "@/pages/dashboard";
import { TreeRecommendation, TreeList } from "@/pages/tree";
import { ApplicationStatus } from "@/pages/application";
import { CarbonVisualization } from "@/pages/carbon";
import { Certification } from "@/pages/certification";
import { ESGReport, ExpertReport } from "@/pages/report";
import { AdminPage } from "@/pages/admin";
import { LogoShowcase } from "@/pages/brand";
import { NotFound } from "@/components/common";
import { MyPage } from "@/pages/mypage";
import Application from "@/components/axios/Application";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "signup", Component: SignUp },
      { path: "login", Component: Login },
      { path: "mypage", Component: MyPage },
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
      { path: "api/applications", Component: Application },
      { path: "*", Component: NotFound },
    ],
  },
]);
