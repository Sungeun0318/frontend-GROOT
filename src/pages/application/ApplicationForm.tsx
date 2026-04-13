import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Info,
  Send,
  ChevronLeft,
  ChevronRight,
  Ban,
} from "lucide-react";
import axios from "axios";

interface ScheduleItem {
  visitId: number;
  expertId: number;
  scheduleStart: string;
  scheduleEnd: string;
  scheduleState: string;
}

// 날짜 포맷 유틸
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

// 해당 날짜에 불가인 전문가 ID 수 계산
function getBlockedCount(dateStr: string, schedules: ScheduleItem[]): number {
  const blockedIds = new Set<number>();
  for (const s of schedules) {
    if (dateStr >= s.scheduleStart && dateStr <= s.scheduleEnd) {
      blockedIds.add(s.expertId);
    }
  }
  return blockedIds.size;
}

// 가용 전문가 전원이 불가할 때만 신청 불가
function isAllBlocked(dateStr: string, schedules: ScheduleItem[], totalAvailable: number): boolean {
  if (totalAvailable === 0) return true;
  return getBlockedCount(dateStr, schedules) >= totalAvailable;
}

// 미니 달력 컴포넌트
function MiniCalendar({
  selectedDate,
  onSelect,
  schedules,
  label,
  minDate,
  totalAvailable,
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
  schedules: ScheduleItem[];
  label: string;
  minDate?: string;
  totalAvailable: number;
}) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const days = getMonthDays(viewYear, viewMonth);
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-[0.875rem] text-[#2D2D2D] mb-2" style={{ fontWeight: 600 }}>
        <CalendarDays className="w-4 h-4 text-[#2D6A4F]" />
        {label}
        <span className="text-[#EF4444] text-[0.75rem]">*필수</span>
      </label>

      <div className="rounded-xl border border-border bg-[#F8F9FA] p-4">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={prevMonth} className="p-1 hover:bg-white rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-[0.875rem]" style={{ fontWeight: 600 }}>
            {viewYear}년 {viewMonth + 1}월
          </span>
          <button type="button" onClick={nextMonth} className="p-1 hover:bg-white rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div
              key={d}
              className={`text-center text-[0.7rem] py-0.5 ${
                i === 0 ? "text-[#EF4444]" : i === 6 ? "text-[#3B82F6]" : "text-muted-foreground"
              }`}
              style={{ fontWeight: 600 }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) return <div key={`e-${idx}`} />;
            const dateStr = toDateStr(viewYear, viewMonth, day);
            const allBlocked = isAllBlocked(dateStr, schedules, totalAvailable);
            const isPast = dateStr < todayStr;
            const isBelowMin = minDate ? dateStr < minDate : false;
            const isSelected = dateStr === selectedDate;
            const disabled = allBlocked || isPast || isBelowMin;
            const dayOfWeek = new Date(viewYear, viewMonth, day).getDay();

            return (
              <button
                key={day}
                type="button"
                onClick={() => !disabled && onSelect(dateStr)}
                disabled={disabled}
                className={`h-9 rounded-lg text-[0.8rem] transition-all relative ${
                  isSelected
                    ? "bg-[#2D6A4F] text-white"
                    : allBlocked
                    ? "bg-[#FEE2E2] text-[#EF4444]/60 cursor-not-allowed"
                    : isPast || isBelowMin
                    ? "text-gray-300 cursor-not-allowed"
                    : dateStr === todayStr
                    ? "bg-[#D8F3DC] text-[#2D6A4F] hover:bg-[#B7E4C7]"
                    : "hover:bg-white text-[#2D2D2D]"
                }`}
                style={{ fontWeight: isSelected ? 600 : 400 }}
              >
                <span className={`${
                  !isSelected && !allBlocked && dayOfWeek === 0 ? "text-[#EF4444]" : ""
                } ${!isSelected && !allBlocked && dayOfWeek === 6 ? "text-[#3B82F6]" : ""}`}>
                  {day}
                </span>
                {allBlocked && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#EF4444]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-[0.7rem] text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-[#FEE2E2] border border-[#EF4444]/20" /> 신청 불가
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-[#D8F3DC] border border-[#52B788]/30" /> 오늘
          </span>
        </div>
      </div>

      {selectedDate && (
        <p className="text-[0.8125rem] text-[#2D6A4F] mt-2" style={{ fontWeight: 500 }}>
          선택: {selectedDate}
        </p>
      )}
    </div>
  );
}

export function ApplicationForm() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [content, setContent] = useState("");
  const [dueStartDate, setDueStartDate] = useState("");
  const [dueEndDate, setDueEndDate] = useState("");

  // 전문가 불가능 일정 + 가용 전문가 수
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  // 불가 일정 + 전문가 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [scheduleRes, expertRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/schedule/unavailable?startDate=${today}`),
          axios.get("http://localhost:8080/api/specialist"),
        ]);
        setSchedules(scheduleRes.data);
        // 가용 상태인 전문가만 카운트
        const availableCount = expertRes.data.filter(
          (e: { expertState: string }) => e.expertState === "가용"
        ).length;
        setTotalAvailable(availableCount);
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      } finally {
        setLoadingSchedules(false);
      }
    };
    fetchData();
  }, []);

  const canSubmit = content.trim() !== "" && dueStartDate !== "" && dueEndDate !== "";

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const obj = { content, dueStartDate, dueEndDate };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/applications/visit",
        obj,
        { headers: { Authorization: `${token}` } }
      );
      const data = response.data;

      if (data) {
        setSubmitted(true);
      } else {
        alert("답사 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("답사 신청 실패:", error);
      alert("답사 등록에 실패했습니다.");
    }
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

          <p className="text-muted-foreground text-[0.9375rem] mb-4">
            관리자 승인 후 전문가가 자동 배정됩니다.
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
                <span className="text-muted-foreground">답사 시작일</span>
                <span style={{ fontWeight: 500 }}>{dueStartDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">답사 종료일</span>
                <span style={{ fontWeight: 500 }}>{dueEndDate}</span>
              </div>
              {/* 배정 전문가는 승인 후 ApplicationStatus에서 확인 */}
              {false && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">배정 전문가</span>
                  <span className="text-[#2D6A4F]" style={{ fontWeight: 600 }}>{assignedExpertName}</span>
                </div>
              )}
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
                setDueStartDate("");
                setDueEndDate("");
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
            <li>신청 시 지역과 일정에 맞는 전문가가 자동 배정됩니다.</li>
            <li>빨간색으로 표시된 날짜는 전문가 불가 일정입니다.</li>
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

          {/* 답사 시작일 - 커스텀 달력 */}
          {loadingSchedules ? (
            <div className="text-center py-6 text-muted-foreground text-[0.875rem]">
              전문가 일정을 불러오는 중...
            </div>
          ) : (
            <>
              <MiniCalendar
                selectedDate={dueStartDate}
                onSelect={(date) => {
                  setDueStartDate(date);
                  // 종료일이 시작일보다 이전이면 초기화
                  if (dueEndDate && dueEndDate < date) {
                    setDueEndDate("");
                  }
                }}
                schedules={schedules}
                totalAvailable={totalAvailable}
                label="답사 시작일"
              />

              <MiniCalendar
                selectedDate={dueEndDate}
                onSelect={setDueEndDate}
                schedules={schedules}
                totalAvailable={totalAvailable}
                label="답사 종료일"
                minDate={dueStartDate || undefined}
              />
            </>
          )}
        </div>
      </div>

      {/* 불가 일정 안내 */}
      {schedules.length > 0 && (
        <div className="flex items-start gap-3 bg-[#FEF2F2] rounded-xl p-4">
          <Ban className="w-5 h-5 text-[#EF4444] mt-0.5 shrink-0" />
          <div className="text-[0.8125rem] text-[#991B1B]">
            <p style={{ fontWeight: 600 }} className="mb-1">
              전문가 불가 일정 안내
            </p>
            <p className="text-[#991B1B]/70">
              빨간색 날짜는 가용 전문가가 없어 신청이 불가합니다.
            </p>
          </div>
        </div>
      )}

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
