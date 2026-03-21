import { Link } from "react-router";
import { Leaf } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="text-center">
        <Leaf className="w-16 h-16 text-[#52B788] mx-auto mb-6" />
        <h1 className="text-[3rem] text-[#2D6A4F] mb-2" style={{ fontWeight: 700 }}>404</h1>
        <p className="text-muted-foreground mb-6">페이지를 찾을 수 없습니다.</p>
        <Link to="/" className="px-6 py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors inline-block">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
