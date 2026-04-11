import { useEffect, useState } from "react";
import {
  Download,
  Mail,
  Calendar,
  Leaf,
  Building2,
} from "lucide-react";
import axios from "axios";

interface SpeciesDetailDTO {
  treeType: string;
  count: number;
  carbonAbsorption: number;
  ratio: number;
}

interface ReportPreviewDTO {
  companyName: string | null;
  issuedDate: string | null;
  dueEndDate: string | null;
  selectedTimes: number;
  totalCount: number;
  totalCarbonAbsorption: number;
  certGrade: string | null;
  speciesDetail: SpeciesDetailDTO[];
}

export function ESGReport() {
  const [selectedTimes, setSelectedTimes] = useState<number>(1);
  const [reportPreview, setReportPreview] = useState<ReportPreviewDTO | null>(null);

  const fetchReportPreview = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get<ReportPreviewDTO>(
        `http://localhost:8080/api/reports`,
        {
          params: { times: selectedTimes },
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setReportPreview(response.data);
    } catch (error) {
      console.error("보고서 미리보기 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchReportPreview();
  }, [selectedTimes])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1
          className="text-[1.5rem] text-[#2D2D2D]"
          style={{ fontWeight: 700 }}
        >
          ESG 보고서 출력
        </h1>
        <p className="text-muted-foreground mt-1">
          탄소 활동 실적을 공식 PDF 문서로 출력하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-border p-5 space-y-4">
            <h3 className="text-[1rem]" style={{ fontWeight: 600 }}>
              보고서 설정
            </h3>

            <div>
              <label className="block text-[0.875rem] text-muted-foreground mb-1.5">
                차수 선택
              </label>
              <input
                type="number"
                min={1}
                value={selectedTimes}
                onChange={(e) => setSelectedTimes(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-border text-[0.875rem] outline-none focus:ring-2 focus:ring-[#52B788]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-colors">
              <Download className="w-5 h-5" />
              PDF 다운로드
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border border-[#2D6A4F] text-[#2D6A4F] rounded-xl hover:bg-[#D8F3DC] transition-colors">
              <Mail className="w-5 h-5" />
              이메일로 전송
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-[#F8F9FA]">
              <p className="text-[0.875rem] text-muted-foreground">미리보기 (A4)</p>
            </div>

            <div className="p-8 space-y-8">
              <div className="text-center border-b border-border pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Leaf className="w-6 h-6 text-[#2D6A4F]" />
                  <span
                    className="text-[1.25rem] text-[#2D6A4F]"
                    style={{ fontWeight: 700 }}
                  >
                    GROOT
                  </span>
                </div>

                <h2
                  className="text-[1.5rem] text-[#2D2D2D] mb-2"
                  style={{ fontWeight: 700 }}
                >
                  ESG 탄소흡수 보고서
                </h2>
                <p className="text-muted-foreground text-[0.875rem]">
                  Carbon Absorption Report
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[0.875rem]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">기업명:</span>
                  <span style={{ fontWeight: 500 }}>
                    {reportPreview?.companyName ?? "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">발급일:</span>
                  <span style={{ fontWeight: 500 }}>
                    {reportPreview?.issuedDate ?? "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">만료일:</span>
                  <span style={{ fontWeight: 500 }}>
                    {reportPreview?.dueEndDate ?? "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">선택 차수:</span>
                  <span style={{ fontWeight: 500 }}>
                    {reportPreview?.selectedTimes ?? selectedTimes}차
                  </span>
                </div>
              </div>

              <div className="bg-[#D8F3DC]/30 rounded-xl p-5">
                <h3
                  className="text-[1rem] text-[#2D6A4F] mb-3"
                  style={{ fontWeight: 600 }}
                >
                  탄소흡수 요약
                </h3>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p
                      className="text-[1.5rem] text-[#2D6A4F]"
                      style={{ fontWeight: 700 }}
                    >
                      {reportPreview?.totalCount ?? 0}
                    </p>
                    <p className="text-[0.75rem] text-muted-foreground">
                      등록 수목 (그루)
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-[1.5rem] text-[#2D6A4F]"
                      style={{ fontWeight: 700 }}
                    >
                      {(reportPreview?.totalCarbonAbsorption ?? 0).toLocaleString()}
                    </p>
                    <p className="text-[0.75rem] text-muted-foreground">
                      총 탄소흡수량 (kg CO₂)
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-[1.5rem] text-[#2D6A4F]"
                      style={{ fontWeight: 700 }}
                    >
                      {reportPreview?.certGrade ?? "-"}
                    </p>
                    <p className="text-[0.75rem] text-muted-foreground">
                      인증 등급
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[1rem] mb-3" style={{ fontWeight: 600 }}>
                  수종별 상세 내역
                </h3>

                <table className="w-full text-[0.875rem]">
                  <thead>
                    <tr className="border-b border-border">
                      {["수종", "수량", "탄소흡수량(kg)", "비율"].map((header) => (
                        <th
                          key={header}
                          className="py-2 text-left text-muted-foreground"
                          style={{ fontWeight: 500 }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {reportPreview?.speciesDetail?.length ? (
                      reportPreview.speciesDetail.map((species, index) => (
                        <tr
                          key={`${species.treeType}-${index}`}
                          className="border-b border-border/50"
                        >
                          <td className="py-2">{species.treeType}</td>
                          <td className="py-2">{species.count}그루</td>
                          <td className="py-2">
                            {species.carbonAbsorption.toLocaleString()}
                          </td>
                          <td className="py-2">{species.ratio.toFixed(1)}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 text-muted-foreground" colSpan={4}>
                          수종 데이터가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border border-border rounded-xl p-4">
                <h3 className="text-[0.875rem] mb-2" style={{ fontWeight: 600 }}>
                  계산 근거
                </h3>
                <p className="text-[0.75rem] text-muted-foreground">
                  바이오매스 상대생장식: W = a × DBH^b
                </p>
                <p className="text-[0.75rem] text-muted-foreground">
                  탄소전환계수: 0.4737 (국립산림과학원)
                </p>
                <p className="text-[0.75rem] text-muted-foreground">
                  데이터 출처: 산림청, 국립산림과학원, 기상청
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <div className="w-28 h-28 rounded-full border-4 border-[#2D6A4F] flex flex-col items-center justify-center text-[#2D6A4F] rotate-[-10deg]">
                  <Leaf className="w-6 h-6 mb-1" />
                  <span className="text-[0.625rem]" style={{ fontWeight: 700 }}>
                    GROOT
                  </span>
                  <span className="text-[0.5rem]">CERTIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}