import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { TreePine, BarChart3, Award, Calendar, ArrowRight, TrendingUp, Leaf } from "lucide-react";

type Summary = {
  treeCount: number;
  totalAbsorption: number;
  certStatus: string;
  nextSchedule: string;
};

type MonthlyItem = { month: string; value: number };
type SpeciesItem = { name: string; count: number; ratio: number };

const SPECIES_COLORS = ["#2D6A4F", "#52B788", "#95D5B2", "#B7E4C7", "#D8F3DC"];

export function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyItem[]>([]);
  const [species, setSpecies] = useState<SpeciesItem[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: 인증 컨텍스트에서 memberId 가져오기 (대시보드는 회원/기업 전용)
  const memberId = 1;

  // 대시보드 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryRes, monthlyRes, speciesRes] = await Promise.all([
          axios.get(`/api/carbon/dashboard/summary/${memberId}`),
          axios.get(`/api/carbon/dashboard/monthly/${memberId}`),
          axios.get(`/api/carbon/dashboard/species/${memberId}`),
        ]);
        setSummary(summaryRes.data);
        setMonthly(monthlyRes.data);
        setSpecies(speciesRes.data);
      } catch (e) {
        console.error("대시보드 데이터 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [memberId]);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">로딩 중...</div>;
  }

  const treeCount = summary?.treeCount ?? 0;
  const totalAbsorption = summary?.totalAbsorption ?? 0;
  const certStatus = summary?.certStatus ?? "미인증";
  const nextSchedule = summary?.nextSchedule ?? "예정 없음";

  const summaryCards = [
    { label: "등록 나무 수", value: `${treeCount.toLocaleString()}그루`, icon: TreePine, color: "#2D6A4F", bg: "#D8F3DC" },
    { label: "연간 탄소흡수량", value: `${totalAbsorption.toLocaleString()} kg CO₂`, icon: BarChart3, color: "#52B788", bg: "#D8F3DC" },
    { label: "인증 상태", value: certStatus, icon: Award, color: "#2D6A4F", bg: "#F8F4E3" },
    { label: "다음 점검 일정", value: nextSchedule, icon: Calendar, color: "#6B7280", bg: "#F0F0F0" },
  ];

  const maxMonthly = monthly.length > 0 ? Math.max(...monthly.map((m) => m.value), 1) : 1;
  const monthlyAvg = monthly.length > 0 ? monthly.reduce((s, m) => s + m.value, 0) / 12 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>대시보드</h1>
        <p className="text-muted-foreground mt-1">탄소 관리 현황을 한눈에 확인하세요.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-border">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[0.875rem] text-muted-foreground mb-1">{card.label}</p>
                <p className="text-[1.25rem] truncate" style={{ fontWeight: 700, color: card.color }}>{card.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: card.bg }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Carbon Chart + Species Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Carbon Absorption */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-[1rem]" style={{ fontWeight: 600 }}>월별 탄소흡수량 추이</h2>
          </div>
          <div className="p-5">
            {monthly.length > 0 ? (
              <>
                <div className="flex items-end gap-2 h-64 pt-8">
                  {monthly.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
                      <span className="text-[0.65rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                        {m.value.toFixed(0)}
                      </span>
                      <div
                        className="w-full rounded-t-md transition-all hover:opacity-80"
                        style={{
                          height: `${(m.value / maxMonthly) * 140}px`,
                          background: `linear-gradient(to top, #2D6A4F, #52B788)`,
                          opacity: 0.7 + (m.value / maxMonthly) * 0.3,
                        }}
                      />
                      <span className="text-[0.65rem] text-gray-400">{m.month}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-6 text-[0.8rem] text-gray-500">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#52B788]" />
                    <span>
                      연간 총 흡수량:{" "}
                      <strong className="text-[#2D6A4F]">{totalAbsorption.toLocaleString()} kg CO₂</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#52B788]" />
                    <span>
                      월 평균:{" "}
                      <strong className="text-[#2D6A4F]">{monthlyAvg.toFixed(0)} kg</strong>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">데이터가 없습니다</div>
            )}
          </div>
        </div>

        {/* Species Distribution + Quick Actions */}
        <div className="space-y-6">
          {/* Species Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>수종별 분포</h3>
            {species.length > 0 ? (
              <div className="space-y-3">
                {species.map((sp, i) => (
                  <div key={sp.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[0.8rem]">
                      <span style={{ fontWeight: 500 }}>{sp.name}</span>
                      <span className="text-gray-400">{sp.count}그루 ({sp.ratio}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${sp.ratio}%`, backgroundColor: SPECIES_COLORS[i % SPECIES_COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-[0.875rem] text-center py-6">데이터가 없습니다</div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>빠른 메뉴</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/applications/new")}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#235c43] transition-colors"
              >
                <TreePine className="w-5 h-5" />
                <span className="flex-1 text-left">답사 신청하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/certification")}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#D8F3DC] transition-colors"
              >
                <Award className="w-5 h-5" />
                <span className="flex-1 text-left">인증마크 다운로드</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
