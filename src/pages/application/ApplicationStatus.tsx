import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { X, Phone, CheckCircle, Circle, Plus } from "lucide-react";
import axios from "axios";

const timelineSteps = ["신청", "전문가 배정", "답사 진행", "완료"];

export function ApplicationStatus() {
  const [ applications, setApplications] = useState([]);

  const findAll = async () => {
    try {
      const response = await axios.get(
        //"http://localhost:8080/api/admin/visits",
        
        "http://localhost:8080/api/applications/visit",
        {headers: { Authorization: `${localStorage.getItem("token")}` }}
        // 로그인 기능 구현된 후에 토큰 추가
      );
      const data = response.data;
setApplications(data);
console.log("답사 신청 목록:", data);
    }catch (error) {
      console.error("답사 신청 목록 조회 실패:", error);
    }
  }
      const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState<number | null>(null);

  const getStepIndex = (surveyStatus: string) => {
    switch (surveyStatus) {
      case "신청": return 0;
      case "진행중": return 2;
      case "완료": return 3;
      default: return 0;
    }
  };

  useEffect(() => {
    findAll();
  }, []);

  
  if(applications.length === 0) {
    return (<div>
      <p>답사신청내역 없음</p>
    </div>
    )
  }

  const app = applications.find( (a) => a.detailId === selectedApp);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>답사 신청 현황</h1>
          <p className="text-muted-foreground mt-1">답사 신청 건들의 진행 상태를 확인하세요.</p>
        </div>
        <button
          onClick={() => navigate("/applications/new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-[0.875rem] hover:bg-[#235c43] transition-colors"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          답사 신청
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-border">
                {["차수", "신청일", "신청 내용", "담당 전문가", "진행 상태", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[0.75rem] text-muted-foreground" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.detailId} className="border-b border-border hover:bg-[#F8F9FA] transition-colors">
                  <td className="px-5 py-4 text-[0.875rem]" style={{ fontWeight: 500 }}>{app.times}차</td>
                  <td className="px-5 py-4 text-[0.875rem]">{app.createDate && new Date(app.createDate).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-[0.875rem] max-w-[260px] truncate">{app.content}</td>
                  <td className="px-5 py-4 text-[0.875rem] text-muted-foreground">{app.expertName}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem]" style={{ fontWeight: 500, backgroundColor: app.statusColor + "15", color: app.statusColor }}>
                      {app.statusEmoji} {app.surveyStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelectedApp(app.detailId)} className="text-[0.875rem] text-[#2D6A4F] hover:underline" style={{ fontWeight: 500 }}>
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
              <h3 className="text-[1.125rem]" style={{ fontWeight: 600 }}>답사 상세 정보</h3>
              <button onClick={() => setSelectedApp(null)} className="p-1 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-[0.875rem]">
                <div><span className="text-muted-foreground">차수</span><p style={{ fontWeight: 500 }}>{app.times}차</p></div>
                <div><span className="text-muted-foreground">답사시작일</span><p style={{ fontWeight: 500 }}>{app.dueStartDate}</p></div>
                <div><span className="text-muted-foreground">답사종료일</span><p style={{ fontWeight: 500 }}>{app.dueEndDate}</p></div>
                <div className="col-span-2"><span className="text-muted-foreground">신청 내용</span><p style={{ fontWeight: 500 }}>{app.content}</p></div>
                <div><span className="text-muted-foreground">담당 전문가</span><p style={{ fontWeight: 500 }}>{app.expertId}</p></div>
                <div><span className="text-muted-foreground">상태</span><p style={{ fontWeight: 500 }}>{app.surveyStatus}</p></div>
              </div>

              <div>
                <h4 className="text-[0.875rem] mb-4" style={{ fontWeight: 600 }}>진행 단계</h4>
                <div className="flex items-center">
                  {timelineSteps.map((step, i) => {
                    const currentStep = getStepIndex(app.surveyStatus);
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
