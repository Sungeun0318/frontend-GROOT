import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Car, Plane, TreePine, TrendingUp, TrendingDown } from "lucide-react";

const monthlyData = [
  { month: "1월", carbon: 280 },
  { month: "2월", carbon: 420 },
  { month: "3월", carbon: 650 },
  { month: "4월", carbon: 890 },
  { month: "5월", carbon: 1200 },
  { month: "6월", carbon: 1580 },
  { month: "7월", carbon: 2100 },
  { month: "8월", carbon: 2650 },
  { month: "9월", carbon: 3200 },
  { month: "10월", carbon: 3800 },
  { month: "11월", carbon: 4300 },
  { month: "12월", carbon: 4820 },
];

const speciesData = [
  { name: "느티나무", value: 1820, color: "#2D6A4F" },
  { name: "소나무", value: 1450, color: "#52B788" },
  { name: "은행나무", value: 680, color: "#95D5B2" },
  { name: "단풍나무", value: 520, color: "#B7E4C7" },
  { name: "기타", value: 350, color: "#D8F3DC" },
];

const comparisons = [
  { icon: Car, emoji: "🚗", label: "자동차 서울↔부산 왕복", value: "47회", color: "#3B82F6" },
  { icon: Plane, emoji: "✈️", label: "비행기 제주도 왕복", value: "12회", color: "#8B5CF6" },
  { icon: TreePine, emoji: "🌳", label: "30년생 소나무", value: "128그루와 동일", color: "#2D6A4F" },
];

export function CarbonVisualization() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>탄소 현황 시각화</h1>
        <p className="text-muted-foreground mt-1">탄소흡수량 데이터를 그래프로 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.875rem] text-muted-foreground">총 탄소흡수량</p>
              <p className="text-[2rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>4,820 <span className="text-[1rem]">kg CO₂</span></p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#2D6A4F]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.875rem] text-muted-foreground">전년 대비 증감률</p>
              <p className="text-[2rem] text-[#52B788]" style={{ fontWeight: 700 }}>+32.5%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#52B788]" />
            </div>
          </div>
          <p className="text-[0.75rem] text-muted-foreground mt-2">전년도: 3,638 kg CO₂</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>① 월별 누적 탄소흡수량</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}`} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString()} kg CO₂`, "탄소흡수량"]} />
                <Line type="monotone" dataKey="carbon" stroke="#2D6A4F" strokeWidth={2.5} dot={{ fill: "#2D6A4F", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>② 수종별 탄소 비율</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={speciesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {speciesData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} kg CO₂`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-5">
        <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>③ CO₂ 환산 비교</h3>
        <p className="text-[0.875rem] text-muted-foreground mb-5">
          총 4,820 kg CO₂ 흡수량은 다음과 같습니다:
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
    </div>
  );
}
