import { useState } from "react";
import { Download, Mail, FileText, Calendar, CheckSquare, Leaf, Building2 } from "lucide-react";

export function ESGReport() {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [includeSpecies, setIncludeSpecies] = useState(true);
  const [includeCalc, setIncludeCalc] = useState(true);
  const [includeMap, setIncludeMap] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>ESG 보고서 출력</h1>
        <p className="text-muted-foreground mt-1">탄소 활동 실적을 공식 PDF 문서로 출력하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-border p-5 space-y-4">
            <h3 className="text-[1rem]" style={{ fontWeight: 600 }}>보고서 설정</h3>
            <div>
              <label className="block text-[0.875rem] text-muted-foreground mb-1.5">시작일</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-border text-[0.875rem] outline-none focus:ring-2 focus:ring-[#52B788]" />
            </div>
            <div>
              <label className="block text-[0.875rem] text-muted-foreground mb-1.5">종료일</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-border text-[0.875rem] outline-none focus:ring-2 focus:ring-[#52B788]" />
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-[0.875rem] mb-3" style={{ fontWeight: 500 }}>포함 항목</p>
              <div className="space-y-2.5">
                {[
                  { label: "수종별 내역", checked: includeSpecies, onChange: setIncludeSpecies },
                  { label: "계산 근거", checked: includeCalc, onChange: setIncludeCalc },
                  { label: "지도 포함", checked: includeMap, onChange: setIncludeMap },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={item.checked} onChange={(e) => item.onChange(e.target.checked)} className="w-4 h-4 rounded accent-[#2D6A4F]" />
                    <span className="text-[0.875rem]" style={{ fontWeight: 400 }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors">
              <Download className="w-5 h-5" /> PDF 다운로드
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border border-[#2D6A4F] text-[#2D6A4F] rounded-xl hover:bg-[#D8F3DC] transition-colors">
              <Mail className="w-5 h-5" /> 이메일로 전송
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-[#F8F9FA]">
              <p className="text-[0.875rem] text-muted-foreground">미리보기 (A4)</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="text-center border-b border-border pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Leaf className="w-6 h-6 text-[#2D6A4F]" />
                  <span className="text-[1.25rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>GROOT</span>
                </div>
                <h2 className="text-[1.5rem] text-[#2D2D2D] mb-2" style={{ fontWeight: 700 }}>ESG 탄소흡수 보고서</h2>
                <p className="text-muted-foreground text-[0.875rem]">Carbon Absorption Report</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[0.875rem]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">기업명:</span>
                  <span style={{ fontWeight: 500 }}>그린테크 주식회사</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">기간:</span>
                  <span style={{ fontWeight: 500 }}>{startDate} ~ {endDate}</span>
                </div>
              </div>
              <div className="bg-[#D8F3DC]/30 rounded-xl p-5">
                <h3 className="text-[1rem] text-[#2D6A4F] mb-3" style={{ fontWeight: 600 }}>탄소흡수 요약</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-[1.5rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>127</p><p className="text-[0.75rem] text-muted-foreground">등록 수목 (그루)</p></div>
                  <div><p className="text-[1.5rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>4,820</p><p className="text-[0.75rem] text-muted-foreground">총 탄소흡수량 (kg CO₂)</p></div>
                  <div><p className="text-[1.5rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>새싹</p><p className="text-[0.75rem] text-muted-foreground">인증 등급</p></div>
                </div>
              </div>
              {includeSpecies && (
                <div>
                  <h3 className="text-[1rem] mb-3" style={{ fontWeight: 600 }}>수종별 상세 내역</h3>
                  <table className="w-full text-[0.875rem]">
                    <thead><tr className="border-b border-border">{["수종", "수량", "탄소흡수량(kg)", "비율"].map((h) => (<th key={h} className="py-2 text-left text-muted-foreground" style={{ fontWeight: 500 }}>{h}</th>))}</tr></thead>
                    <tbody>
                      {[
                        { species: "느티나무", qty: 45, carbon: 1820, ratio: "37.8%" },
                        { species: "소나무", qty: 38, carbon: 1450, ratio: "30.1%" },
                        { species: "은행나무", qty: 22, carbon: 680, ratio: "14.1%" },
                        { species: "단풍나무", qty: 14, carbon: 520, ratio: "10.8%" },
                        { species: "기타", qty: 8, carbon: 350, ratio: "7.3%" },
                      ].map((row) => (
                        <tr key={row.species} className="border-b border-border/50">
                          <td className="py-2">{row.species}</td>
                          <td className="py-2">{row.qty}그루</td>
                          <td className="py-2">{row.carbon.toLocaleString()}</td>
                          <td className="py-2">{row.ratio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {includeCalc && (
                <div className="border border-border rounded-xl p-4">
                  <h3 className="text-[0.875rem] mb-2" style={{ fontWeight: 600 }}>계산 근거</h3>
                  <p className="text-[0.75rem] text-muted-foreground">바이오매스 상대생장식: W = a × DBH^b</p>
                  <p className="text-[0.75rem] text-muted-foreground">탄소전환계수: 0.4737 (국립산림과학원)</p>
                  <p className="text-[0.75rem] text-muted-foreground">데이터 출처: 산림청, 국립산림과학원, 기상청</p>
                </div>
              )}
              <div className="flex justify-end pt-4">
                <div className="w-28 h-28 rounded-full border-4 border-[#2D6A4F] flex flex-col items-center justify-center text-[#2D6A4F] rotate-[-10deg]">
                  <Leaf className="w-6 h-6 mb-1" />
                  <span className="text-[0.625rem]" style={{ fontWeight: 700 }}>GROOT</span>
                  <span className="text-[0.5rem]">CERTIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
