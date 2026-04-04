import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Info,
  Send,
} from "lucide-react";

export function ApplicationForm() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");

  const canSubmit = content.trim() !== "" && dueDate !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;

    // TODO: axios 연동
    // const token = localStorage.getItem("token");
    // const res = await axios.post("/api/applications/visit", { content, dueDate }, {
    //   headers: { Authorization: token },
    // });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-border p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-[#2D6A4F]" />
          </div>
          <h2 className="text-[1.375rem] text-[#2D2D2D] mb-2" style={{ fontWeight: 700 }}>
            답사 신청이 완료되었습니다
          </h2>
          <p className="text-muted-foreground text-[0.9375rem] mb-8">
            관리자 확인 후 전문가가 배정되면 알려드리겠습니다.
          </p>

          <div className="bg-[#F8F9FA] rounded-xl p-5 text-left mb-8">
            <h3 className="text-[0.875rem] text-muted-foreground mb-3" style={{ fontWeight: 600 }}>
              신청 요약
            </h3>
            <div className="space-y-2 text-[0.875rem]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">신청 내용</span>
                <span style={{ fontWeight: 500 }}>{content}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">희망 답사일</span>
                <span style={{ fontWeight: 500 }}>{dueDate}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/applications")}
              className="flex-1 py-3 rounded-xl border border-[#2D6A4F] text-[#2D6A4F] text-[0.9375rem] hover:bg-[#D8F3DC] transition-colors"
              style={{ fontWeight: 600 }}
            >
              신청 현황 보기
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setContent("");
                setDueDate("");
              }}
              className="flex-1 py-3 rounded-xl bg-[#2D6A4F] text-white text-[0.9375rem] hover:bg-[#235c43] transition-colors"
              style={{ fontWeight: 600 }}
            >
              추가 신청하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/applications")}
          className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>
            답사 신청
          </h1>
          <p className="text-muted-foreground mt-0.5">
            현장 답사를 신청합니다.
          </p>
        </div>
      </div>

      {/* 안내 */}
      <div className="flex items-start gap-3 bg-[#D8F3DC] rounded-xl p-4">
        <Info className="w-5 h-5 text-[#2D6A4F] mt-0.5 shrink-0" />
        <div className="text-[0.8125rem] text-[#2D6A4F]">
          <p style={{ fontWeight: 600 }} className="mb-1">답사 신청 안내</p>
          <ul className="space-y-0.5 text-[#2D6A4F]/80">
            <li>신청 후 관리자가 확인하여 전문가를 배정합니다.</li>
            <li>전문가 배정 후 답사 일정이 확정됩니다.</li>
            <li>답사 결과에 따라 수목 식재 및 탄소 인증이 진행됩니다.</li>
          </ul>
        </div>
      </div>

      {/* 폼 */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-[1rem]" style={{ fontWeight: 600 }}>신청 정보 입력</h2>
        </div>

        <div className="p-6 space-y-5">
          {/* 신청 내용 */}
          <div>
            <label className="flex items-center gap-2 text-[0.875rem] text-[#2D2D2D] mb-2" style={{ fontWeight: 600 }}>
              <FileText className="w-4 h-4 text-[#2D6A4F]" />
              신청 내용
              <span className="text-[#EF4444] text-[0.75rem]">*필수</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예: 본사 부지 내 녹지 조성을 위한 현장 답사를 요청합니다."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none text-[0.9375rem] resize-none"
            />
          </div>

          {/* 희망 답사일 */}
          <div>
            <label className="flex items-center gap-2 text-[0.875rem] text-[#2D2D2D] mb-2" style={{ fontWeight: 600 }}>
              <CalendarDays className="w-4 h-4 text-[#2D6A4F]" />
              희망 답사일
              <span className="text-[#EF4444] text-[0.75rem]">*필수</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none text-[0.9375rem]"
            />
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/applications")}
          className="flex-1 py-3.5 rounded-xl border border-border text-[0.9375rem] text-muted-foreground hover:bg-[#F8F9FA] transition-colors"
          style={{ fontWeight: 500 }}
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex-1 py-3.5 rounded-xl text-[0.9375rem] transition-colors flex items-center justify-center gap-2 ${
            canSubmit
              ? "bg-[#2D6A4F] text-white hover:bg-[#235c43]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          style={{ fontWeight: 600 }}
        >
          <Send className="w-4 h-4" />
          답사 신청하기
        </button>
      </div>
    </div>
  );
}
