import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { CheckCircle, Upload, X, Building2, FileText, User, Calendar, MapPin, Hash } from "lucide-react";
import { GrootLogo } from "@/components/common";
import axios from "axios";

export function CompanyRegister() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    business_number: "",
    ceoName: "",
    startDate: "",
    address: "",
  });

  const [businessFile, setBusinessFile] = useState<File | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      setBusinessFile(file);
    } else if (file) {
      alert("PDF 파일만 업로드 가능합니다.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("companyName", form.companyName);
    formData.append("business_number", form.business_number);
    formData.append("ceoName", form.ceoName);
    formData.append("startDate", form.startDate);
    formData.append("address", form.address);
    if (businessFile) formData.append("businessFile", businessFile);
    const res = await axios.post("/api/company/add", formData);
    if (res.data === false) {
      alert("기업 등록에 실패했습니다.");
      return;
    }
    setSubmitted(true);

  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#2D6A4F]" />
          </div>
          <h2 className="text-[1.5rem] text-[#2D2D2D] mb-3" style={{ fontWeight: 600 }}>
            기업 등록이 완료되었습니다!
          </h2>
          <p className="text-muted-foreground mb-2">
            관리자 승인 후 회원가입이 가능합니다.
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            승인까지 영업일 기준 1~2일 소요될 수 있습니다.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="w-full py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors"
          >
            회원가입 하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full">

        {/* 헤더 */}
 <div className="text-center mb-8">
  <Link to="/" className="inline-flex items-center gap-2 mb-6">
    <GrootLogo size="md" theme="color" />
  </Link>
          <h1 className="text-[1.75rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>
            기업 등록
          </h1>
          <p className="text-muted-foreground mt-2">
            GROOT 서비스 이용을 위해 기업 정보를 등록해주세요
          </p>
        </div>

    

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">

          {/* 기업명 */}
          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#52B788]" />
              기업명
            </label>
            <input
              type="text"
              required
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              placeholder="주식회사 그린테크"
            />
          </div>

          {/* 사업자등록번호 */}
          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-[#52B788]" />
              사업자등록번호
            </label>
            <input
              type="text"
              required
              value={form.business_number}
              onChange={(e) => handleChange("business_number", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              placeholder="000-00-00000"
            />
          </div>

          {/* 대표자명 + 개업년월일 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#52B788]" />
                대표자명
              </label>
              <input
                type="text"
                required
                value={form.ceoName}
                onChange={(e) => handleChange("ceoName", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#52B788]" />
                개업년월일
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* 소재지 */}
          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#52B788]" />
              소재지
            </label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none"
              placeholder="서울특별시 강남구 테헤란로 123"
            />
          </div>

          {/* 사업자등록증 업로드 */}
          <div>
            <label className="block text-[0.875rem] text-[#2D2D2D] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#52B788]" />
              사업자등록증 <span className="text-gray-400 text-xs">(PDF)</span>
            </label>

            {businessFile ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#D8F3DC] border border-[#52B788]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2D6A4F]" />
                  <span className="text-sm text-[#2D6A4F] font-medium truncate max-w-[250px]">
                    {businessFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setBusinessFile(null)}
                  className="text-[#2D6A4F] hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full px-4 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-center
                  ${dragOver
                    ? "border-[#52B788] bg-[#D8F3DC]"
                    : "border-gray-200 bg-[#F8F9FA] hover:border-[#52B788] hover:bg-[#f0faf4]"
                  }`}
              >
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  PDF 파일을 드래그하거나 <span className="text-[#2D6A4F] font-medium">클릭하여 업로드</span>
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors text-[1rem]"
            style={{ fontWeight: 600 }}
          >
            기업 등록 신청
          </button>

          <p className="text-center text-[0.875rem] text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-[#2D6A4F] hover:underline" style={{ fontWeight: 500 }}>
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}