import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  TreePine,
  MapPin,
  Calendar,
  Building2,
  TrendingUp,
  Award,
  X,
  Search,
  Users,
  ArrowUpRight,
} from "lucide-react";

type AppStatus = "pending" | "reviewing" | "approved" | "rejected";

interface Application {
  id: string;
  company: string;
  species: string;
  qty: number;
  location: string;
  date: string;
  status: AppStatus;
}

const mockApps: Application[] = [
  { id: "APP-0318", company: "그린테크(주)", species: "소나무 외 2종", qty: 120, location: "경기 용인", date: "2026-03-18", status: "pending" },
  { id: "APP-0317", company: "에코솔루션", species: "참나무 외 1종", qty: 80, location: "충남 천안", date: "2026-03-17", status: "reviewing" },
  { id: "APP-0316", company: "한국에너지공사", species: "편백나무", qty: 200, location: "전북 전주", date: "2026-03-16", status: "approved" },
  { id: "APP-0315", company: "동아제약", species: "느티나무 외 2종", qty: 50, location: "경기 안산", date: "2026-03-15", status: "approved" },
  { id: "APP-0314", company: "그린빌딩(주)", species: "은행나무", qty: 30, location: "서울 강남", date: "2026-03-14", status: "rejected" },
  { id: "APP-0312", company: "테크노파크", species: "소나무 외 1종", qty: 150, location: "대전 유성", date: "2026-03-12", status: "pending" },
];

const statusMap: Record<AppStatus, { label: string; color: string; icon: any }> = {
  pending: { label: "대기", color: "text-amber-700 bg-amber-50", icon: Clock },
  reviewing: { label: "검토중", color: "text-blue-700 bg-blue-50", icon: Eye },
  approved: { label: "승인", color: "text-emerald-700 bg-emerald-50", icon: CheckCircle2 },
  rejected: { label: "반려", color: "text-red-700 bg-red-50", icon: XCircle },
};

const companies = [
  { name: "한국에너지공사", trees: 3420, carbon: 22.5, grade: "산림", emoji: "🏔️", color: "#2D6A4F" },
  { name: "그린테크(주)", trees: 1247, carbon: 8.2, grade: "숲", emoji: "🌳", color: "#52B788" },
  { name: "테크노파크", trees: 520, carbon: 5.1, grade: "산림", emoji: "🏔️", color: "#2D6A4F" },
  { name: "에코솔루션", trees: 380, carbon: 2.8, grade: "숲", emoji: "🌳", color: "#52B788" },
  { name: "동아제약", trees: 150, carbon: 0.98, grade: "새싹", emoji: "🌿", color: "#95D5B2" },
  { name: "그린빌딩(주)", trees: 30, carbon: 0.18, grade: "씨앗", emoji: "🌱", color: "#B7E4C7" },
];

export function AdminPage() {
  const [apps, setApps] = useState(mockApps);
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const [tab, setTab] = useState<"applications" | "companies">("applications");
  const [selected, setSelected] = useState<Application | null>(null);

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const handleAction = (id: string, action: AppStatus) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } : a)));
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.75rem] text-gray-900" style={{ fontWeight: 800 }}>
          관리자
        </h1>
        <p className="text-gray-500 mt-1">신청 승인 및 기업 현황을 관리합니다</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "등록 기업", value: "248", icon: Building2, change: "+12", bg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "미처리 신청", value: String(apps.filter((a) => a.status === "pending").length), icon: Clock, change: "처리 필요", bg: "bg-amber-50", iconColor: "text-amber-600" },
          { label: "총 수목", value: "34,520", icon: TreePine, change: "+1,240", bg: "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "탄소흡수량", value: "182.4t", icon: TrendingUp, change: "+8.2%", bg: "bg-purple-50", iconColor: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-[0.8rem] text-gray-500 mb-0.5">{s.label}</p>
            <p className="text-[1.5rem] text-gray-900" style={{ fontWeight: 700 }}>{s.value}</p>
            <p className="text-[0.75rem] text-emerald-600 mt-1 flex items-center gap-0.5" style={{ fontWeight: 600 }}>
              <ArrowUpRight className="w-3 h-3" /> {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: "applications" as const, label: "신청 관리" },
          { key: "companies" as const, label: "기업 현황" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-[0.9rem] transition-all ${
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: 600 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "applications" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "전체" },
                { key: "pending", label: "대기" },
                { key: "reviewing", label: "검토중" },
                { key: "approved", label: "승인" },
                { key: "rejected", label: "반려" },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-lg text-[0.8rem] transition-all ${
                  filter === f.key
                    ? "bg-[#2D6A4F] text-white"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
                style={{ fontWeight: 600 }}
              >
                {f.label}
                {f.key !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    {apps.filter((a) => f.key === "all" || a.status === f.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Application List */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    <th className="text-left px-5 py-3">신청번호</th>
                    <th className="text-left px-5 py-3">기업명</th>
                    <th className="text-left px-5 py-3">수종</th>
                    <th className="text-left px-5 py-3">수량</th>
                    <th className="text-left px-5 py-3">위치</th>
                    <th className="text-left px-5 py-3">상태</th>
                    <th className="text-left px-5 py-3">처리</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => {
                    const st = statusMap[app.status];
                    const StIcon = st.icon;
                    return (
                      <tr key={app.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>
                          {app.id}
                        </td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{app.company}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{app.species}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{app.qty}그루</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{app.location}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.75rem] ${st.color}`} style={{ fontWeight: 600 }}>
                            <StIcon className="w-3 h-3" />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {(app.status === "pending" || app.status === "reviewing") && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleAction(app.id, "approved")}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[0.75rem] hover:bg-emerald-100 transition-colors"
                                style={{ fontWeight: 600 }}
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleAction(app.id, "rejected")}
                                className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[0.75rem] hover:bg-red-100 transition-colors"
                                style={{ fontWeight: 600 }}
                              >
                                반려
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "companies" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  <th className="text-left px-5 py-3">기업명</th>
                  <th className="text-left px-5 py-3">등록 수목</th>
                  <th className="text-left px-5 py-3">탄소흡수량</th>
                  <th className="text-left px-5 py-3">인증등급</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.name} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[0.9rem] text-gray-700">
                      {c.trees.toLocaleString()}그루
                    </td>
                    <td className="px-5 py-3.5 text-[0.9rem] text-gray-700">
                      {c.carbon >= 1 ? `${c.carbon}t` : `${(c.carbon * 1000).toFixed(0)}kg`} CO₂
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-[0.85rem]"
                        style={{ fontWeight: 600, color: c.color }}
                      >
                        {c.emoji} {c.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
