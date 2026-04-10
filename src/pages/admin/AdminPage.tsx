import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  CheckCircle2, Clock, XCircle, Eye, TreePine,
  Building2, TrendingUp, ArrowUpRight, User, ChevronLeft,
} from "lucide-react";

interface MemberPending {
  mid: number;
  mname: string;
  email: string;
  party_name: string;
  company_number: string;
  companyName: string;
  isApproved: number;
}

interface CompanyPending {
  companyId: number;
  companyName: string;
  business_number: string;
  ceoName: string;
  address: string;
  isApproved: number;
}

interface CompanyItem {
  companyId: number;
  companyName: string;
  business_number: string;
  ceoName: string;
  startDate: string;
  address: string;
  isApproved: number;
}

interface MemberItem {
  mid: number;
  mname: string;
  email: string;
  party_name: string;
  company_number: string;
  isApproved: number;
}

type AppStatus = "pending" | "reviewing" | "approved" | "rejected";

interface Application {
  id: string; company: string; species: string; qty: number; location: string; date: string; status: AppStatus; expert: string;
}

const mockApps: Application[] = [
  { id: "APP-0318", company: "그린테크(주)", species: "소나무 외 2종", qty: 120, location: "경기 용인", date: "2026-03-18", status: "pending", expert: "김현수" },
  { id: "APP-0317", company: "에코솔루션", species: "참나무 외 1종", qty: 80, location: "충남 천안", date: "2026-03-17", status: "reviewing", expert: "박지훈" },
  { id: "APP-0316", company: "한국에너지공사", species: "편백나무", qty: 200, location: "전북 전주", date: "2026-03-16", status: "approved", expert: "이민호" },
  { id: "APP-0315", company: "동아제약", species: "느티나무 외 2종", qty: 50, location: "경기 안산", date: "2026-03-15", status: "approved", expert: "정수빈" },
  { id: "APP-0314", company: "그린빌딩(주)", species: "은행나무", qty: 30, location: "서울 강남", date: "2026-03-14", status: "rejected", expert: "최영재" },
  { id: "APP-0312", company: "테크노파크", species: "소나무 외 1종", qty: 150, location: "대전 유성", date: "2026-03-12", status: "pending", expert: "김현수" },
];

const statusMap: Record<AppStatus, { label: string; color: string; icon: any }> = {
  pending: { label: "대기", color: "text-amber-700 bg-amber-50", icon: Clock },
  reviewing: { label: "검토중", color: "text-blue-700 bg-blue-50", icon: Eye },
  approved: { label: "승인", color: "text-emerald-700 bg-emerald-50", icon: CheckCircle2 },
  rejected: { label: "반려", color: "text-red-700 bg-red-50", icon: XCircle },
};

export function AdminPage() {
  const [apps, setApps] = useState(mockApps);
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const [tab, setTab] = useState<"approval" | "applications" | "companies" | "memberList">("approval");
  const [approvalTab, setApprovalTab] = useState<"members" | "companyRequests">("companyRequests");

  const [members, setMembers] = useState<MemberPending[]>([]);
  const [companyReqs, setCompanyReqs] = useState<CompanyPending[]>([]);
  const [companyList, setCompanyList] = useState<CompanyItem[]>([]);
  const [companyMembers, setCompanyMembers] = useState<MemberItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);

  const token = localStorage.getItem("token");

  const fetchPendingMembers = async () => {
    try {
      const res = await axios.get("/api/admin/member/pending", { headers: { Authorization: token } });
      setMembers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPendingCompanies = async () => {
    try {
      const res = await axios.get("/api/admin/company/pending", { headers: { Authorization: token } });
      setCompanyReqs(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCompanyList = async () => {
    try {
      const res = await axios.get("/api/company/list");
      console.log("기업목록:", res.data); // ← 추가
      setCompanyList(res.data);
    } catch (err) { console.error(err); }
  };

  const shouldUpdateRef = useRef(false);

  const fetchCompanyMembers = async (companyId: number) => {
    shouldUpdateRef.current = true;
    setCompanyMembers([]);
    try {
      const res = await axios.get(`/api/member/list/${companyId}`);
      if (shouldUpdateRef.current) {  // 뒤로가기 눌렀으면 false라서 set 안 함
        setCompanyMembers(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingMembers();
    fetchPendingCompanies();
  }, []);

  useEffect(() => {
    if (tab === "memberList") fetchCompanyList();
  }, [tab]);

  const handleMemberAction = async (mid: number, action: "approve" | "reject") => {
    try {
      await axios.patch(`/api/admin/member/${mid}/${action}`, null, { headers: { Authorization: token } });
      fetchPendingMembers();
    } catch (err) { alert("처리에 실패했습니다."); }
  };

  const handleCompanyAction = async (companyId: number, action: "approve" | "reject") => {
    try {
      await axios.patch(`/api/admin/company/${companyId}/${action}`, null, { headers: { Authorization: token } });
      fetchPendingCompanies();
    } catch (err) { alert("처리에 실패했습니다."); }
  };

  const handleCompanyClick = (company: CompanyItem) => {
    setSelectedCompany(company);
    fetchCompanyMembers(company.companyId);
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const handleAction = (id: string, action: AppStatus) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } : a)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.75rem] text-gray-900" style={{ fontWeight: 800 }}>관리자</h1>
        <p className="text-gray-500 mt-1">신청 승인 및 기업 현황을 관리합니다</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "등록 기업", value: String(companyList.length || "-"), icon: Building2, change: "전체", bg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "회원가입 대기", value: String(members.length), icon: User, change: "처리 필요", bg: "bg-amber-50", iconColor: "text-amber-600" },
          { label: "기업등록 대기", value: String(companyReqs.length), icon: Building2, change: "처리 필요", bg: "bg-orange-50", iconColor: "text-orange-600" },
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

      {/* 메인 탭 */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: "approval" as const, label: "승인 관리" },
          { key: "applications" as const, label: "신청 관리" },
          { key: "memberList" as const, label: "등록 기업" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelectedCompany(null); }}
            className={`px-5 py-2 rounded-lg text-[0.9rem] transition-all ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            style={{ fontWeight: 600 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 승인 관리 탭 */}
      {tab === "approval" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex gap-1 p-3 border-b border-gray-100 bg-gray-50">
            {[
              { key: "companyRequests" as const, label: "기업 승인", count: companyReqs.length },
              { key: "members" as const, label: "회원 승인", count: members.length },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setApprovalTab(t.key)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[0.875rem] transition-all ${approvalTab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                style={{ fontWeight: 600 }}
              >
                {t.label}
                {t.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[0.6875rem]" style={{ fontWeight: 700 }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {approvalTab === "companyRequests" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    <th className="text-left px-5 py-3">기업명</th>
                    <th className="text-left px-5 py-3">사업자등록번호</th>
                    <th className="text-left px-5 py-3">대표자명</th>
                    <th className="text-left px-5 py-3">소재지</th>
                    <th className="text-left px-5 py-3">처리</th>
                  </tr>
                </thead>
                <tbody>
                  {companyReqs.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-[0.875rem]">대기 중인 기업이 없습니다</td></tr>
                  )}
                  {companyReqs.map((c) => (
                    <tr key={c.companyId} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>{c.companyName}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{c.business_number}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{c.ceoName}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{c.address}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleCompanyAction(c.companyId, "approve")} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[0.75rem] hover:bg-emerald-100 transition-colors" style={{ fontWeight: 600 }}>승인</button>
                          <button onClick={() => handleCompanyAction(c.companyId, "reject")} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[0.75rem] hover:bg-red-100 transition-colors" style={{ fontWeight: 600 }}>거절</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {approvalTab === "members" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    <th className="text-left px-5 py-3">아이디</th>
                    <th className="text-left px-5 py-3">이름</th>
                    <th className="text-left px-5 py-3">이메일</th>
                    <th className="text-left px-5 py-3">소속 기업</th>
                    <th className="text-left px-5 py-3">연락처</th>
                    <th className="text-left px-5 py-3">처리</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-[0.875rem]">대기 중인 회원이 없습니다</td></tr>
                  )}
                  {members.map((m) => (
                    <tr key={m.mid} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>{m.mname}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{m.party_name}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{m.email}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{m.companyName}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{m.company_number}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleMemberAction(m.mid, "approve")} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[0.75rem] hover:bg-emerald-100 transition-colors" style={{ fontWeight: 600 }}>승인</button>
                          <button onClick={() => handleMemberAction(m.mid, "reject")} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[0.75rem] hover:bg-red-100 transition-colors" style={{ fontWeight: 600 }}>거절</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 신청 관리 탭 */}
      {tab === "applications" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex gap-1 p-3 border-b border-gray-100 bg-gray-50">
            {(["all", "pending", "reviewing", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[0.875rem] transition-all ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                style={{ fontWeight: 600 }}
              >
                {f === "all" ? "전체" : statusMap[f].label}
                {f !== "all" && (
                  <span className="px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[0.6875rem]" style={{ fontWeight: 700 }}>
                    {apps.filter(a => a.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
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
                  <th className="text-left px-5 py-3">전문가</th>
                  <th className="text-left px-5 py-3">처리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const st = statusMap[app.status];
                  const StIcon = st.icon;
                  return (
                    <tr key={app.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>{app.id}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{app.company}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{app.species}</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{app.qty}그루</td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{app.location}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.75rem] ${st.color}`} style={{ fontWeight: 600 }}>
                          <StIcon className="w-3 h-3" />{st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {(app.status === "pending" || app.status === "reviewing") && (
                          <div className="flex gap-1.5">
                            <button onClick={() => handleAction(app.id, "approved")} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[0.75rem] hover:bg-emerald-100 transition-colors" style={{ fontWeight: 600 }}>승인</button>
                            <button onClick={() => handleAction(app.id, "rejected")} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[0.75rem] hover:bg-red-100 transition-colors" style={{ fontWeight: 600 }}>반려</button>
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
      )}

      {/* 등록 기업 탭 */}
      {tab === "memberList" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {selectedCompany === null ? (
            <>
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <p className="text-[0.875rem] text-gray-500">기업을 클릭하면 소속 회원 목록을 볼 수 있습니다</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                      <th className="text-left px-5 py-3">기업명</th>
                      <th className="text-left px-5 py-3">사업자등록번호</th>
                      <th className="text-left px-5 py-3">대표자명</th>
                      <th className="text-left px-5 py-3">개업년월일</th>
                      <th className="text-left px-5 py-3">소재지</th>
                      <th className="text-left px-5 py-3">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyList.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-[0.875rem]">등록된 기업이 없습니다</td></tr>
                    )}
                    {companyList.map((c) => (
                      <tr
                        key={c.companyId}
                        onClick={() => handleCompanyClick(c)}
                        className="border-t border-gray-50 hover:bg-[#f0faf4] cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
                              <Building2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                            </div>
                            <span className="text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>{c.companyName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{c.business_number}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{c.ceoName}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{c.startDate}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{c.address}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] ${c.isApproved === 1 ? "text-emerald-700 bg-emerald-50" :
                            c.isApproved === 2 ? "text-red-700 bg-red-50" : "text-amber-700 bg-amber-50"
                            }`} style={{ fontWeight: 600 }}>
                            {c.isApproved === 1 ? "승인" : c.isApproved === 2 ? "거절" : "대기"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <button
                  onClick={() => {
                    shouldUpdateRef.current = false;  // 응답 와도 무시하게
                    setSelectedCompany(null);
                    setCompanyMembers([]);
                  }}
                  className="flex items-center gap-1 text-[0.875rem] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  기업 목록
                </button>
                <span className="text-gray-300">|</span>
                <p className="text-[0.875rem] text-gray-900" style={{ fontWeight: 600 }}>{selectedCompany.companyName} 소속 회원</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                      <th className="text-left px-5 py-3">아이디</th>
                      <th className="text-left px-5 py-3">이름</th>
                      <th className="text-left px-5 py-3">이메일</th>
                      <th className="text-left px-5 py-3">연락처</th>
                      <th className="text-left px-5 py-3">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyMembers.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-[0.875rem]">소속 회원이 없습니다</td></tr>
                    )}
                    {companyMembers.map((m) => (
                      <tr key={m.mid} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>{m.mname}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{m.party_name}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{m.email}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{m.company_number}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] ${m.isApproved === 1 ? "text-emerald-700 bg-emerald-50" :
                            m.isApproved === 2 ? "text-red-700 bg-red-50" : "text-amber-700 bg-amber-50"
                            }`} style={{ fontWeight: 600 }}>
                            {m.isApproved === 1 ? "승인" : m.isApproved === 2 ? "거절" : "대기"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}