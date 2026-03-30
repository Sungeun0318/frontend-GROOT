import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Leaf, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { GrootLogo } from "@/components/common";

export function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    bizNumber: "",
    managerName: "",
    phone: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bizChecked, setBizChecked] = useState<null | boolean>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "bizNumber") {
      const cleaned = value.replace(/[^0-9]/g, "");
      if (cleaned.length === 10) {
        setBizChecked(cleaned !== "1234567890");
      } else {
        setBizChecked(null);
      }
    }
  };

  const passwordsMatch = form.password.length > 0 && form.password === form.passwordConfirm;
  const passwordValid = form.password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#2D6A4F]" />
          </div>
          <h2 className="text-[1.5rem] text-[#2D2D2D] mb-3" style={{ fontWeight: 600 }}>가입이 완료되었습니다!</h2>
          <p className="text-muted-foreground mb-8">입력하신 이메일로 인증 메일을 보내드렸습니다.<br />이메일을 확인하여 인증을 완료해주세요.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors"
          >
            로그인 하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <GrootLogo size="md" theme="color" />
          </Link>
          <h1 className="text-[1.75rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>기업 회원가입</h1>
          <p className="text-muted-foreground mt-2">GROOT 서비스를 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">기업명</label>
            <input
              type="text"
              required
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              placeholder="주식회사 그린테크"
            />
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">사업자등록번호</label>
            <div className="relative">
              <input
                type="text"
                required
                value={form.bizNumber}
                onChange={(e) => handleChange("bizNumber", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none pr-10"
                placeholder="000-00-00000"
              />
              {bizChecked !== null && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {bizChecked ? (
                    <CheckCircle className="w-5 h-5 text-[#52B788]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </span>
              )}
            </div>
            {bizChecked === false && <p className="text-destructive text-[0.75rem] mt-1">이미 등록된 사업자등록번호입니다.</p>}
            {bizChecked === true && <p className="text-[#52B788] text-[0.75rem] mt-1">사용 가능한 사업자등록번호입니다.</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">담당자 이름</label>
              <input
                type="text"
                required
                value={form.managerName}
                onChange={(e) => handleChange("managerName", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">담당자 연락처</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">이메일</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              placeholder="example@company.com"
            />
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none pr-10"
                placeholder="8자 이상"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.password.length > 0 && !passwordValid && <p className="text-destructive text-[0.75rem] mt-1">비밀번호는 8자 이상이어야 합니다.</p>}
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">비밀번호 확인</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={form.passwordConfirm}
                onChange={(e) => handleChange("passwordConfirm", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none pr-10"
                placeholder="비밀번호를 다시 입력해주세요"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.passwordConfirm.length > 0 && !passwordsMatch && <p className="text-destructive text-[0.75rem] mt-1">비밀번호가 일치하지 않습니다.</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors text-[1rem]"
            style={{ fontWeight: 600 }}
          >
            회원가입
          </button>

          <p className="text-center text-[0.875rem] text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-[#2D6A4F] hover:underline" style={{ fontWeight: 500 }}>로그인</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
