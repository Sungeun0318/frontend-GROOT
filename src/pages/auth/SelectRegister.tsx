import { useNavigate } from "react-router";
import { Building2, User } from "lucide-react";
import { GrootLogo } from "@/components/common";
import { Link } from "react-router";

export function SelectRegister() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <GrootLogo size="md" theme="color" />
          </Link>
          <h1 className="text-[1.75rem] text-[#2D2D2D] mt-6" style={{ fontWeight: 700 }}>회원가입 유형 선택</h1>
          <p className="text-muted-foreground mt-2">해당하는 유형을 선택해주세요</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/company-register")}
            className="bg-white rounded-2xl shadow-sm border border-border p-8 flex flex-col items-center gap-4 hover:border-[#52B788] hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[#2D6A4F]" />
            </div>
            <div className="text-center">
              <p className="text-[1rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>기업 등록</p>
              <p className="text-[0.875rem] text-muted-foreground mt-1">처음 이용하는 기업이라면</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-white rounded-2xl shadow-sm border border-border p-8 flex flex-col items-center gap-4 hover:border-[#52B788] hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center">
              <User className="w-8 h-8 text-[#2D6A4F]" />
            </div>
            <div className="text-center">
              <p className="text-[1rem] text-[#2D2D2D]" style={{ fontWeight: 600 }}>회원가입</p>
              <p className="text-[0.875rem] text-muted-foreground mt-1">기업이 이미 등록되어 있다면</p>
            </div>
          </button>
        </div>

        <p className="text-center text-[0.875rem] text-muted-foreground mt-6">
          이미 계정이 있으신가요?{" "}
          <button onClick={() => navigate("/login")} className="text-[#2D6A4F] hover:underline" style={{ fontWeight: 500 }}>로그인</button>
        </p>
      </div>
    </div>
  );
}