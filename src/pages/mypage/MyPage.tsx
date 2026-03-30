import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  User, Building2, Lock, Eye, EyeOff, CheckCircle,
  AlertTriangle, LogOut, FileText, Upload, Pencil,
} from "lucide-react";

const mockUser = {
  managerName: "김그린",
  email: "kim@greentech.co.kr",
  phone: "010-1234-5678",
};

const mockCompany = {
  companyName: "그린테크 주식회사",
  business_number: "123-45-67890",
  ceoName: "홍길동",
  startDate: "2018-03-22",
  address: "서울특별시 강남구 테헤란로 123",
  businessLicense: "사업자등록증_그린테크.pdf",
};

function EditModal({ label, initialValue, onSave, onClose }: {
  label: string; initialValue: string; onSave: (v: string) => void; onClose: () => void;
}) {
  const [val, setVal] = useState(initialValue);
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border border-border">
        <p className="text-[1rem] text-[#2D2D2D] mb-4" style={{ fontWeight: 600 }}>{label} 수정</p>
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { onSave(val); onClose(); } if (e.key === "Escape") onClose(); }}
          className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none text-[0.9375rem] mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-[0.875rem] text-muted-foreground hover:bg-[#F8F9FA] transition-colors" style={{ fontWeight: 500 }}>취소</button>
          <button onClick={() => { onSave(val); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-[0.875rem] hover:bg-[#235c43] transition-colors" style={{ fontWeight: 600 }}>저장</button>
        </div>
      </div>
    </div>
  );
}

export function MyPage() {
  const navigate = useNavigate();
  const careerInputRef = useRef<HTMLInputElement>(null);

  const [managerName, setManagerName] = useState(mockUser.managerName);
  const [phone, setPhone] = useState(mockUser.phone);
  const [careerFile, setCareerFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<null | "name" | "phone">(null);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);

  const pwValid = pwForm.next.length >= 8;
  const pwMatch = pwForm.next.length > 0 && pwForm.next === pwForm.confirm;

  const handlePwSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwValid || !pwMatch) return;
    setPwForm({ current: "", next: "", confirm: "" });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>마이페이지</h1>
        <p className="text-muted-foreground mt-1">계정 정보를 확인하고 수정할 수 있습니다.</p>
      </div>

      {pwSaved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#D8F3DC] text-[#2D6A4F] rounded-xl text-[0.875rem]" style={{ fontWeight: 500 }}>
          <CheckCircle className="w-4 h-4 shrink-0" />비밀번호가 변경되었습니다.
        </div>
      )}

      {/* 2열 그리드 - 담당자 정보 + 비밀번호 변경 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 담당자 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-border">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
              <User className="w-4 h-4 text-[#2D6A4F]" />
            </div>
            <div>
              <p className="text-[0.9375rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>담당자 정보</p>
              <p className="text-[0.75rem] text-muted-foreground">수정 버튼으로 변경</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {/* 이메일 */}
            <div>
              <p className="text-[0.875rem] text-muted-foreground mb-1.5">이메일</p>
              <div className="px-4 py-3 rounded-xl bg-[#F0F0F0] text-muted-foreground text-[0.9375rem]">
                {mockUser.email}
              </div>
              <p className="text-[0.75rem] text-muted-foreground mt-1">이메일은 변경할 수 없습니다.</p>
            </div>
            {/* 담당자 이름 */}
            <div>
              <p className="text-[0.875rem] text-muted-foreground mb-1.5">담당자 이름</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border text-[#2D2D2D] text-[0.9375rem]">
                  {managerName}
                </div>
                <button onClick={() => setEditing("name")} className="p-3 rounded-xl border border-border hover:bg-[#F8F9FA] text-muted-foreground hover:text-[#2D2D2D] transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* 연락처 */}
            <div>
              <p className="text-[0.875rem] text-muted-foreground mb-1.5">연락처</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border text-[#2D2D2D] text-[0.9375rem]">
                  {phone}
                </div>
                <button onClick={() => setEditing("phone")} className="p-3 rounded-xl border border-border hover:bg-[#F8F9FA] text-muted-foreground hover:text-[#2D2D2D] transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* 경력 증명서 */}
            <div>
              <p className="text-[0.875rem] text-muted-foreground mb-1.5">경력 증명서</p>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F8F9FA] border border-dashed border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className={`text-[0.875rem] truncate ${careerFile ? "text-[#2D2D2D]" : "text-muted-foreground"}`}>
                    {careerFile ? careerFile.name : "PDF 파일을 업로드하세요"}
                  </span>
                </div>
                <button
                  onClick={() => careerInputRef.current?.click()}
                  className="ml-3 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D8F3DC] text-[#2D6A4F] text-[0.75rem] hover:bg-[#b7e4c7] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  <Upload className="w-3.5 h-3.5" />업로드
                </button>
                <input ref={careerInputRef} type="file" accept=".pdf" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setCareerFile(f); }} />
              </div>
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="bg-white rounded-xl shadow-sm border border-border">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#2D6A4F]" />
            </div>
            <div>
              <p className="text-[0.9375rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>비밀번호 변경</p>
              <p className="text-[0.75rem] text-muted-foreground">주기적으로 변경해주세요</p>
            </div>
          </div>
          <div className="p-5">
            <form onSubmit={handlePwSave} className="space-y-4">
              {[
                { key: "current", label: "현재 비밀번호", show: showCurrent, toggle: () => setShowCurrent(!showCurrent), placeholder: "현재 비밀번호" },
                { key: "next", label: "새 비밀번호", show: showNext, toggle: () => setShowNext(!showNext), placeholder: "8자 이상" },
                { key: "confirm", label: "새 비밀번호 확인", show: showConfirm, toggle: () => setShowConfirm(!showConfirm), placeholder: "비밀번호 재입력" },
              ].map(({ key, label, show, toggle, placeholder }) => (
                <div key={key}>
                  <p className="text-[0.875rem] text-muted-foreground mb-1.5">{label}</p>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={pwForm[key as keyof typeof pwForm]}
                      onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none pr-10 text-[0.9375rem]"
                      placeholder={placeholder}
                    />
                    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {key === "next" && pwForm.next.length > 0 && !pwValid && (
                    <p className="text-destructive text-[0.75rem] mt-1">8자 이상 입력해주세요.</p>
                  )}
                  {key === "confirm" && pwForm.confirm.length > 0 && (
                    <p className={`text-[0.75rem] mt-1 ${pwMatch ? "text-[#2D6A4F]" : "text-destructive"}`}>
                      {pwMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
                    </p>
                  )}
                </div>
              ))}
              <button
                type="submit"
                disabled={!pwForm.current || !pwValid || !pwMatch}
                className="w-full py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-[0.9375rem]"
                style={{ fontWeight: 600 }}
              >
                비밀번호 변경
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 기업 정보 - 전체 너비 */}
      <div className="bg-white rounded-xl shadow-sm border border-border">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div>
            <p className="text-[0.9375rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>기업 정보</p>
            <p className="text-[0.75rem] text-muted-foreground">변경이 필요하면 관리자에게 문의</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {[
            { label: "기업명", value: mockCompany.companyName },
            { label: "사업자등록번호", value: mockCompany.business_number },
            { label: "대표자명", value: mockCompany.ceoName },
            { label: "개업년월일", value: mockCompany.startDate },
          ].map((item, i) => (
            <div key={item.label} className={`px-5 py-4 border-b border-border ${i % 2 === 0 ? "sm:border-r" : ""}`}>
              <p className="text-[0.8125rem] text-muted-foreground mb-1">{item.label}</p>
              <p className="text-[0.9375rem] text-[#2D2D2D]" style={{ fontWeight: 500 }}>{item.value}</p>
            </div>
          ))}
          <div className="px-5 py-4 border-b border-border sm:col-span-2">
            <p className="text-[0.8125rem] text-muted-foreground mb-1">소재지</p>
            <p className="text-[0.9375rem] text-[#2D2D2D]" style={{ fontWeight: 500 }}>{mockCompany.address}</p>
          </div>
          <div className="px-5 py-4 sm:col-span-2">
            <p className="text-[0.8125rem] text-muted-foreground mb-2">사업자등록증</p>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F8F9FA] border border-border">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-[0.875rem] text-muted-foreground">{mockCompany.businessLicense}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 계정 관리 */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex items-center justify-between">
        <div>
          <p className="text-[0.9375rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>계정 관리</p>
          <p className="text-[0.875rem] text-muted-foreground mt-0.5">로그아웃하거나 서비스를 탈퇴할 수 있습니다</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-[0.875rem] text-[#2D2D2D] hover:bg-[#F8F9FA] transition-colors"
            style={{ fontWeight: 500 }}
          >
            <LogOut className="w-4 h-4" />로그아웃
          </button>
          <button
            onClick={() => setWithdrawModal(true)}
            className="px-4 py-2.5 rounded-xl text-[0.875rem] text-destructive border border-destructive/30 hover:bg-destructive/5 transition-colors"
            style={{ fontWeight: 500 }}
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {editing === "name" && <EditModal label="담당자 이름" initialValue={managerName} onSave={setManagerName} onClose={() => setEditing(null)} />}
      {editing === "phone" && <EditModal label="연락처" initialValue={phone} onSave={setPhone} onClose={() => setEditing(null)} />}

      {withdrawModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full border border-border">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-[1.125rem] text-[#2D2D2D] text-center mb-2" style={{ fontWeight: 700 }}>정말 탈퇴하시겠어요?</h3>
            <p className="text-[0.875rem] text-muted-foreground text-center mb-6">탈퇴 시 모든 데이터가 삭제되며<br />복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button onClick={() => setWithdrawModal(false)} className="flex-1 py-3 rounded-xl border border-border text-[0.9375rem] text-[#2D2D2D] hover:bg-[#F8F9FA] transition-colors" style={{ fontWeight: 500 }}>취소</button>
              <button onClick={() => navigate("/login")} className="flex-1 py-3 rounded-xl bg-destructive text-white text-[0.9375rem] hover:opacity-90 transition-opacity" style={{ fontWeight: 600 }}>탈퇴</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
