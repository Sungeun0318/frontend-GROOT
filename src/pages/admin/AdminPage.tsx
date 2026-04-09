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
  User,
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

// 추가된 mock 데이터
const mockMembers = [
  { id: "MEM-001", name: "김철수", email: "kim@greentech.co.kr", company: "그린테크(주)", phone: "010-1234-5678", date: "2026-03-19", status: "pending" },
  { id: "MEM-002", name: "이영희", email: "lee@ecosolution.com", company: "에코솔루션", phone: "010-2345-6789", date: "2026-03-18", status: "pending" },
  { id: "MEM-003", name: "박민준", email: "park@energy.co.kr", company: "한국에너지공사", phone: "010-3456-7890", date: "2026-03-17", status: "approved" },
  { id: "MEM-004", name: "최수진", email: "choi@greenbuild.com", company: "그린빌딩(주)", phone: "010-4567-8901", date: "2026-03-16", status: "rejected" },
  { id: "MEM-005", name: "정태양", email: "jung@technopark.kr", company: "테크노파크", phone: "010-5678-9012", date: "2026-03-15", status: "pending" },
];

const mockCompanyReqs = [
  { id: "COM-001", companyName: "스마트그린(주)", bizNumber: "234-56-78901", ceoName: "홍길동", address: "서울 강남구 테헤란로 123", date: "2026-03-19", status: "pending" },
  { id: "COM-002", companyName: "에코파워솔루션", bizNumber: "345-67-89012", ceoName: "김민수", address: "경기 성남시 판교로 456", date: "2026-03-18", status: "pending" },
  { id: "COM-003", companyName: "그린에너지코퍼레이션", bizNumber: "456-78-90123", ceoName: "이지은", address: "부산 해운대구 센텀로 789", date: "2026-03-17", status: "approved" },
  { id: "COM-004", companyName: "자연과기술(주)", bizNumber: "567-89-01234", ceoName: "박서준", address: "인천 연수구 송도대로 321", date: "2026-03-15", status: "rejected" },
];

export function AdminPage() {
  const [apps, setApps] = useState(mockApps);
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const [tab, setTab] = useState<"applications" | "companies" | "members" | "companyRequests">("applications");
  const [selected, setSelected] = useState<Application | null>(null);
  const [members, setMembers] = useState(mockMembers);
  const [companyReqs, setCompanyReqs] = useState(mockCompanyReqs);

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
          { key: "members" as const, label: "회원가입 승인" },
          { key: "companyRequests" as const, label: "기업등록 승인" },
          { key: "companies" as const, label: "기업 현황" },
          { key: "applications" as const, label: "답사 관리" },
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

      {/* 회원가입 승인 탭 - 추가 */}
      {tab === "members" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  <th className="text-left px-5 py-3">이름</th>
                  <th className="text-left px-5 py-3">이메일</th>
                  <th className="text-left px-5 py-3">소속 기업</th>
                  <th className="text-left px-5 py-3">연락처</th>
                  <th className="text-left px-5 py-3">신청일</th>
                  <th className="text-left px-5 py-3">상태</th>
                  <th className="text-left px-5 py-3">처리</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>{m.name}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{m.email}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{m.company}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{m.phone}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{m.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] ${m.status === "pending" ? "text-amber-700 bg-amber-50" : m.status === "approved" ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"}`} style={{ fontWeight: 600 }}>
                        {m.status === "pending" ? "대기" : m.status === "approved" ? "승인" : "거절"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {m.status === "pending" && (
                        <div className="flex gap-1.5">
                          <button onClick={() => setMembers(prev => prev.map(x => x.id === m.id ? { ...x, status: "approved" } : x))} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[0.75rem] hover:bg-emerald-100 transition-colors" style={{ fontWeight: 600 }}>승인</button>
                          <button onClick={() => setMembers(prev => prev.map(x => x.id === m.id ? { ...x, status: "rejected" } : x))} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[0.75rem] hover:bg-red-100 transition-colors" style={{ fontWeight: 600 }}>거절</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 기업등록 승인 탭 - 추가 */}
      {tab === "companyRequests" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  <th className="text-left px-5 py-3">기업명</th>
                  <th className="text-left px-5 py-3">사업자등록번호</th>
                  <th className="text-left px-5 py-3">대표자명</th>
                  <th className="text-left px-5 py-3">소재지</th>
                  <th className="text-left px-5 py-3">신청일</th>
                  <th className="text-left px-5 py-3">상태</th>
                  <th className="text-left px-5 py-3">처리</th>
                </tr>
              </thead>
              <tbody>
                {companyReqs.map((c) => (
                  <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>{c.companyName}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{c.bizNumber}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{c.ceoName}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{c.address}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{c.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] ${c.status === "pending" ? "text-amber-700 bg-amber-50" : c.status === "approved" ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"}`} style={{ fontWeight: 600 }}>
                        {c.status === "pending" ? "대기" : c.status === "approved" ? "승인" : "거절"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {c.status === "pending" && (
                        <div className="flex gap-1.5">
                          <button onClick={() => setCompanyReqs(prev => prev.map(x => x.id === c.id ? { ...x, status: "approved" } : x))} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[0.75rem] hover:bg-emerald-100 transition-colors" style={{ fontWeight: 600 }}>승인</button>
                          <button onClick={() => setCompanyReqs(prev => prev.map(x => x.id === c.id ? { ...x, status: "rejected" } : x))} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[0.75rem] hover:bg-red-100 transition-colors" style={{ fontWeight: 600 }}>거절</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "applications" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "전체" },
                { key: "pending", label: "답사예정" },
                { key: "reviewing", label: "답사중" },
                { key: "approved", label: "답사완료" }
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
                    <th className="text-left px-5 py-3">답사번호</th>
                    <th className="text-left px-5 py-3">기업명</th>
                    <th className="text-left px-5 py-3">답사시작일</th>
                    <th className="text-left px-5 py-3">답사종료일</th>
                    <th className="text-left px-5 py-3">차수</th>
                    <th className="text-left px-5 py-3">신청내용</th>
                    <th className="text-left px-5 py-3">기업담당자</th>
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