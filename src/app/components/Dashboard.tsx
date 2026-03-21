import { useNavigate } from "react-router";
import { TreePine, BarChart3, Award, Calendar, MapPin, ArrowRight, Clock } from "lucide-react";

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

const treeMarkers = [
  { id: 1, name: "느티나무 A구역", location: "서울특별시 강남구", carbon: "38.2 kg", date: "2024.06" },
  { id: 2, name: "소나무 B구역", location: "경기도 수원시", carbon: "52.1 kg", date: "2024.03" },
  { id: 3, name: "은행나무 C구역", location: "인천광역시 연수구", carbon: "29.5 kg", date: "2024.09" },
  { id: 4, name: "단풍나무 D구역", location: "서울특별시 서초구", carbon: "41.8 kg", date: "2024.11" },
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

      {/* Map placeholder + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-[1rem]" style={{ fontWeight: 600 }}>나무 위치 현황</h2>
          </div>
          <div className="p-5">
            <div className="w-full h-72 bg-[#E8F5E9] rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D6A4F' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}/>
              <div className="text-center z-10">
                <MapPin className="w-12 h-12 text-[#2D6A4F] mx-auto mb-3" />
                <p className="text-[#2D6A4F]" style={{ fontWeight: 500 }}>카카오맵 연동 영역</p>
                <p className="text-[0.875rem] text-muted-foreground mt-1">등록된 127그루의 위치가 표시됩니다</p>
              </div>
            </div>
            {/* Tree markers list */}
            <div className="mt-4 space-y-2">
              {treeMarkers.map((marker) => (
                <div key={marker.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#D8F3DC] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#2D6A4F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.875rem] truncate" style={{ fontWeight: 500 }}>{marker.name}</p>
                    <p className="text-[0.75rem] text-muted-foreground">{marker.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[0.875rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>{marker.carbon}</p>
                    <p className="text-[0.75rem] text-muted-foreground">{marker.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
}
