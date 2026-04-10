import { useState, useEffect } from "react";
import axios from "axios";
import { Download, Award, Building2, ChevronDown } from "lucide-react";

type GradeInfo = {
  name: string;
  emoji: string;
  minCarbon: number;
  maxCarbon: number;
  carbon: string;
};

type CertStatus = {
  grade: string;
  treeCount: number;
  totalCarbonAbsorption: number;
  expireDate: string | null;
  carbonUntilNext: number;
  nextGrade: string | null;
  currentGradeIndex: number;
  progress: number;
};

export function Certification() {
  const [status, setStatus] = useState<CertStatus | null>(null);
  const [grades, setGrades] = useState<GradeInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: 인증 컨텍스트에서 isAdmin/memberId 가져오기
  const isAdmin = true;
  const memberId = 1;

  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");

  // 1) 관리자: 기업 목록 로드
  useEffect(() => {
    if (!isAdmin) return;
    axios
      .get("/api/company/list")
      .then((res) => setCompanies(res.data))
      .catch((e) => console.error("기업 목록 로딩 실패:", e));
  }, [isAdmin]);

  // 2) 인증 상태 + 등급 기준 로드
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statusUrl = isAdmin
          ? `/api/certifications/company/status${
              selectedCompanyId === "all" ? "" : `?companyId=${selectedCompanyId}`
            }`
          : `/api/certifications/status/${memberId}`;

        const [statusRes, gradesRes] = await Promise.all([
          axios.get(statusUrl),
          axios.get("/api/certifications/grades"),
        ]);
        setStatus(statusRes.data);
        setGrades(gradesRes.data);
      } catch (e) {
        console.error("인증 데이터 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, memberId, selectedCompanyId]);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">로딩 중...</div>;
  }

  if (!status) {
    return <div className="text-center py-20 text-muted-foreground">인증 데이터를 불러올 수 없습니다.</div>;
  }

  const currentGradeIndex = status.currentGradeIndex;
  const progress = Math.max(0, Math.min(100, status.progress));
  const currentGrade = currentGradeIndex >= 0 && currentGradeIndex < grades.length ? grades[currentGradeIndex] : null;
  const expireText = status.expireDate
    ? status.expireDate.substring(0, 7).replace("-", ".")
    : "-";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>인증마크</h1>
          <p className="text-muted-foreground mt-1">현재 인증 등급을 확인하고 인증서를 다운로드하세요.</p>
        </div>

        {/* 관리자: 기업 선택 드롭다운 */}
        {isAdmin && (
          <div className="relative">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2D6A4F]" />
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="appearance-none bg-white border border-border rounded-xl px-4 py-2.5 pr-10 text-[0.875rem] text-[#2D2D2D] focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                <option value="all">전체 기업</option>
                {companies.map((c: any) => (
                  <option key={c.companyId} value={c.companyId}>
                    {c.companyName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#2D6A4F] to-[#52B788] rounded-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-[5rem] leading-none">{currentGrade?.emoji ?? "🌱"}</div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white/70 text-[0.875rem] mb-1">현재 인증 등급</p>
            <h2 className="text-[2rem] mb-4" style={{ fontWeight: 700 }}>
              {currentGrade ? `${currentGrade.name} 등급` : "미인증"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-white/60 text-[0.75rem]">등록 수목</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 600 }}>
                  {status.treeCount.toLocaleString()}그루
                </p>
              </div>
              <div>
                <p className="text-white/60 text-[0.75rem]">총 탄소흡수량</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 600 }}>
                  {status.totalCarbonAbsorption.toLocaleString()}kg
                </p>
              </div>
              <div>
                <p className="text-white/60 text-[0.75rem]">유효기간</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 600 }}>{expireText}</p>
              </div>
              <div>
                <p className="text-white/60 text-[0.75rem]">다음 등급까지</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 600 }}>
                  {status.nextGrade
                    ? `${Math.round(status.carbonUntilNext).toLocaleString()}kg`
                    : "최고 등급"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-[1rem] mb-5" style={{ fontWeight: 600 }}>등급 진행 현황</h3>
        <div className="flex items-center gap-1 mb-6">
          {grades.map((grade, i) => (
            <div key={grade.name} className="flex-1 flex flex-col items-center">
              <div className={`text-[1.5rem] mb-2 ${i <= currentGradeIndex ? "" : "opacity-30"}`}>
                {grade.emoji}
              </div>
              <div
                className={`w-full h-2.5 rounded-full ${
                  i < currentGradeIndex
                    ? "bg-[#52B788]"
                    : i === currentGradeIndex
                    ? "bg-[#52B788]/30 relative overflow-hidden"
                    : "bg-[#F0F0F0]"
                }`}
              >
                {i === currentGradeIndex && (
                  <div
                    className="absolute inset-y-0 left-0 bg-[#52B788] rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
              <span
                className={`text-[0.75rem] mt-2 ${
                  i === currentGradeIndex ? "text-[#2D6A4F]" : "text-muted-foreground"
                }`}
                style={{ fontWeight: i === currentGradeIndex ? 600 : 400 }}
              >
                {grade.name}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-[#F8F4E3] rounded-xl p-4 flex items-center gap-3">
          <Award className="w-5 h-5 text-[#2D6A4F] shrink-0" />
          <p className="text-[0.875rem]">
            {status.nextGrade ? (
              <>
                <span style={{ fontWeight: 500 }}>{status.nextGrade} 등급</span>까지{" "}
                <span className="text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                  {Math.round(status.carbonUntilNext).toLocaleString()}kg
                </span>{" "}
                더 흡수하면 달성할 수 있습니다!
              </>
            ) : (
              <>최고 등급을 달성했습니다! 🎉</>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>인증 등급 기준</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {grades.map((grade, i) => {
            const active = i === currentGradeIndex;
            return (
              <div
                key={grade.name}
                className={`rounded-xl p-4 text-center border ${
                  active ? "border-[#2D6A4F] bg-[#D8F3DC]/30" : "border-border"
                }`}
              >
                <div className="text-[2rem] mb-2">{grade.emoji}</div>
                <h4 className="text-[1rem] mb-2" style={{ fontWeight: 600 }}>{grade.name}</h4>
                <p className="text-[0.75rem] text-muted-foreground">{grade.carbon}</p>
                {active && (
                  <span
                    className="inline-block mt-2 px-2 py-0.5 bg-[#2D6A4F] text-white rounded-full text-[0.625rem]"
                    style={{ fontWeight: 600 }}
                  >
                    현재
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>인증서 다운로드</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`/api/certifications/download/png/${memberId}`}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors"
            >
              <Download className="w-5 h-5" />
              PNG 인증마크
            </a>
            <a
              href={`/api/certifications/download/pdf/${memberId}`}
              className="flex items-center justify-center gap-2 px-5 py-3.5 border border-[#2D6A4F] text-[#2D6A4F] rounded-xl hover:bg-[#D8F3DC] transition-colors"
            >
              <Download className="w-5 h-5" />
              PDF 인증서
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
