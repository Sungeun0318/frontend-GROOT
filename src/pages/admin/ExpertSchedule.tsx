import { useState } from "react";
import {
  CalendarDays,
  User,
  Phone,
  MapPin,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Ban,
} from "lucide-react";

interface Expert {
  expertId: number;
  expertName: string;
  expertNumber: string;
  expertEmail: string;
  expertState: string;
  sAddress: string;
}

interface Schedule {
  visitId: number;
  expertId: number;
  scheduleStart: string;
  scheduleEnd: string;
  scheduleState: string;
}

const mockExperts: Expert[] = [
  { expertId: 1, expertName: "김전문", expertNumber: "010-1111-2222", expertEmail: "kim@expert.com", expertState: "가용", sAddress: "서울시 강남구" },
  { expertId: 2, expertName: "이전문", expertNumber: "010-3333-4444", expertEmail: "lee@expert.com", expertState: "배정중", sAddress: "경기도 수원시" },
  { expertId: 3, expertName: "박전문", expertNumber: "010-5555-6666", expertEmail: "park@expert.com", expertState: "가용", sAddress: "인천시 연수구" },
  { expertId: 4, expertName: "최전문", expertNumber: "010-7777-8888", expertEmail: "choi@expert.com", expertState: "가용", sAddress: "대전시 유성구" },
];

const mockSchedules: Schedule[] = [
  { visitId: 1, expertId: 1, scheduleStart: "2025-04-07", scheduleEnd: "2025-04-09", scheduleState: "불가" },
  { visitId: 2, expertId: 1, scheduleStart: "2025-04-14", scheduleEnd: "2025-04-14", scheduleState: "불가" },
  { visitId: 3, expertId: 2, scheduleStart: "2025-04-07", scheduleEnd: "2025-04-08", scheduleState: "불가" },
  { visitId: 4, expertId: 2, scheduleStart: "2025-04-21", scheduleEnd: "2025-04-23", scheduleState: "불가" },
  { visitId: 5, expertId: 3, scheduleStart: "2025-04-10", scheduleEnd: "2025-04-12", scheduleState: "불가" },
  { visitId: 6, expertId: 4, scheduleStart: "2025-04-07", scheduleEnd: "2025-04-07", scheduleState: "불가" },
];

const stateColors: Record<string, { color: string; bg: string }> = {
  "가용": { color: "#22C55E", bg: "#22C55E15" },
  "배정중": { color: "#3B82F6", bg: "#3B82F615" },
};

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isInRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

// 해당 날짜에 불가인 전문가 ID 목록
function getBlockedExpertIds(dateStr: string): number[] {
  const ids = new Set<number>();
  for (const s of mockSchedules) {
    if (isInRange(dateStr, s.scheduleStart, s.scheduleEnd)) {
      ids.add(s.expertId);
    }
  }
  return Array.from(ids);
}

export function ExpertSchedule() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addExpertId, setAddExpertId] = useState<number | "">("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const days = getMonthDays(viewYear, viewMonth);
  const monthLabel = `${viewYear}년 ${viewMonth + 1}월`;
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
    setSelectedDate(null);
  };

  // 선택한 날짜에 불가인 전문가들
  const blockedIds = selectedDate ? getBlockedExpertIds(selectedDate) : [];
  const blockedExperts = mockExperts.filter((e) => blockedIds.includes(e.expertId));
  const availableExperts = mockExperts.filter((e) => !blockedIds.includes(e.expertId));

  // 선택한 날짜에 해당하는 스케줄 상세
  const dateSchedules = selectedDate
    ? mockSchedules.filter((s) => isInRange(selectedDate, s.scheduleStart, s.scheduleEnd))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>전문가 일정 관리</h1>
          <p className="text-muted-foreground mt-1">캘린더에서 날짜를 눌러 불가능한 전문가를 확인하세요.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-[0.875rem] hover:bg-[#235c43] transition-colors"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          불가 일정 등록
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 캘린더 (3칸) */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <button onClick={prevMonth} className="p-1.5 hover:bg-[#F8F9FA] rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-[1rem]" style={{ fontWeight: 600 }}>{monthLabel}</h2>
            <button onClick={nextMonth} className="p-1.5 hover:bg-[#F8F9FA] rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="p-5">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
                <div key={d} className={`text-center text-[0.75rem] py-1 ${i === 0 ? "text-[#EF4444]" : i === 6 ? "text-[#3B82F6]" : "text-muted-foreground"}`} style={{ fontWeight: 600 }}>
                  {d}
                </div>
              ))}
            </div>

            {/* 날짜 */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} />;
                const dateStr = toDateStr(viewYear, viewMonth, day);
                const blockedCount = getBlockedExpertIds(dateStr).length;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const dayOfWeek = (new Date(viewYear, viewMonth, day)).getDay();

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`relative h-14 flex flex-col items-center justify-center rounded-xl text-[0.875rem] transition-all ${
                      isSelected
                        ? "bg-[#2D6A4F] text-white ring-2 ring-[#52B788]"
                        : isToday
                        ? "bg-[#D8F3DC] text-[#2D6A4F]"
                        : "hover:bg-[#F8F9FA] text-[#2D2D2D]"
                    }`}
                    style={{ fontWeight: isToday || isSelected ? 600 : 400 }}
                  >
                    <span className={`${!isSelected && dayOfWeek === 0 ? "text-[#EF4444]" : ""} ${!isSelected && dayOfWeek === 6 ? "text-[#3B82F6]" : ""}`}>
                      {day}
                    </span>
                    {blockedCount > 0 && (
                      <span className={`text-[0.6rem] mt-0.5 ${
                        isSelected ? "text-white/80" :
                        blockedCount === mockExperts.length ? "text-[#EF4444]" : "text-[#EAB308]"
                      }`} style={{ fontWeight: 600 }}>
                        {blockedCount === mockExperts.length ? "전원불가" : `${blockedCount}명 불가`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 범례 */}
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border text-[0.75rem] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#D8F3DC] border border-[#52B788]/30" /> 오늘
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#2D6A4F]" /> 선택한 날짜
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#EAB308]" style={{ fontWeight: 600 }}>N명</span> 일부 불가
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#EF4444]" style={{ fontWeight: 600 }}>전원</span> 전원 불가
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 선택한 날짜 정보 (2칸) */}
        <div className="lg:col-span-2 space-y-5">
          {!selectedDate ? (
            <div className="bg-white rounded-xl shadow-sm border border-border p-10 text-center">
              <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground text-[0.9375rem]">
                날짜를 선택하면<br />해당 일의 전문가 현황을 볼 수 있습니다.
              </p>
            </div>
          ) : (
            <>
              {/* 날짜 헤더 */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-5">
                <p className="text-[0.8rem] text-muted-foreground mb-1">선택한 날짜</p>
                <p className="text-[1.25rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>{selectedDate}</p>
                <div className="flex items-center gap-3 mt-3 text-[0.8125rem]">
                  <span className="flex items-center gap-1 text-[#EF4444]">
                    <Ban className="w-4 h-4" />
                    불가 {blockedExperts.length}명
                  </span>
                  <span className="flex items-center gap-1 text-[#22C55E]">
                    <User className="w-4 h-4" />
                    가능 {availableExperts.length}명
                  </span>
                </div>
              </div>

              {/* 불가 전문가 */}
              {blockedExperts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                    <Ban className="w-4 h-4 text-[#EF4444]" />
                    <h3 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>불가 전문가</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {blockedExperts.map((exp) => {
                      const sch = dateSchedules.find((s) => s.expertId === exp.expertId);
                      return (
                        <div key={exp.expertId} className="px-5 py-3.5 bg-[#EF4444]/[0.03]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{exp.expertName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[0.7rem] bg-[#EF4444]/10 text-[#EF4444]" style={{ fontWeight: 500 }}>
                              불가
                            </span>
                          </div>
                          {sch && (
                            <div className="flex items-center gap-1 text-[0.75rem] text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {sch.scheduleStart === sch.scheduleEnd
                                ? sch.scheduleStart
                                : `${sch.scheduleStart} ~ ${sch.scheduleEnd}`}
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-[0.75rem] text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{exp.expertNumber}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exp.sAddress}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 가능한 전문가 */}
              {availableExperts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                    <User className="w-4 h-4 text-[#22C55E]" />
                    <h3 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>가능한 전문가</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {availableExperts.map((exp) => {
                      const sc = stateColors[exp.expertState] || stateColors["가용"];
                      return (
                        <div key={exp.expertId} className="px-5 py-3.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{exp.expertName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[0.7rem]" style={{ fontWeight: 500, color: sc.color, backgroundColor: sc.bg }}>
                              {exp.expertState}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[0.75rem] text-muted-foreground">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{exp.expertNumber}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exp.sAddress}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 전원 가능한 경우 */}
              {blockedExperts.length === 0 && (
                <div className="bg-[#D8F3DC] rounded-xl p-5 text-center">
                  <p className="text-[0.9375rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                    이 날짜는 모든 전문가가 가능합니다.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 불가 일정 등록 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[1rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>불가 일정 등록</p>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[#F8F9FA] rounded-lg">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[0.8125rem] text-[#2D2D2D] mb-1.5 block" style={{ fontWeight: 600 }}>전문가</label>
                <select
                  value={addExpertId}
                  onChange={(e) => setAddExpertId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none text-[0.875rem]"
                >
                  <option value="">전문가를 선택하세요</option>
                  {mockExperts.map((exp) => (
                    <option key={exp.expertId} value={exp.expertId}>{exp.expertName} ({exp.sAddress})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[0.8125rem] text-[#2D2D2D] mb-1.5 block" style={{ fontWeight: 600 }}>시작일</label>
                <input
                  type="date"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none text-[0.875rem]"
                />
              </div>
              <div>
                <label className="text-[0.8125rem] text-[#2D2D2D] mb-1.5 block" style={{ fontWeight: 600 }}>종료일</label>
                <input
                  type="date"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  min={newStart}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none text-[0.875rem]"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-[0.875rem] text-muted-foreground hover:bg-[#F8F9FA] transition-colors"
                style={{ fontWeight: 500 }}
              >
                취소
              </button>
              <button
                onClick={() => {
                  // TODO: axios 연동
                  // await axios.post("/api/schedule", {
                  //   expertId: addExpertId,
                  //   scheduleStart: newStart,
                  //   scheduleEnd: newEnd,
                  //   scheduleState: "불가",
                  // });
                  setShowAddModal(false);
                  setAddExpertId("");
                  setNewStart("");
                  setNewEnd("");
                }}
                disabled={!addExpertId || !newStart || !newEnd}
                className={`flex-1 py-2.5 rounded-xl text-[0.875rem] transition-colors ${
                  addExpertId && newStart && newEnd
                    ? "bg-[#2D6A4F] text-white hover:bg-[#235c43]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                style={{ fontWeight: 600 }}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
