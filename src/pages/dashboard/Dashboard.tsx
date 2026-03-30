import { useNavigate } from "react-router";
import { TreePine, BarChart3, Award, Calendar, ArrowRight, Clock, TrendingUp, Leaf } from "lucide-react";

const summaryCards = [
  { label: "등록 나무 수", value: "127그루", icon: TreePine, color: "#2D6A4F", bg: "#D8F3DC" },
  { label: "총 탄소흡수량", value: "4,820 kg CO₂", icon: BarChart3, color: "#52B788", bg: "#D8F3DC" },
  { label: "인증 상태", value: "✅ 인증중", icon: Award, color: "#2D6A4F", bg: "#F8F4E3" },
  { label: "다음 점검 일정", value: "2025년 9월 예정", icon: Calendar, color: "#6B7280", bg: "#F0F0F0" },
];

const recentApplications = [
  { id: 1, species: "느티나무", qty: 30, date: "2025.03.12", status: "접수중", statusColor: "#EAB308" },
  { id: 2, species: "소나무", qty: 50, date: "2025.02.28", status: "답사 예정", statusColor: "#3B82F6" },
  { id: 3, species: "은행나무", qty: 20, date: "2025.01.15", status: "인증 완료", statusColor: "#22C55E" },
];

const monthlyCarbon = [
  { month: "1월", value: 320 },
  { month: "2월", value: 380 },
  { month: "3월", value: 350 },
  { month: "4월", value: 420 },
  { month: "5월", value: 510 },
  { month: "6월", value: 480 },
  { month: "7월", value: 560 },
  { month: "8월", value: 530 },
  { month: "9월", value: 490 },
  { month: "10월", value: 440 },
  { month: "11월", value: 390 },
  { month: "12월", value: 450 },
];

const speciesDistribution = [
  { name: "느티나무", count: 42, ratio: 33, color: "#2D6A4F" },
  { name: "소나무", count: 35, ratio: 28, color: "#52B788" },
  { name: "은행나무", count: 28, ratio: 22, color: "#95D5B2" },
  { name: "단풍나무", count: 22, ratio: 17, color: "#B7E4C7" },
];

const upcomingSchedules = [
  { id: 1, title: "소나무 B구역 현장 답사", date: "2025.04.05", type: "답사", typeColor: "#3B82F6" },
  { id: 2, title: "느티나무 A구역 성장 점검", date: "2025.04.12", type: "점검", typeColor: "#EAB308" },
  { id: 3, title: "ESG 보고서 제출 마감", date: "2025.04.30", type: "보고", typeColor: "#8B5CF6" },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>대시보드</h1>
        <p className="text-muted-foreground mt-1">그린테크 주식회사의 탄소 관리 현황을 한눈에 확인하세요.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.875rem] text-muted-foreground mb-1">{card.label}</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 700, color: card.color }}>{card.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
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
            <div className="flex items-center gap-1.5 text-[0.8rem] text-[#52B788]" style={{ fontWeight: 600 }}>
              <TrendingUp className="w-4 h-4" />
              전년 대비 +18.2%
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-2 h-48">
              {monthlyCarbon.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[0.65rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                    {m.value}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all hover:opacity-80"
                    style={{
                      height: `${(m.value / 560) * 140}px`,
                      background: `linear-gradient(to top, #2D6A4F, #52B788)`,
                      opacity: 0.7 + (m.value / 560) * 0.3,
                    }}
                  />
                  <span className="text-[0.65rem] text-gray-400">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-6 text-[0.8rem] text-gray-500">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#52B788]" />
                <span>연간 총 흡수량: <strong className="text-[#2D6A4F]">5,320 kg CO₂</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#52B788]" />
                <span>월 평균: <strong className="text-[#2D6A4F]">443 kg</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Species Distribution + Quick Actions */}
        <div className="space-y-6">
          {/* Species Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>수종별 분포</h3>
            <div className="space-y-3">
              {speciesDistribution.map((sp) => (
                <div key={sp.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[0.8rem]">
                    <span style={{ fontWeight: 500 }}>{sp.name}</span>
                    <span className="text-gray-400">{sp.count}그루 ({sp.ratio}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${sp.ratio}%`, backgroundColor: sp.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>빠른 메뉴</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/recommend")}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#235c43] transition-colors"
              >
                <TreePine className="w-5 h-5" />
                <span className="flex-1 text-left">새 나무 신청하기</span>
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

      {/* Recent Applications + Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[1rem]" style={{ fontWeight: 600 }}>최근 신청 현황</h3>
            <button onClick={() => navigate("/applications")} className="text-[0.75rem] text-[#2D6A4F] hover:underline">전체보기</button>
          </div>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F9FA]">
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875rem] truncate" style={{ fontWeight: 500 }}>{app.species} {app.qty}그루</p>
                  <div className="flex items-center gap-1 text-[0.75rem] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {app.date}
                  </div>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[0.75rem]"
                  style={{ fontWeight: 500, backgroundColor: app.statusColor + "20", color: app.statusColor }}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedules */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[1rem]" style={{ fontWeight: 600 }}>예정 일정</h3>
            <span className="text-[0.75rem] text-gray-400">2025년 4월</span>
          </div>
          <div className="space-y-3">
            {upcomingSchedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-[#F8F9FA] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#F0FFF4] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#2D6A4F]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875rem] truncate" style={{ fontWeight: 500 }}>{schedule.title}</p>
                  <p className="text-[0.75rem] text-gray-400">{schedule.date}</p>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[0.7rem]"
                  style={{ fontWeight: 500, backgroundColor: schedule.typeColor + "15", color: schedule.typeColor }}
                >
                  {schedule.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
