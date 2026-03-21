import { Download, Share2, Award, TreePine, BarChart3, Calendar, ChevronRight } from "lucide-react";

const grades = [
  { name: "씨앗", emoji: "🌱", trees: "1~50", carbon: "500kg 미만", active: false },
  { name: "새싹", emoji: "🌿", trees: "51~200", carbon: "500~2,000kg", active: true },
  { name: "숲", emoji: "🌳", trees: "201~500", carbon: "2,000~5,000kg", active: false },
  { name: "산림", emoji: "🏔️", trees: "501+", carbon: "5,000kg+", active: false },
];

export function Certification() {
  const currentGradeIndex = 1;
  const progress = ((127 - 51) / (200 - 51)) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>인증마크</h1>
        <p className="text-muted-foreground mt-1">현재 인증 등급을 확인하고 인증서를 다운로드하세요.</p>
      </div>

      <div className="bg-gradient-to-br from-[#2D6A4F] to-[#52B788] rounded-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-[5rem] leading-none">🌿</div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white/70 text-[0.875rem] mb-1">현재 인증 등급</p>
            <h2 className="text-[2rem] mb-4" style={{ fontWeight: 700 }}>새싹 등급</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-white/60 text-[0.75rem]">등록 수목</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 600 }}>127그루</p>
              </div>
              <div>
                <p className="text-white/60 text-[0.75rem]">탄소흡수량</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 600 }}>4,820kg</p>
              </div>
              <div>
                <p className="text-white/60 text-[0.75rem]">유효기간</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 600 }}>2026.12</p>
              </div>
              <div>
                <p className="text-white/60 text-[0.75rem]">다음 등급까지</p>
                <p className="text-[1.25rem]" style={{ fontWeight: 600 }}>73그루</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-[1rem] mb-5" style={{ fontWeight: 600 }}>등급 진행 현황</h3>
        <div className="flex items-center gap-1 mb-6">
          {grades.map((grade, i) => (
            <div key={grade.name} className="flex-1 flex flex-col items-center">
              <div className={`text-[1.5rem] mb-2 ${i <= currentGradeIndex ? "" : "opacity-30"}`}>
                {grade.emoji}
              </div>
              <div
                className={`w-full h-2.5 rounded-full ${
                  i < currentGradeIndex ? "bg-[#52B788]" : i === currentGradeIndex ? "bg-[#52B788]/30 relative overflow-hidden" : "bg-[#F0F0F0]"
                }`}
              >
                {i === currentGradeIndex && (
                  <div className="absolute inset-y-0 left-0 bg-[#52B788] rounded-full" style={{ width: `${progress}%` }} />
                )}
              </div>
              <span className={`text-[0.75rem] mt-2 ${i === currentGradeIndex ? "text-[#2D6A4F]" : "text-muted-foreground"}`} style={{ fontWeight: i === currentGradeIndex ? 600 : 400 }}>
                {grade.name}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-[#F8F4E3] rounded-xl p-4 flex items-center gap-3">
          <Award className="w-5 h-5 text-[#2D6A4F] shrink-0" />
          <p className="text-[0.875rem]">
            <span style={{ fontWeight: 500 }}>숲 등급</span>까지{" "}
            <span className="text-[#2D6A4F]" style={{ fontWeight: 600 }}>73그루</span> 더 등록하면 달성할 수 있습니다!
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>인증 등급 기준</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {grades.map((grade) => (
            <div key={grade.name} className={`rounded-xl p-4 text-center border ${grade.active ? "border-[#2D6A4F] bg-[#D8F3DC]/30" : "border-border"}`}>
              <div className="text-[2rem] mb-2">{grade.emoji}</div>
              <h4 className="text-[1rem] mb-2" style={{ fontWeight: 600 }}>{grade.name}</h4>
              <p className="text-[0.75rem] text-muted-foreground">{grade.trees}그루</p>
              <p className="text-[0.75rem] text-muted-foreground">{grade.carbon}</p>
              {grade.active && <span className="inline-block mt-2 px-2 py-0.5 bg-[#2D6A4F] text-white rounded-full text-[0.625rem]" style={{ fontWeight: 600 }}>현재</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-[1rem] mb-4" style={{ fontWeight: 600 }}>인증서 다운로드</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors">
            <Download className="w-5 h-5" />
            PNG 인증마크
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-3.5 border border-[#2D6A4F] text-[#2D6A4F] rounded-xl hover:bg-[#D8F3DC] transition-colors">
            <Download className="w-5 h-5" />
            PDF 인증서
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-3.5 border border-border rounded-xl hover:bg-muted transition-colors">
            <Share2 className="w-5 h-5" />
            SNS 공유
          </button>
        </div>
      </div>
    </div>
  );
}
