import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Thermometer,
  Droplets,
  Star,
  FileText,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type RecommendedTree = {
  treeType: string;
  scientificName: string;
  category: string;
  totalScore: number;
  soilScore: number;
  carbonScore: number;
  weatherScore: number;
  areaScore: number;
  estimatedCarbonPerYear: number;
  estimatedTotalCarbon: number;
  spacingMeter: number;
  reason: string;
};

type SoilInfo = {
  pnuCode: string;
  drainageGrade: number | null;
  effectiveDepth: number | null;
  surfaceTexture: number | null;
};

type RecommendResponse = {
  soilInfo: SoilInfo;
  maxTreesByArea: number;
  recommendations: RecommendedTree[];
};

// 백엔드 가중치 (총점 100)
const W_CARBON = 35;
const W_SOIL = 30;
const W_WEATHER = 20;
const W_AREA = 15;

export function TreeRecommendation() {
  const [step, setStep] = useState(1);

  // Step 1 입력
  const [location, setLocation] = useState("서울");
  const [quantity, setQuantity] = useState(30);
  const [area, setArea] = useState(200);

  // API 상태
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<RecommendResponse | null>(null);

  // TODO: 인증 컨텍스트에서 memberId 가져오기
  const memberId = 1;

  // 시/도 → 기상청 조회용 단축명
  const sidoMap: Record<string, string> = {
    "서울특별시": "서울",
    "부산광역시": "부산",
    "대구광역시": "대구",
    "인천광역시": "인천",
    "광주광역시": "광주",
    "대전광역시": "대전",
    "울산광역시": "울산",
    "세종특별자치시": "세종",
    "경기도": "경기",
    "강원도": "강원",
    "강원특별자치도": "강원",
    "충청북도": "충북",
    "충청남도": "충남",
    "전라북도": "전북",
    "전북특별자치도": "전북",
    "전라남도": "전남",
    "경상북도": "경북",
    "경상남도": "경남",
    "제주특별자치도": "제주",
  };

  // 회원가입 시 저장된 주소에서 시/도 자동 추출
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("/api/member/myinfo", {
          headers: { token: `Bearer ${token}` },
        });
        const address: string | undefined = res.data?.address;
        if (address) {
          const firstWord = address.trim().split(" ")[0];
          setLocation(sidoMap[firstWord] ?? firstWord);
        }
      } catch (e) {
        console.error("회원 정보 조회 실패:", e);
      }
    };
    fetchMemberInfo();
  }, []);

  // 수목 추천 요청
  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/trees/recommend", {
        regionName: location || "서울",
        memberId,
        quantity,
        area,
      });
      setResponse(res.data);
      setStep(2);
    } catch (e) {
      console.error("수목 추천 로딩 실패:", e);
      alert("추천을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const chartData =
    response?.recommendations.map((t) => ({
      name: t.treeType,
      total: Math.round(t.estimatedTotalCarbon),
    })) ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>
          수목 추천
        </h1>
        <p className="text-muted-foreground mt-1">
          지역 기후·토양 기반으로 최적 수종을 추천받아보세요.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {["기본 정보", "수종 추천 결과"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.875rem] ${
                step > i + 1
                  ? "bg-[#52B788] text-white"
                  : step === i + 1
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-[#F0F0F0] text-muted-foreground"
              }`}
              style={{ fontWeight: 600 }}
            >
              {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`text-[0.875rem] hidden sm:block ${
                step === i + 1 ? "text-[#2D6A4F]" : "text-muted-foreground"
              }`}
              style={{ fontWeight: step === i + 1 ? 600 : 400 }}
            >
              {label}
            </span>
            {i < 1 && <div className="w-8 h-px bg-border hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
          <h2 className="text-[1.125rem]" style={{ fontWeight: 600 }}>
            STEP 1 — 기본 정보 입력
          </h2>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">
              지역 <span className="text-[0.75rem] text-muted-foreground">(회원정보에서 자동 설정)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={location}
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F0F0F0] border border-border outline-none cursor-not-allowed text-muted-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">
                희망 수량 (그루)
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">
                면적 (m²)
              </label>
              <input
                type="number"
                min={1}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <button
            onClick={fetchRecommendation}
            disabled={loading}
            className="w-full py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 600 }}
          >
            {loading ? "추천 분석 중..." : "추천 받기"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          {/* 안내 문구 */}
          <div className="bg-[#D8F3DC]/40 border border-[#52B788]/40 rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#2D6A4F] mt-0.5 shrink-0" />
              <div className="space-y-1.5">
                <p className="text-[0.875rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                  추천은 이렇게 진행됩니다
                </p>
                <p className="text-[0.8rem] text-[#2D2D2D]/80 leading-relaxed">
                  회원가입 시 입력하신 <b>소재지 지번</b>을 바탕으로 해당 토지의
                  <b> 배수·토심·토성 등 토양 조건</b>을 조회하고, 선택하신 지역의
                  <b> 기온·습도 등 실시간 기상 정보</b>를 함께 분석해요.
                </p>
                <p className="text-[0.8rem] text-[#2D2D2D]/80 leading-relaxed">
                  국립산림과학원에 등록된 <b>22종의 수목</b>을 대상으로{" "}
                  <b>탄소흡수량(35%) · 토양적합도(30%) · 기후적합도(20%) · 면적적합도(15%)</b>{" "}
                  4가지 항목을 100점 만점으로 채점하여, 가장 점수가 높은{" "}
                  <b>상위 3종</b>을 추천해드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && response && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2D6A4F]" />
                <span className="text-[0.875rem]">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-[0.875rem]">
                  면적: {area.toLocaleString()} m²
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-[0.875rem]">
                  면적 기준 최대 식재:{" "}
                  {response.maxTreesByArea.toLocaleString()}그루
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-[1.125rem]" style={{ fontWeight: 600 }}>
            추천 수종 TOP {response.recommendations.length}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {response.recommendations.map((tree, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={tree.treeType}
                  className="bg-white rounded-xl shadow-sm border border-border p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] ${
                        rank === 1
                          ? "bg-[#2D6A4F] text-white"
                          : "bg-[#D8F3DC] text-[#2D6A4F]"
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      {rank}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className="text-[1.125rem] truncate"
                        style={{ fontWeight: 600 }}
                      >
                        {tree.treeType}
                      </h3>
                      <p className="text-[0.7rem] text-muted-foreground truncate">
                        {tree.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 text-[#52B788] fill-[#52B788]" />
                    <span
                      className="text-[1.25rem] text-[#2D6A4F]"
                      style={{ fontWeight: 700 }}
                    >
                      {tree.totalScore.toFixed(1)}
                    </span>
                    <span className="text-[0.875rem] text-muted-foreground">
                      / 100점
                    </span>
                  </div>

                  <div className="space-y-2 text-[0.875rem]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        그루당 연간 흡수
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        {tree.estimatedCarbonPerYear.toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">연간 총 흡수량</span>
                      <span
                        className="text-[#2D6A4F]"
                        style={{ fontWeight: 600 }}
                      >
                        {tree.estimatedTotalCarbon.toLocaleString()} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">식재 간격</span>
                      <span style={{ fontWeight: 600 }}>
                        {tree.spacingMeter.toFixed(1)} m
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-[0.75rem] text-muted-foreground">
                        {tree.reason}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {[
                      {
                        label: "탄소흡수량 (35%)",
                        val: (tree.carbonScore / W_CARBON) * 100,
                      },
                      {
                        label: "토양적합도 (30%)",
                        val: (tree.soilScore / W_SOIL) * 100,
                      },
                      {
                        label: "기후적합도 (20%)",
                        val: (tree.weatherScore / W_WEATHER) * 100,
                      },
                      {
                        label: "면적적합도 (15%)",
                        val: (tree.areaScore / W_AREA) * 100,
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-[0.75rem] mb-0.5">
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                          <span style={{ fontWeight: 500 }}>
                            {Math.round(item.val)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#52B788] rounded-full"
                            style={{ width: `${Math.min(100, item.val)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>
              수종별 연간 탄소흡수량 비교 ({quantity}그루 기준)
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${v} kg`} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip
                    formatter={(v: number) => `${v.toLocaleString()} kg CO₂`}
                  />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={["#2D6A4F", "#52B788", "#95D5B2"][i % 3]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> 조건 다시 입력
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
