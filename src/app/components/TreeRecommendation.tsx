import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, TreePine, ArrowRight, ArrowLeft, CheckCircle, Leaf, Thermometer, Droplets, Star, Calculator, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const recommendedTrees = [
  {
    rank: 1,
    name: "느티나무",
    score: 92,
    carbonPerTree: 38.2,
    price: 25000,
    reason: "국립산림과학원 권장 수종 / 서울 지역 기후 적합도 최상",
    climate: 95,
    carbon: 88,
    management: 90,
    soil: 92,
  },
  {
    rank: 2,
    name: "소나무",
    score: 87,
    carbonPerTree: 42.1,
    price: 18000,
    reason: "산림청 조림권장수종 / 탄소흡수량 최상위",
    climate: 82,
    carbon: 95,
    management: 85,
    soil: 80,
  },
  {
    rank: 3,
    name: "은행나무",
    score: 81,
    carbonPerTree: 29.5,
    price: 30000,
    reason: "서울 도심 적응력 우수 / 미관·조경 가치 높음",
    climate: 90,
    carbon: 72,
    management: 78,
    soil: 85,
  },
];

export function TreeRecommendation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState(30);
  const [purpose, setPurpose] = useState("carbon");
  const [budget, setBudget] = useState("");
  const [selectedTree, setSelectedTree] = useState<number | null>(null);
  const [plantDate, setPlantDate] = useState("");
  const [contact, setContact] = useState("");
  const [memo, setMemo] = useState("");

  const chartData = recommendedTrees.map((t) => ({
    name: t.name,
    total: Math.round(t.carbonPerTree * quantity),
  }));

  const purposes: Record<string, string> = {
    carbon: "탄소흡수 최대화",
    landscape: "미관·조경",
    easy: "관리 편의성",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>수목 추천 · 식재 신청</h1>
        <p className="text-muted-foreground mt-1">지역 기후 기반으로 최적 수종을 추천받고 바로 신청하세요.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {["기본 정보", "수종 추천", "신청서 작성", "완료"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.875rem] ${
                step > i + 1 ? "bg-[#52B788] text-white" : step === i + 1 ? "bg-[#2D6A4F] text-white" : "bg-[#F0F0F0] text-muted-foreground"
              }`}
              style={{ fontWeight: 600 }}
            >
              {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[0.875rem] hidden sm:block ${step === i + 1 ? "text-[#2D6A4F]" : "text-muted-foreground"}`} style={{ fontWeight: step === i + 1 ? 600 : 400 }}>
              {label}
            </span>
            {i < 3 && <div className="w-8 h-px bg-border hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
          <h2 className="text-[1.125rem]" style={{ fontWeight: 600 }}>STEP 1 — 기본 정보 입력</h2>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">식재 위치</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
                placeholder="주소를 검색하세요"
              />
            </div>
            <div className="mt-3 h-48 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#2D6A4F] mx-auto mb-2" />
                <p className="text-[0.875rem] text-muted-foreground">카카오맵 주소 검색 연동 영역</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">희망 수량 (그루)</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">예산 범위 (선택)</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
                placeholder="예: 100만원 이내"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">식재 목적</label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(purposes).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPurpose(key)}
                  className={`px-4 py-2.5 rounded-xl border transition-colors text-[0.875rem] ${
                    purpose === key ? "bg-[#2D6A4F] text-white border-[#2D6A4F]" : "bg-white text-[#2D2D2D] border-border hover:border-[#52B788]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors flex items-center justify-center gap-2"
            style={{ fontWeight: 600 }}
          >
            추천 받기 <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2D6A4F]" />
                <span className="text-[0.875rem]">{location || "서울특별시 강남구"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-[0.875rem]">연평균 기온: 12.5°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-[0.875rem]">연평균 강수량: 1,450mm</span>
              </div>
            </div>
          </div>

          <h2 className="text-[1.125rem]" style={{ fontWeight: 600 }}>추천 수종 TOP 3</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedTrees.map((tree) => (
              <div
                key={tree.rank}
                className={`bg-white rounded-xl shadow-sm border-2 p-5 cursor-pointer transition-all ${
                  selectedTree === tree.rank ? "border-[#2D6A4F] shadow-md" : "border-border hover:border-[#52B788]"
                }`}
                onClick={() => setSelectedTree(tree.rank)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] ${
                    tree.rank === 1 ? "bg-[#2D6A4F] text-white" : "bg-[#D8F3DC] text-[#2D6A4F]"
                  }`} style={{ fontWeight: 700 }}>
                    {tree.rank}
                  </div>
                  <h3 className="text-[1.125rem]" style={{ fontWeight: 600 }}>{tree.name}</h3>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-[#52B788] fill-[#52B788]" />
                  <span className="text-[1.25rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>{tree.score}</span>
                  <span className="text-[0.875rem] text-muted-foreground">/ 100점</span>
                </div>

                <div className="space-y-2 text-[0.875rem]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">그루당 탄소흡수</span>
                    <span style={{ fontWeight: 600 }}>{tree.carbonPerTree} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">총 탄소흡수량</span>
                    <span className="text-[#2D6A4F]" style={{ fontWeight: 600 }}>{(tree.carbonPerTree * quantity).toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">예상 견적</span>
                    <span style={{ fontWeight: 600 }}>{(tree.price * quantity).toLocaleString()}원</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-[0.75rem] text-muted-foreground">{tree.reason}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {[
                    { label: "탄소흡수량 (40%)", val: tree.carbon },
                    { label: "기후적합도 (30%)", val: tree.climate },
                    { label: "관리용이성 (20%)", val: tree.management },
                    { label: "토양적합도 (10%)", val: tree.soil },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[0.75rem] mb-0.5">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span style={{ fontWeight: 500 }}>{item.val}</span>
                      </div>
                      <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div className="h-full bg-[#52B788] rounded-full" style={{ width: `${item.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>수종별 탄소흡수량 비교 ({quantity}그루 기준)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${v} kg`} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} kg CO₂`} />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={["#2D6A4F", "#52B788", "#95D5B2"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 이전
            </button>
            <button
              onClick={() => { if (selectedTree) setStep(3); }}
              disabled={!selectedTree}
              className="flex-1 py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              이 수종으로 신청하기 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
          <h2 className="text-[1.125rem]" style={{ fontWeight: 600 }}>STEP 3 — 신청서 작성</h2>

          <div className="bg-[#D8F3DC]/50 rounded-xl p-4 flex items-center gap-3">
            <Leaf className="w-5 h-5 text-[#2D6A4F]" />
            <div>
              <p className="text-[0.875rem]" style={{ fontWeight: 500 }}>
                선택 수종: <span className="text-[#2D6A4F]">{recommendedTrees.find((t) => t.rank === selectedTree)?.name}</span>
              </p>
              <p className="text-[0.75rem] text-muted-foreground">수량: {quantity}그루</p>
            </div>
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">식재 예정일</label>
            <input
              type="date"
              value={plantDate}
              onChange={(e) => setPlantDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">담당자 연락처</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">기타 요청사항</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none resize-none"
              placeholder="추가 요청사항을 입력해주세요"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 이전
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors"
              style={{ fontWeight: 600 }}
            >
              신청 완료
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-[#D8F3DC] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#2D6A4F]" />
          </div>
          <h2 className="text-[1.5rem] text-[#2D2D2D] mb-3" style={{ fontWeight: 700 }}>신청이 완료되었습니다!</h2>
          <p className="text-muted-foreground mb-2">
            {recommendedTrees.find((t) => t.rank === selectedTree)?.name} {quantity}그루 식재 신청이 접수되었습니다.
          </p>
          <p className="text-[0.875rem] text-muted-foreground mb-8">3일 이내 담당자가 연락드릴 예정입니다.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/applications")}
              className="px-6 py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors"
              style={{ fontWeight: 600 }}
            >
              신청 현황 확인하기
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
            >
              대시보드로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
