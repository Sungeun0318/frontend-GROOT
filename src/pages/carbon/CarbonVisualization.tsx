import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TreePine, TrendingUp, Building2, ChevronDown } from "lucide-react";

const COLORS = ["#2D6A4F", "#52B788", "#95D5B2", "#B7E4C7", "#D8F3DC"];

export function CarbonVisualization() {
  const [prediction, setPrediction] = useState<any>(null);
  const [speciesData, setSpeciesData] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = true;
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");

  // 1) 관리자: 기업 목록 로드
  useEffect(() => {
    if (!isAdmin) return;
    axios.get("/api/company/list")
      .then((res) => setCompanies(res.data))
      .catch((e) => console.error("기업 목록 로딩 실패:", e));
  }, [isAdmin]);

  // 2) 탄소 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          // 관리자: 기업별 합산 API 사용
          const companyParam = selectedCompanyId === "all" ? "" : `companyId=${selectedCompanyId}&`;
          const [predRes, speciesRes, monthlyRes, weatherRes] = await Promise.all([
            axios.get(`/api/carbon/company/predict?${companyParam}region=서울`),
            axios.get(`/api/carbon/company/species?${companyParam}`),
            axios.get(`/api/carbon/company/monthly?${companyParam}`),
            axios.get("/api/carbon/weather?region=서울"),
          ]);
          setPrediction(predRes.data);
          setSpeciesData(speciesRes.data);
          setMonthlyData(monthlyRes.data);
          setWeather(weatherRes.data);
        } else {
          // 일반 회원: 자기 데이터만
          const memberId = 1;
          const [predRes, speciesRes, monthlyRes, weatherRes] = await Promise.all([
            axios.get(`/api/carbon/predict/${memberId}?region=서울`),
            axios.get(`/api/carbon/dashboard/species/${memberId}`),
            axios.get(`/api/carbon/dashboard/monthly/${memberId}`),
            axios.get("/api/carbon/weather?region=서울"),
          ]);
          setPrediction(predRes.data);
          setSpeciesData(speciesRes.data);
          setMonthlyData(monthlyRes.data);
          setWeather(weatherRes.data);
        }
      } catch (error) {
        console.error("탄소 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, selectedCompanyId]);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">로딩 중...</div>;
  }

  const totalCo2 = prediction?.currentCo2 ?? 0;
  const comparisons = [
    { emoji: "🚗", label: "자동차 서울↔부산 왕복", value: `${Math.floor(totalCo2 / 102.5)}회`, color: "#3B82F6" },
    { emoji: "✈️", label: "비행기 제주도 왕복", value: `${Math.floor(totalCo2 / 400)}회`, color: "#8B5CF6" },
    { emoji: "🌳", label: "30년생 소나무", value: `${Math.floor(totalCo2 / 37.7)}그루와 동일`, color: "#2D6A4F" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>탄소 현황 시각화</h1>
          <p className="text-muted-foreground mt-1">탄소흡수량 데이터를 그래프로 확인하세요.</p>
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

      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.875rem] text-muted-foreground">총 탄소흡수량</p>
              <p className="text-[2rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {totalCo2.toLocaleString()} <span className="text-[1rem]">kg CO₂</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#2D6A4F]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.875rem] text-muted-foreground">연간 흡수량</p>
              <p className="text-[2rem] text-[#52B788]" style={{ fontWeight: 700 }}>
                {(prediction?.annualAbsorption ?? 0).toLocaleString()} <span className="text-[1rem]">kg</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <TreePine className="w-6 h-6 text-[#52B788]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.875rem] text-muted-foreground">총 나무 수</p>
              <p className="text-[2rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {(prediction?.totalTreeCount ?? 0).toLocaleString()} <span className="text-[1rem]">그루</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <TreePine className="w-6 h-6 text-[#2D6A4F]" />
            </div>
          </div>
        </div>
      </div>

      {/* 날씨 정보 */}
      {weather && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <h3 className="text-[1rem] mb-3" style={{ fontWeight: 600 }}>현재 날씨 ({weather.regionName})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-[0.8rem] text-muted-foreground">기온</p>
              <p className="text-[1.25rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>{weather.temperature}℃</p>
            </div>
            <div className="text-center">
              <p className="text-[0.8rem] text-muted-foreground">습도</p>
              <p className="text-[1.25rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>{weather.humidity}%</p>
            </div>
            <div className="text-center">
              <p className="text-[0.8rem] text-muted-foreground">강수량</p>
              <p className="text-[1.25rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>{weather.rainfall}mm</p>
            </div>
            <div className="text-center">
              <p className="text-[0.8rem] text-muted-foreground">풍속</p>
              <p className="text-[1.25rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>{weather.windSpeed}m/s</p>
            </div>
          </div>
        </div>
      )}

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>월별 탄소흡수량</h3>
          <div className="h-72">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString()} kg CO₂`, "흡수량"]} />
                  <Line type="monotone" dataKey="value" stroke="#2D6A4F" strokeWidth={2.5} dot={{ fill: "#2D6A4F", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">데이터가 없습니다</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>수종별 분포</h3>
          <div className="h-72">
            {speciesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={speciesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    label={({ name, ratio }) => `${name} ${ratio}%`}
                  >
                    {speciesData.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()}그루`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">데이터가 없습니다</div>
            )}
          </div>
        </div>
      </div>

      {/* 연도별 예측 */}
      {prediction?.yearlyPredictions?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>연도별 탄소 예측</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prediction.yearlyPredictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString()} kg`, ""]} />
                <Line type="monotone" dataKey="co2Total" name="총 저장량" stroke="#2D6A4F" strokeWidth={2.5} dot={{ fill: "#2D6A4F", r: 4 }} />
                <Line type="monotone" dataKey="co2Absorbed" name="연간 흡수량" stroke="#52B788" strokeWidth={2} dot={{ fill: "#52B788", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* CO₂ 환산 비교 */}
      {totalCo2 > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>CO₂ 환산 비교</h3>
          <p className="text-[0.875rem] text-muted-foreground mb-5">
            총 {totalCo2.toLocaleString()} kg CO₂ 흡수량은 다음과 같습니다:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comparisons.map((item) => (
              <div key={item.label} className="rounded-xl p-5 text-center" style={{ backgroundColor: item.color + "08", border: `1px solid ${item.color}20` }}>
                <div className="text-[2.5rem] mb-2">{item.emoji}</div>
                <p className="text-[1.5rem]" style={{ fontWeight: 700, color: item.color }}>{item.value}</p>
                <p className="text-[0.875rem] text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
