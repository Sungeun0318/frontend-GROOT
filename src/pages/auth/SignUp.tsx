import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { GrootLogo } from "@/components/common";
import axios from "axios";

export function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_number: "",
    mname: "",
    company_number: "",
    email: "",
    password: "",
    passwordConfirm: "",
    party_name: "",
    address: "",
  });
  const [careerPdf, setCareerPdf] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const passwordsMatch = form.password.length > 0 && form.password === form.passwordConfirm;
  const passwordValid = form.password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("mname", form.mname);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("company_number", form.company_number);
    formData.append("business_number", form.business_number);
    formData.append("party_name", form.party_name);
    formData.append("address", form.address);
    if (careerPdf) formData.append("careerPdf", careerPdf);

    try {
      const res = await axios.post("/api/member/signup", formData);
      if (res.data === false) {
        alert("회원가입에 실패했습니다.");
        return;
      }
      setSubmitted(true);
    } catch (err) {
      alert("회원가입에 실패했습니다.");
    }
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
          <button onClick={() => navigate("/login")} className="w-full py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors">
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
          <h1 className="text-[1.75rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>회원가입</h1>
          <p className="text-muted-foreground mt-2">GROOT 서비스를 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">사업자등록번호</label>
            <input
              type="text"
              required
              value={form.business_number}
              onChange={(e) => handleChange("business_number", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              placeholder="000-00-00000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">담당자 이름</label>
              <input
                type="text"
                required
                value={form.party_name}
                onChange={(e) => handleChange("party_name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">담당자 연락처</label>
              <input
                type="tel"
                required
                value={form.company_number}
                onChange={(e) => handleChange("company_number", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">아이디</label>
            <input
              type="text"
              value={form.mname}
              onChange={(e) => handleChange("mname", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              placeholder="로그인에 사용할 아이디"
            />
          </div>

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">주소</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.address}
                readOnly
                className="flex-1 px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border outline-none"
                placeholder="주소 검색을 눌러주세요"
              />
              <button
                type="button"
                onClick={() => {
                  new (window as any).daum.Postcode({
                    oncomplete: (data: any) => {
                      handleChange("address", data.jibunAddress || data.autoJibunAddress);
                    },
                  }).open();
                }}
                className="px-4 py-3 rounded-xl bg-[#2D6A4F] text-white text-[0.875rem] whitespace-nowrap hover:bg-[#235c43] transition-colors"
              >
                주소 검색
              </button>
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

          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">경력증명서</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setCareerPdf(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border outline-none"
            />
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