import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/common";
import { Landing } from "@/pages/landing";
import { SignUp, Login } from "@/pages/auth";
import { Dashboard } from "@/pages/dashboard";
import { TreeRecommendation, TreeList } from "@/pages/tree";
import { ApplicationStatus, ApplicationForm } from "@/pages/application";
import { CarbonVisualization } from "@/pages/carbon";
import { Certification } from "@/pages/certification";
import { ESGReport, ExpertReport } from "@/pages/report";
import { AdminPage, ExpertSchedule } from "@/pages/admin";
import { LogoShowcase } from "@/pages/brand";
import { NotFound } from "@/components/common";
import { MyPage } from "@/pages/mypage";

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
      { path: "applications/new", Component: ApplicationForm },
      { path: "trees", Component: TreeList },
      { path: "carbon", Component: CarbonVisualization },
      { path: "certification", Component: Certification },
      { path: "esg-report", Component: ESGReport },
      { path: "expert-report", Component: ExpertReport },
      { path: "admin", Component: AdminPage },
      { path: "admin/schedules", Component: ExpertSchedule },
      { path: "brand", Component: LogoShowcase },
      { path: "*", Component: NotFound },
    ],
  },
]);
