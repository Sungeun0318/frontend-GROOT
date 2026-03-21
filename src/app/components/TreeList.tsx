import { useState } from "react";
import { Search, Filter, X, MapPin, Calendar, Activity, TreePine } from "lucide-react";

const trees = [
  { id: 1, species: "느티나무", dbh: 15.2, location: "서울 강남구 삼성동", carbon: 38.2, regDate: "2024.06.15", health: "양호", cert: "인증완료", gps: "37.5080° N, 127.0628° E" },
  { id: 2, species: "소나무", dbh: 22.8, location: "경기 수원시 팔달구", carbon: 52.1, regDate: "2024.03.20", health: "양호", cert: "인증완료", gps: "37.2636° N, 127.0286° E" },
  { id: 3, species: "은행나무", dbh: 12.5, location: "인천 연수구 송도동", carbon: 29.5, regDate: "2024.09.10", health: "보통", cert: "점검중", gps: "37.3818° N, 126.6569° E" },
  { id: 4, species: "단풍나무", dbh: 18.3, location: "서울 서초구 반포동", carbon: 41.8, regDate: "2024.11.05", health: "양호", cert: "인증완료", gps: "37.5074° N, 127.0113° E" },
  { id: 5, species: "벚나무", dbh: 10.7, location: "경기 성남시 분당구", carbon: 25.3, regDate: "2024.08.22", health: "불량", cert: "점검필요", gps: "37.3595° N, 127.1086° E" },
  { id: 6, species: "느티나무", dbh: 20.1, location: "서울 마포구 상암동", carbon: 45.6, regDate: "2024.04.18", health: "양호", cert: "인증완료", gps: "37.5775° N, 126.8919° E" },
  { id: 7, species: "소나무", dbh: 25.4, location: "경기 용인시 수지구", carbon: 58.2, regDate: "2024.02.10", health: "양호", cert: "인증완료", gps: "37.3219° N, 127.0987° E" },
  { id: 8, species: "참나무", dbh: 19.6, location: "서울 송파구 잠실동", carbon: 44.1, regDate: "2024.07.30", health: "보통", cert: "점검중", gps: "37.5133° N, 127.1001° E" },
];

const healthColors: Record<string, string> = { "양호": "#22C55E", "보통": "#EAB308", "불량": "#EF4444" };
const certColors: Record<string, string> = { "인증완료": "#22C55E", "점검중": "#3B82F6", "점검필요": "#EF4444" };

export function TreeList() {
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [selectedTree, setSelectedTree] = useState<number | null>(null);

  const species = [...new Set(trees.map((t) => t.species))];

  const filtered = trees.filter((t) => {
    if (speciesFilter !== "all" && t.species !== speciesFilter) return false;
    if (search && !t.species.includes(search) && !t.location.includes(search)) return false;
    return true;
  });

  const tree = trees.find((t) => t.id === selectedTree);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>나무 목록</h1>
        <p className="text-muted-foreground mt-1">등록된 나무 전체를 조회하고 상세 정보를 확인하세요.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="수종 또는 위치 검색"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none text-[0.875rem]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white border border-border text-[0.875rem] outline-none focus:ring-2 focus:ring-[#52B788]"
          >
            <option value="all">전체 수종</option>
            {species.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-border">
                {["수종", "DBH(cm)", "위치", "탄소흡수량", "등록일", "건강상태", "인증상태"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[0.75rem] text-muted-foreground whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border hover:bg-[#F8F9FA] transition-colors cursor-pointer" onClick={() => setSelectedTree(t.id)}>
                  <td className="px-4 py-3.5 text-[0.875rem]" style={{ fontWeight: 500 }}>
                    <div className="flex items-center gap-2">
                      <TreePine className="w-4 h-4 text-[#2D6A4F]" />
                      {t.species}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[0.875rem]">{t.dbh}</td>
                  <td className="px-4 py-3.5 text-[0.875rem] text-muted-foreground">{t.location}</td>
                  <td className="px-4 py-3.5 text-[0.875rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>{t.carbon} kg</td>
                  <td className="px-4 py-3.5 text-[0.875rem] text-muted-foreground">{t.regDate}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[0.75rem]" style={{ fontWeight: 500, backgroundColor: healthColors[t.health] + "15", color: healthColors[t.health] }}>
                      {t.health}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[0.75rem]" style={{ fontWeight: 500, backgroundColor: certColors[t.cert] + "15", color: certColors[t.cert] }}>
                      {t.cert}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTree && tree && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTree(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-[1.125rem]" style={{ fontWeight: 600 }}>{tree.species} 상세 정보</h3>
              <button onClick={() => setSelectedTree(null)} className="p-1 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="h-48 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TreePine className="w-10 h-10 text-[#2D6A4F] mx-auto mb-2" />
                  <p className="text-[0.875rem] text-muted-foreground">현장 사진</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[0.875rem]">
                <div><span className="text-muted-foreground block">수종</span><p style={{ fontWeight: 500 }}>{tree.species}</p></div>
                <div><span className="text-muted-foreground block">DBH</span><p style={{ fontWeight: 500 }}>{tree.dbh} cm</p></div>
                <div><span className="text-muted-foreground block">탄소흡수량</span><p className="text-[#2D6A4F]" style={{ fontWeight: 600 }}>{tree.carbon} kg CO₂</p></div>
                <div><span className="text-muted-foreground block">건강상태</span>
                  <span className="px-2 py-0.5 rounded-full text-[0.75rem]" style={{ fontWeight: 500, backgroundColor: healthColors[tree.health] + "15", color: healthColors[tree.health] }}>{tree.health}</span>
                </div>
              </div>

              <div className="bg-[#F8F9FA] rounded-xl p-4 space-y-2 text-[0.875rem]">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{tree.gps}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span>등록일: {tree.regDate}</span></div>
              </div>

              <div className="border border-border rounded-xl p-4">
                <h4 className="text-[0.875rem] mb-2" style={{ fontWeight: 600 }}>탄소흡수량 계산 근거</h4>
                <p className="text-[0.75rem] text-muted-foreground">W = a × DBH^b (바이오매스 상대생장식)</p>
                <p className="text-[0.75rem] text-muted-foreground mt-1">a = 0.0509, b = 2.5843 (국립산림과학원)</p>
                <p className="text-[0.75rem] text-muted-foreground mt-1">탄소전환계수: 0.4737</p>
              </div>

              <div>
                <h4 className="text-[0.875rem] mb-3" style={{ fontWeight: 600 }}>점검 이력</h4>
                <div className="space-y-3">
                  {[
                    { date: "2025.03.01", result: "정기점검 - 양호", icon: Activity },
                    { date: "2024.09.15", result: "정기점검 - 양호", icon: Activity },
                    { date: tree.regDate, result: "최초 등록 및 답사", icon: Calendar },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#D8F3DC] flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-3 h-3 text-[#2D6A4F]" />
                      </div>
                      <div>
                        <p className="text-[0.875rem]" style={{ fontWeight: 500 }}>{item.result}</p>
                        <p className="text-[0.75rem] text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
