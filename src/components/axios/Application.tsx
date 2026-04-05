import { CheckCircle, Circle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const applications = [
  { id: 1, date: "2025.03.12", species: "느티나무", qty: 30, location: "서울 강남구 삼성동", status: "접수중", statusColor: "#EAB308", statusEmoji: "🟡" },
  { id: 2, date: "2025.02.28", species: "소나무", qty: 50, location: "경기도 수원시 팔달구", status: "답사 예정", statusColor: "#3B82F6", statusEmoji: "🔵" },
  { id: 3, date: "2025.01.15", species: "은행나무", qty: 20, location: "인천 연수구 송도동", status: "인증 완료", statusColor: "#22C55E", statusEmoji: "🟢" },
  { id: 4, date: "2024.11.20", species: "단풍나무", qty: 15, location: "서울 서초구 반포동", status: "인증 완료", statusColor: "#22C55E", statusEmoji: "🟢" },
  { id: 5, date: "2024.09.05", species: "벚나무", qty: 12, location: "경기도 성남시 분당구", status: "점검 필요", statusColor: "#EF4444", statusEmoji: "🔴" },
];

const timelineSteps = ["접수", "답사", "탄소 계산", "인증"];

export default function Application() {

  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const [applicationlist, setApplicationlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getStepIndex = (status: string) => {
    switch (status) {
      case "접수중": return 0;
      case "답사 예정": return 1;
      case "인증 완료": return 3;
      case "점검 필요": return 3;
      default: return 0;
    }
  };

  const app = applicationlist.find((a) => a.id === selectedApp) || applications.find((a) => a.id === selectedApp);

  const getapplicationlist = async () => {
    try {
      // 백엔드에서 token을 받아와서 사용
      const token = localStorage.getItem("authToken"); // 또는 props로 전달받은 token 사용
      
      if (!token) {
        console.warn("인증 토큰이 없습니다.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8080/api/applications", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setApplicationlist(response.data);
    } catch (error) {
      console.error("기업 신청목록 조회에 실패하였습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getapplicationlist();
  }, []);

  const displayApplications = applicationlist.length > 0 ? applicationlist : applications;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>신청 현황 조회</h1>
        <p className="text-muted-foreground mt-1">신청 건들의 진행 상태를 확인하세요.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-border">
                {["신청일", "수종", "수량", "식재 위치", "진행 상태", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[0.75rem] text-muted-foreground" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayApplications.map((app) => (
                <tr key={app.id} className="border-b border-border hover:bg-[#F8F9FA] transition-colors">
                  <td className="px-5 py-4 text-[0.875rem]">{app.date}</td>
                  <td className="px-5 py-4 text-[0.875rem]" style={{ fontWeight: 500 }}>{app.species}</td>
                  <td className="px-5 py-4 text-[0.875rem]">{app.qty}그루</td>
                  <td className="px-5 py-4 text-[0.875rem] text-muted-foreground">{app.location}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem]" style={{ fontWeight: 500, backgroundColor: app.statusColor + "15", color: app.statusColor }}>
                      {app.statusEmoji} {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelectedApp(app.id)} className="text-[0.875rem] text-[#2D6A4F] hover:underline" style={{ fontWeight: 500 }}>
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && app && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-[1.125rem]" style={{ fontWeight: 600 }}>신청 상세 정보</h3>
              <button onClick={() => setSelectedApp(null)} className="p-1 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-[0.875rem]">
                <div><span className="text-muted-foreground">신청일</span><p style={{ fontWeight: 500 }}>{app.date}</p></div>
                <div><span className="text-muted-foreground">수종</span><p style={{ fontWeight: 500 }}>{app.species}</p></div>
                <div><span className="text-muted-foreground">수량</span><p style={{ fontWeight: 500 }}>{app.qty}그루</p></div>
                <div><span className="text-muted-foreground">식재 위치</span><p style={{ fontWeight: 500 }}>{app.location}</p></div>
              </div>

              <div>
                <h4 className="text-[0.875rem] mb-4" style={{ fontWeight: 600 }}>진행 단계</h4>
                <div className="flex items-center">
                  {timelineSteps.map((step, i) => {
                    const currentStep = getStepIndex(app.status);
                    const done = i <= currentStep;
                    return (
                      <div key={step} className="flex-1 flex flex-col items-center relative">
                        {i > 0 && (
                          <div className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= currentStep ? "bg-[#52B788]" : "bg-[#F0F0F0]"}`} />
                        )}
                        <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                          done ? "bg-[#52B788]" : "bg-[#F0F0F0]"
                        }`}>
                          {done ? <CheckCircle className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <span className={`text-[0.75rem] mt-2 ${done ? "text-[#2D6A4F]" : "text-muted-foreground"}`} style={{ fontWeight: done ? 500 : 400 }}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#F8F9FA] rounded-xl p-4 flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#2D6A4F]" />
                <div>
                  <p className="text-[0.75rem] text-muted-foreground">담당 운영자</p>
                  <p className="text-[0.875rem]" style={{ fontWeight: 500 }}>박지원 매니저 · 02-1234-5678</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}