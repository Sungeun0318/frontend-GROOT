import { useState } from "react";
import {
  TreePine,
  MapPin,
  Calendar,
  Ruler,
  Camera,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  FileText,
  Leaf,
  CloudSun,
  Droplets,
  ThermometerSun,
  Save,
  X,
} from "lucide-react";

interface TreeMeasurement {
  id: string;
  species: string;
  dbh: string; // 흉고직경 (cm)
  height: string; // 수고 (m)
  crownWidth: string; // 수관폭 (m)
  health: "excellent" | "good" | "fair" | "poor";
  notes: string;
}

const healthLabels: Record<string, { label: string; color: string; emoji: string }> = {
  excellent: { label: "매우 양호", color: "text-emerald-700 bg-emerald-50", emoji: "🟢" },
  good: { label: "양호", color: "text-blue-700 bg-blue-50", emoji: "🔵" },
  fair: { label: "보통", color: "text-amber-700 bg-amber-50", emoji: "🟡" },
  poor: { label: "불량", color: "text-red-700 bg-red-50", emoji: "🔴" },
};

const speciesOptions = ["소나무", "참나무", "편백나무", "느티나무", "은행나무", "벚나무", "메타세쿼이아", "자작나무"];

const mockAssignment = {
  id: "INS-2026-0042",
  applicationId: "APP-2026-0316",
  company: "한국에너지공사",
  location: "전북 전주시 덕진구 금암동 산림복원지구",
  date: "2026-03-18",
  requestedSpecies: ["편백나무"],
  requestedQty: 200,
  area: "25,000m²",
  purpose: "ESG 경영 이행 계획에 따른 대규모 탄소숲 조성",
};

export function ExpertReport() {
  const [submitted, setSubmitted] = useState(false);
  const [measurements, setMeasurements] = useState<TreeMeasurement[]>([
    { id: "1", species: "편백나무", dbh: "18.5", height: "6.2", crownWidth: "2.8", health: "excellent", notes: "활착 상태 양호, 새순 발생 확인" },
    { id: "2", species: "편백나무", dbh: "16.2", height: "5.8", crownWidth: "2.4", health: "good", notes: "" },
    { id: "3", species: "편백나무", dbh: "12.0", height: "4.5", crownWidth: "1.9", health: "fair", notes: "일부 하엽 황변, 배수 상태 확인 필요" },
  ]);

  const [weather, setWeather] = useState({ condition: "맑음", temp: "14", humidity: "55" });
  const [soilType, setSoilType] = useState("사양토");
  const [slopeAngle, setSlopeAngle] = useState("12");
  const [drainageGrade, setDrainageGrade] = useState("양호");
  const [overallNote, setOverallNote] = useState(
    "전반적으로 식재 상태가 양호하며, 활착률은 약 95%로 추정됩니다. 일부 배수 불량 구간(남동쪽 저지대)에서 하엽 황변이 관찰되어 배수로 정비가 필요합니다. 차기 답사 시 생장량 비교 측정 권장합니다."
  );
  const [photos, setPhotos] = useState(["전경 사진 1", "흉고직경 측정 사진", "토양 상태 사진", "배수 불량 구간"]);

  const addMeasurement = () => {
    setMeasurements((prev) => [
      ...prev,
      { id: String(Date.now()), species: "편백나무", dbh: "", height: "", crownWidth: "", health: "good", notes: "" },
    ]);
  };

  const removeMeasurement = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMeasurement = (id: string, field: keyof TreeMeasurement, value: string) => {
    setMeasurements((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  // 탄소흡수량 추정 (간이 공식: DBH 기반)
  const estimateCarbonPerTree = (dbhCm: number) => {
    // W = 0.0396 * DBH^2.3715 (참고: 일반 침엽수 바이오매스 추정식)
    const biomassKg = 0.0396 * Math.pow(dbhCm, 2.3715);
    const carbonKg = biomassKg * 0.5;
    const co2Kg = carbonKg * (44 / 12);
    return co2Kg;
  };

  const totalCO2 = measurements.reduce((sum, m) => {
    const dbh = parseFloat(m.dbh);
    if (isNaN(dbh) || dbh <= 0) return sum;
    return sum + estimateCarbonPerTree(dbh);
  }, 0);

  const avgDbh =
    measurements.reduce((s, m) => s + (parseFloat(m.dbh) || 0), 0) / (measurements.length || 1);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-[1.5rem] text-gray-900 mb-2" style={{ fontWeight: 700 }}>
          보고서가 제출되었습니다
        </h2>
        <p className="text-gray-500 mb-2">
          답사 보고서 #{mockAssignment.id}가 성공적으로 제출되었습니다.
        </p>
        <p className="text-[0.85rem] text-gray-400 mb-8">
          관리자 검토 후 기업에게 결과가 전달됩니다.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#245a42] transition-colors"
          style={{ fontWeight: 600 }}
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[0.8rem] text-[#2D6A4F] mb-2" style={{ fontWeight: 600 }}>
          <FileText className="w-4 h-4" />
          현장 답사 보고서
        </div>
        <h1 className="text-[1.75rem] text-gray-900" style={{ fontWeight: 800 }}>
          답사 보고서 작성
        </h1>
        <p className="text-gray-500 mt-1">현장 측정 데이터를 기록하고 보고서를 제출합니다</p>
      </div>

      {/* Assignment Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-[1rem] text-gray-900 mb-4" style={{ fontWeight: 700 }}>
          답사 기본 정보
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>답사번호</p>
              <p className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>{mockAssignment.id}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <TreePine className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>기업명</p>
              <p className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>{mockAssignment.company}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>위치</p>
              <p className="text-[0.9rem] text-gray-900">{mockAssignment.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>답사일</p>
              <p className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>{mockAssignment.date}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-[0.85rem] text-gray-600">
          <span style={{ fontWeight: 600 }}>신청 내용:</span> {mockAssignment.requestedSpecies.join(", ")} {mockAssignment.requestedQty}그루 · {mockAssignment.area} · {mockAssignment.purpose}
        </div>
      </div>

      {/* Site Conditions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-[1rem] text-gray-900 mb-4" style={{ fontWeight: 700 }}>
          현장 환경 조건
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-[0.8rem] text-gray-500 mb-2" style={{ fontWeight: 600 }}>
              <CloudSun className="w-3.5 h-3.5" /> 날씨
            </label>
            <select
              value={weather.condition}
              onChange={(e) => setWeather({ ...weather, condition: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
            >
              {["맑음", "흐림", "비", "눈", "안개"].map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[0.8rem] text-gray-500 mb-2" style={{ fontWeight: 600 }}>
              <ThermometerSun className="w-3.5 h-3.5" /> 기온 (°C)
            </label>
            <input
              type="number"
              value={weather.temp}
              onChange={(e) => setWeather({ ...weather, temp: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[0.8rem] text-gray-500 mb-2" style={{ fontWeight: 600 }}>
              <Droplets className="w-3.5 h-3.5" /> 습도 (%)
            </label>
            <input
              type="number"
              value={weather.humidity}
              onChange={(e) => setWeather({ ...weather, humidity: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[0.8rem] text-gray-500 mb-2" style={{ fontWeight: 600 }}>
              <Leaf className="w-3.5 h-3.5" /> 토양
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
            >
              {["사양토", "양토", "식양토", "사토", "식토", "점토"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-[0.8rem] text-gray-500 mb-2 block" style={{ fontWeight: 600 }}>
              경사도 (°)
            </label>
            <input
              type="number"
              value={slopeAngle}
              onChange={(e) => setSlopeAngle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="text-[0.8rem] text-gray-500 mb-2 block" style={{ fontWeight: 600 }}>
              배수 등급
            </label>
            <select
              value={drainageGrade}
              onChange={(e) => setDrainageGrade(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
            >
              {["매우양호", "양호", "보통", "불량", "매우불량"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tree Measurements */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[1rem] text-gray-900" style={{ fontWeight: 700 }}>
              수목 개별 측정
            </h2>
            <p className="text-[0.8rem] text-gray-400 mt-0.5">
              흉고직경(DBH), 수고, 수관폭을 측정하여 기록합니다
            </p>
          </div>
          <button
            onClick={addMeasurement}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2D6A4F] text-white rounded-xl text-[0.85rem] hover:bg-[#245a42] transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        <div className="space-y-4">
          {measurements.map((m, idx) => (
            <div key={m.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.85rem] text-gray-700" style={{ fontWeight: 700 }}>
                  #{idx + 1}
                </span>
                <button
                  onClick={() => removeMeasurement(m.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>수종</label>
                  <select
                    value={m.species}
                    onChange={(e) => updateMeasurement(m.id, "species", e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
                  >
                    {speciesOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[0.7rem] text-gray-400 mb-1 flex items-center gap-1" style={{ fontWeight: 600 }}>
                    <Ruler className="w-3 h-3" /> 흉고직경 (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={m.dbh}
                    onChange={(e) => updateMeasurement(m.id, "dbh", e.target.value)}
                    placeholder="0.0"
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>수고 (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={m.height}
                    onChange={(e) => updateMeasurement(m.id, "height", e.target.value)}
                    placeholder="0.0"
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>수관폭 (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={m.crownWidth}
                    onChange={(e) => updateMeasurement(m.id, "crownWidth", e.target.value)}
                    placeholder="0.0"
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>건강상태</label>
                  <select
                    value={m.health}
                    onChange={(e) => updateMeasurement(m.id, "health", e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
                  >
                    {Object.entries(healthLabels).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Inline note */}
              <div className="mt-3">
                <input
                  type="text"
                  value={m.notes}
                  onChange={(e) => updateMeasurement(m.id, "notes", e.target.value)}
                  placeholder="특이사항 메모..."
                  className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                />
              </div>

              {/* Estimated CO2 for this tree */}
              {parseFloat(m.dbh) > 0 && (
                <div className="mt-3 flex items-center gap-2 text-[0.8rem]">
                  <span className="text-gray-400">추정 CO₂ 흡수:</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md" style={{ fontWeight: 600 }}>
                    {estimateCarbonPerTree(parseFloat(m.dbh)).toFixed(1)}kg
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className={`px-2 py-0.5 rounded-md text-[0.75rem] ${healthLabels[m.health].color}`} style={{ fontWeight: 600 }}>
                    {healthLabels[m.health].emoji} {healthLabels[m.health].label}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-[0.8rem] text-gray-400 mb-1">측정 수목</p>
          <p className="text-[1.75rem] text-gray-900" style={{ fontWeight: 700 }}>{measurements.length}</p>
          <p className="text-[0.75rem] text-gray-400">그루</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-[0.8rem] text-gray-400 mb-1">평균 흉고직경</p>
          <p className="text-[1.75rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>{avgDbh.toFixed(1)}</p>
          <p className="text-[0.75rem] text-gray-400">cm</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-[0.8rem] text-gray-400 mb-1">추정 CO₂ 흡수</p>
          <p className="text-[1.75rem] text-emerald-700" style={{ fontWeight: 700 }}>{totalCO2.toFixed(1)}</p>
          <p className="text-[0.75rem] text-gray-400">kg (측정분)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-[0.8rem] text-gray-400 mb-1">건강상태</p>
          <p className="text-[1.75rem] text-blue-700" style={{ fontWeight: 700 }}>
            {measurements.filter((m) => m.health === "excellent" || m.health === "good").length}/{measurements.length}
          </p>
          <p className="text-[0.75rem] text-gray-400">양호 이상</p>
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-[1rem] text-gray-900 mb-4" style={{ fontWeight: 700 }}>
          현장 사진
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <div key={i} className="relative group">
              <div className="aspect-[4/3] bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                <Camera className="w-6 h-6 text-gray-300 mb-1" />
                <span className="text-[0.75rem] text-gray-400">{photo}</span>
              </div>
              <button
                onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setPhotos((p) => [...p, `사진 ${p.length + 1}`])}
            className="aspect-[4/3] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-colors cursor-pointer"
          >
            <Plus className="w-6 h-6 text-gray-300 mb-1" />
            <span className="text-[0.8rem] text-gray-400">사진 추가</span>
          </button>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-[1rem] text-gray-900 mb-4" style={{ fontWeight: 700 }}>
          종합 소견
        </h2>
        <textarea
          value={overallNote}
          onChange={(e) => setOverallNote(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[0.9rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] resize-none"
          placeholder="현장 답사 종합 소견을 작성하세요..."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-[0.95rem]"
          style={{ fontWeight: 600 }}
        >
          <Save className="w-4.5 h-4.5" />
          임시 저장
        </button>
        <button
          onClick={() => setSubmitted(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#245a42] transition-colors text-[0.95rem] shadow-lg shadow-[#2D6A4F]/20"
          style={{ fontWeight: 600 }}
        >
          <Send className="w-4.5 h-4.5" />
          보고서 제출
        </button>
      </div>
    </div>
  );
}
