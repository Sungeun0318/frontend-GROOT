import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  TreePine,
  ClipboardList,
  Trees,
  BarChart3,
  Award,
  FileText,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ClipboardCheck,
  UserCircle, 
} from "lucide-react";
import { GrootLogo } from "@/components/common/GrootLogo";

const navItems = [
  { to: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { to: "/recommend", label: "수목 추천 · 신청", icon: TreePine },
  { to: "/applications", label: "신청 현황", icon: ClipboardList },
  { to: "/trees", label: "나무 목록", icon: Trees },
  { to: "/carbon", label: "탄소 현황", icon: BarChart3 },
  { to: "/certification", label: "인증마크", icon: Award },
  { to: "/esg-report", label: "ESG 보고서", icon: FileText },
  { to: "/expert-report", label: "전문가 보고서", icon: ClipboardCheck },
  { to: "/admin", label: "관리자", icon: ShieldCheck },
  { to: "/mypage", label: "마이페이지", icon: UserCircle },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Landing, login, signup pages don't use sidebar layout
  if (["/", "/login", "/signup"].includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#2D6A4F] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-2 flex items-center gap-2 border-b border-white/10">
          <GrootLogo size="xl" theme="light" />
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#52B788] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div
              className="w-8 h-8 rounded-full bg-[#52B788] flex items-center justify-center text-white text-[0.75rem]"
              style={{ fontWeight: 600 }}
            >
              GZ
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[0.875rem] text-white truncate"
                style={{ fontWeight: 500 }}
              >
                그린테크 주식회사
              </p>
              <p className="text-[0.75rem] text-white/60 truncate">
                kim@greentech.co.kr
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[0.875rem]">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 shrink-0">
          <button
            className="lg:hidden mr-3 p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
