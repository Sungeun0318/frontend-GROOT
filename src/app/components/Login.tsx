import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { GrootLogo } from "./GrootLogo";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <GrootLogo size="md" theme="color" />
          </Link>
          <h1 className="text-[1.75rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>로그인</h1>
          <p className="text-muted-foreground mt-2">GROOT에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5">이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none pr-10"
                placeholder="비밀번호"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-border accent-[#2D6A4F]" />
              <span className="text-[0.875rem] text-muted-foreground" style={{ fontWeight: 400 }}>로그인 유지</span>
            </label>
            <button type="button" className="text-[0.875rem] text-[#2D6A4F] hover:underline">비밀번호 찾기</button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors"
            style={{ fontWeight: 600 }}
          >
            로그인
          </button>

          <p className="text-center text-[0.875rem] text-muted-foreground">
            아직 계정이 없으신가요?{" "}
            <Link to="/signup" className="text-[#2D6A4F] hover:underline" style={{ fontWeight: 500 }}>회원가입</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
