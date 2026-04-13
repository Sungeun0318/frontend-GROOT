import { useState, useEffect } from "react";
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

interface ExpertItem {
  expertId: number;
  expertName: string;
  expertNumber: string;
  expertEmail: string;
  expertState: string;
  sAddress: string;
}

export function AdminPage() {

  

  const [members, setMembers] = useState<MemberPending[]>([]);
  const [companyReqs, setCompanyReqs] = useState<CompanyPending[]>([]);
  const [companyList, setCompanyList] = useState<CompanyItem[]>([]);
  const [companyMembers, setCompanyMembers] = useState<MemberItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);
  const [expertList, setExpertList] = useState<ExpertItem[]>([]);
  const [expertModal, setExpertModal] = useState<"add" | "edit" | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<ExpertItem | null>(null);
  const [expertForm, setExpertForm] = useState({ expertName: "", expertNumber: "", expertEmail: "", expertState: "", sAddress: "" });
  const [tab, setTab] = useState<"approval" | "applications" | "inProgress" | "memberList" | "experts">("approval");
  const [approvalTab, setApprovalTab] = useState<"members" | "companyRequests">("companyRequests");
  const [allVisits, setAllVisits] = useState<ApplicationDto[]>([]); // 전체 기업 신청목록

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
      setCompanyList(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCompanyMembers = async (companyId: number) => {
    try {
      const res = await axios.get(`/api/member/list/${companyId}`);
      setCompanyMembers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchExpertList = async () => {
    try {
      const res = await axios.get("/api/specialist");
      setExpertList(res.data);
    } catch (err) { console.error(err); }
  };

  const handleExpertSave = async () => {
    try {
      if (expertModal === "add") {
        await axios.post("/api/specialist", expertForm);
      } else if (expertModal === "edit" && selectedExpert) {
        await axios.put(`/api/specialist/${selectedExpert.expertId}`, expertForm);
      }
      setExpertModal(null);
      setExpertForm({ expertName: "", expertNumber: "", expertEmail: "", expertState: "", sAddress: "" });
      fetchExpertList();
    } catch (err) { alert("처리에 실패했습니다."); }
  };

  const handleExpertDelete = async (expertId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/specialist/${expertId}`);
      fetchExpertList();
    } catch (err) { alert("삭제에 실패했습니다."); }
  };

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

interface ApplicationDto {
  detailId: number; memberId: number; companyName: string;
  expertId: number; expertName: string;
  surveyStatus: string; requestStatus: string; dueStartDate: string; dueEndDate: string;
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  "승인대기": { label: "승인 대기", color: "text-amber-700 bg-amber-50", icon: Clock },
  "반려": { label: "반려됨", color: "text-red-700 bg-red-50", icon: XCircle },
  "승인완료": { label: "승인완료", color: "text-blue-700 bg-blue-50", icon: CheckCircle2 },
  "진행중": { label: "답사 진행중", color: "text-emerald-700 bg-emerald-50", icon: CheckCircle2 },
  "완료": { label: "답사 완료", color: "text-gray-700 bg-gray-100", icon: CheckCircle2 },
};
  // 모든 답사 내역 조회 API 연동
  const fetchVisits = async() => {
    try{
      const response = await axios.get(`/api/admin/visits`, {headers: {Authorization : token} });
      setAllVisits(response.data);
    }catch(error){
      console.error("답사 내역 로드 실패:", error);
    }
  };


  // 기업 답사신청 승인/반려 API 연동
  const handleVisitPermission = async (detailId: number, status: "승인"|"반려") => {
    try{
      let opinion =""; // 반려일 경우 사유 입력
      if( status === "반려"){
        const input = window.prompt("반려 사유를 입력해주세요:");
        if(input === null) return; // 취소 누르면 api 호출 안함
        opinion = input;
      }

      await axios.put('/api/admin/visit/permission', {
        detailId, requestStatus: status, opinion
      }, {headers: {Authorization: token} });

      alert(`답사 신청이 ${status} 처리되었습니다.`);
      fetchVisits(); // 상태 바뀐 후 전체 목록 가져오기
    }catch(error){
      console.error(error);
      alert("상태변경에 실패했습니다.")
    }
  };

  useEffect(() => {
    fetchPendingMembers();
    fetchPendingCompanies();
    fetchVisits(); // 페이지 첫 로드 시 답사 내역 불러오기
  }, []);

  useEffect(() => {
    if( tab === "memberList") fetchCompanyList();
    if( tab === "experts") fetchExpertList();
  }, [tab]);

  // 탭별로 보여줄 데이터 필터링
  // [답사신청 관리] : '신청', '반려'건만 표시
  const applicationVisits = allVisits.filter(v => v.surveyStatus === "승인대기" || v.surveyStatus === "반려");
  // [진행중인 답사] : 승인 완료되어 일정 진행되는 건들만 표시
  const inProgressVisits = allVisits.filter(v => v.surveyStatus === "승인완료" || v.surveyStatus === "답사 진행중")


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
          { label: "기업 답사 현황",value: String(allVisits.length), icon: TrendingUp, change: "+8.2%", bg: "bg-purple-50", iconColor: "text-purple-600" },
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
          { key: "memberList" as const, label: "등록 기업" },
          { key: "approval" as const, label: "승인 관리" },
          { key: "applications" as const, label: "답사신청 관리" },
          { key: "inProgress" as const, label: "진행중인 답사" },
          { key: "experts" as const, label: "전문가 목록" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelectedCompany(null); }}
            className={`px-5 py-2 rounded-lg text-[0.9rem] transition-all ${
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
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
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[0.875rem] transition-all ${
                  approvalTab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
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

    {/* [3] 답사신청 관리 탭 (승인 대기 및 반려) */}
      {tab === "applications" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <p className="text-[0.875rem] text-gray-500" style={{ fontWeight: 600 }}>기업이 등록한 신규 답사 신청을 승인하거나 반려합니다.</p>
            <span className="text-[0.8rem] text-amber-600 bg-amber-50 px-2 py-1 rounded-md font-bold">
              대기중인 신청: {applicationVisits.filter(v => v.surveyStatus === '승인대기').length}건
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  <th className="text-left px-5 py-3">답사번호</th>
                  <th className="text-left px-5 py-3">기업명(번호)</th>
                  <th className="text-left px-5 py-3">신청 기간</th>
                  <th className="text-left px-5 py-3">상태</th>
                  <th className="text-left px-5 py-3">승인/반려 처리</th>
                </tr>
              </thead>
              <tbody>
                {applicationVisits.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-[0.875rem]">새로운 답사 신청이 없습니다.</td></tr>
                ) : (
                  applicationVisits.map((app) => {
                    const st = statusMap[app.surveyStatus] || statusMap["승인대기"];
                    const StIcon = st.icon;
                    return (
                      <tr key={app.detailId} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>No. {app.detailId}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{app.companyName || `기업코드(${app.memberId})`}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{app.dueStartDate} ~ {app.dueEndDate}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.75rem] ${st.color}`} style={{ fontWeight: 600 }}>
                            <StIcon className="w-3 h-3" />{st.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {app.surveyStatus === "승인대기" ? (
                            <div className="flex gap-1.5">
                              <button onClick={() => handleVisitPermission(app.detailId, "승인")} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[0.75rem] hover:bg-emerald-100 transition-colors" style={{ fontWeight: 600 }}>승인</button>
                              <button onClick={() => handleVisitPermission(app.detailId, "반려")} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[0.75rem] hover:bg-red-100 transition-colors" style={{ fontWeight: 600 }}>반려</button>
                            </div>
                          ) : (
                            <span className="text-[0.75rem] text-gray-400">처리 완료 (반려됨)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* [4] 진행중인 답사 탭 */}
      {tab === "inProgress" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p className="text-[0.875rem] text-gray-500" style={{ fontWeight: 600 }}>승인 완료 및 일정이 진행 중인 답사 목록입니다.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  <th className="text-left px-5 py-3">답사번호</th>
                  <th className="text-left px-5 py-3">기업명(번호)</th>
                  <th className="text-left px-5 py-3">담당 전문가</th>
                  <th className="text-left px-5 py-3">답사 일정</th>
                  <th className="text-left px-5 py-3">현재 상태</th>
                </tr>
              </thead>
              <tbody>
                {inProgressVisits.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-[0.875rem]">진행 중인 답사가 없습니다.</td></tr>
                ) : (
                  inProgressVisits.map((app) => {
                    const st = statusMap[app.surveyStatus] || statusMap["승인완료"];
                    const StIcon = st.icon;
                    return (
                      <tr key={app.detailId} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>No. {app.detailId}</td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-700">{app.companyName || `기업코드(${app.memberId})`}</td>
                        <td className="px-5 py-3.5 text-[0.85rem]">
                          {app.expertName && app.expertName !== "배정준비중" ? (
                            <span className="text-emerald-700" style={{ fontWeight: 600 }}>{app.expertName}</span>
                          ) : (
                            <span className="text-gray-400">배정준비중</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{app.dueStartDate} ~ {app.dueEndDate}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.75rem] ${st.color}`} style={{ fontWeight: 600 }}>
                            <StIcon className="w-3 h-3" />{st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 등록 기업 탭 */}
      {tab === "memberList" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {!selectedCompany ? (
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
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] ${
                            c.isApproved === 1 ? "text-emerald-700 bg-emerald-50" :
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
                  onClick={() => { setSelectedCompany(null); setCompanyMembers([]); }}
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
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] ${
                            m.isApproved === 1 ? "text-emerald-700 bg-emerald-50" :
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
      {/* 전문가 관리 탭 */}
      {tab === "experts" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p className="text-[0.875rem] text-gray-500">전문가 목록을 관리합니다</p>
            <button
              onClick={() => { setExpertForm({ expertName: "", expertNumber: "", expertEmail: "", expertState: "", sAddress: "" }); setExpertModal("add"); }}
              className="px-3 py-1.5 bg-[#2D6A4F] text-white rounded-lg text-[0.8rem] hover:bg-[#235c43] transition-colors"
              style={{ fontWeight: 600 }}
            >+ 전문가 등록</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[0.75rem] text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  <th className="text-left px-5 py-3">이름</th>
                  <th className="text-left px-5 py-3">연락처</th>
                  <th className="text-left px-5 py-3">이메일</th>
                  <th className="text-left px-5 py-3">상태</th>
                  <th className="text-left px-5 py-3">주소</th>
                  <th className="text-left px-5 py-3">관리</th>
                </tr>
              </thead>
              <tbody>
                {expertList.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-[0.875rem]">등록된 전문가가 없습니다</td></tr>
                )}
                {expertList.map((e) => (
                  <tr key={e.expertId} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-900" style={{ fontWeight: 600 }}>{e.expertName}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{e.expertNumber}</td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{e.expertEmail}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] text-emerald-700 bg-emerald-50" style={{ fontWeight: 600 }}>
                        {e.expertState || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-gray-500">{e.sAddress}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => { setSelectedExpert(e); setExpertForm({ expertName: e.expertName, expertNumber: e.expertNumber, expertEmail: e.expertEmail, expertState: e.expertState, sAddress: e.sAddress }); setExpertModal("edit"); }}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[0.75rem] hover:bg-blue-100 transition-colors" style={{ fontWeight: 600 }}
                        >수정</button>
                        <button
                          onClick={() => handleExpertDelete(e.expertId)}
                          className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[0.75rem] hover:bg-red-100 transition-colors" style={{ fontWeight: 600 }}
                        >삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 전문가 등록/수정 모달 */}
      {expertModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-border">
            <p className="text-[1rem] text-gray-900 mb-5" style={{ fontWeight: 700 }}>
              {expertModal === "add" ? "전문가 등록" : "전문가 수정"}
            </p>
            <div className="space-y-3">
              {[
                { label: "이름", key: "expertName", placeholder: "홍길동" },
                { label: "연락처", key: "expertNumber", placeholder: "010-0000-0000" },
                { label: "이메일", key: "expertEmail", placeholder: "expert@email.com" },
                { label: "주소", key: "sAddress", placeholder: "서울특별시..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <p className="text-[0.8125rem] text-gray-500 mb-1">{label}</p>
                  <input
                    value={expertForm[key as keyof typeof expertForm]}
                    onChange={(e) => setExpertForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[0.875rem] outline-none focus:border-[#52B788] focus:ring-2 focus:ring-[#52B788]"
                  />
                </div>
              ))}
              <div>
                <p className="text-[0.8125rem] text-gray-500 mb-1">상태</p>
                <select
                  value={expertForm.expertState}
                  onChange={(e) => setExpertForm(prev => ({ ...prev, expertState: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[0.875rem] outline-none focus:border-[#52B788] focus:ring-2 focus:ring-[#52B788]"
                >
                  <option value="">상태 선택</option>
                  <option value="가용">가용</option>
                  <option value="비가용">비가용</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setExpertModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[0.875rem] text-gray-500 hover:bg-gray-50" style={{ fontWeight: 500 }}>취소</button>
              <button onClick={handleExpertSave} className="flex-1 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-[0.875rem] hover:bg-[#235c43]" style={{ fontWeight: 600 }}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}