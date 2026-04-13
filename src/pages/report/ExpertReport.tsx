import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

import {
  TreePine,
  MapPin,
  Calendar,
  Ruler,
  Camera,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  FileText,
  Save,
  ChevronDown,
} from "lucide-react";

interface BasicReportDto {
  detailId: number;
  content: string;
  dueStartDate: string;
  dueEndDate: string;
  times: number;
  companyName: string;
  partyName: string;
  address: string;
}

interface ApplicationDto {
  detailId: number;
  times: number;
  surveyStatus: string;
}

interface ExpertReportDto {
  treeId?: number;
  detailId: number;
  treeType: string;
  dbh: number;
  treeStatus: "excellent" | "good" | "fair" | "poor";
  picture: string;
  height: number;
  width: number;
  kind: "broadleaf" | "conifer";
  latitude: number;
  longitude: number;
  opinion: string;
  memberId?: number;
  sitePicture?: string;
  createDate?: string;
  updateDate?: string;
}

interface TreeMeasurement {
  id: string;
  treeType: string;
  kind: "broadleaf" | "conifer";
  dbh: string;
  height: string;
  width: string;
  treeStatus: "excellent" | "good" | "fair" | "poor";
  picture: string;
  pictureFile: File | null;
  latitude: string;
  longitude: string;
}

const healthLabels: Record<string, { label: string; color: string; emoji: string }> = {
  excellent: { label: "매우 양호", color: "text-emerald-700 bg-emerald-50", emoji: "🟢" },
  good: { label: "양호", color: "text-blue-700 bg-blue-50", emoji: "🔵" },
  fair: { label: "보통", color: "text-amber-700 bg-amber-50", emoji: "🟡" },
  poor: { label: "불량", color: "text-red-700 bg-red-50", emoji: "🔴" },
};

const getHealthDisplay = (status: string) => {
  if (status === "excellent" || status === "매우 양호") return healthLabels.excellent;
  if (status === "good" || status === "양호") return healthLabels.good;
  if (status === "fair" || status === "보통") return healthLabels.fair;
  if (status === "poor" || status === "불량") return healthLabels.poor;
  return { label: status, color: "bg-gray-100 text-gray-600", emoji: "" };
};

const speciesOptions = [
  "소나무",
  "참나무",
  "편백나무",
  "느티나무",
  "은행나무",
  "벚나무",
  "메타세쿼이아",
  "자작나무",
];

export function ExpertReport() {
  const { detailId } = useParams<{ detailId: string }>();

  const [submitted, setSubmitted] = useState(false);
  const [selectedRound, setSelectedRound] = useState<string>("");

  const [basicInfo, setBasicInfo] = useState<BasicReportDto | null>(null);
  const [completedRounds, setCompletedRounds] = useState<ApplicationDto[]>([]);
  const [previousRoundData, setPreviousRoundData] = useState<ExpertReportDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState<boolean | null>(null);

  const [measurements, setMeasurements] = useState<TreeMeasurement[]>([
    {
      id: "1",
      treeType: "편백나무",
      kind: "conifer",
      dbh: "18.5",
      height: "6.2",
      width: "2.8",
      treeStatus: "excellent",
      picture: "",
      pictureFile: null,
      latitude: "",
      longitude: "",
    },
    {
      id: "2",
      treeType: "편백나무",
      kind: "conifer",
      dbh: "16.2",
      height: "5.8",
      width: "2.4",
      treeStatus: "good",
      picture: "",
      pictureFile: null,
      latitude: "",
      longitude: "",
    },
    {
      id: "3",
      treeType: "편백나무",
      kind: "conifer",
      dbh: "12.0",
      height: "4.5",
      width: "1.9",
      treeStatus: "fair",
      picture: "",
      pictureFile: null,
      latitude: "",
      longitude: "",
    },
  ]);

  const [opinion, setOpinion] = useState(
    "전반적으로 식재 상태가 양호하며, 활착률은 약 95%로 추정됩니다. 일부 배수 불량 구간(남동쪽 저지대)에서 하엽 황변이 관찰되어 배수로 정비가 필요합니다. 차기 답사 시 생장량 비교 측정 권장합니다."
  );

  const [sitePicture, setSitePicture] = useState<string | null>(null);
  const [sitePictureFile, setSitePictureFile] = useState<File | null>(null);

  useEffect(() => {
    if (!detailId) return;

    const fetchInitData = async () => {
      try {
        setLoading(true);

        const linkRes = await axios.get(
          `http://localhost:8080/api/expert-reports/link?detailId=${detailId}`
        );

        if (!linkRes.data) {
          setIsLinkValid(false);
          setBasicInfo(null);
          setCompletedRounds([]);
          return;
        }

        setIsLinkValid(true);

        const [basicRes, roundRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/expert-reports/basic/${detailId}`),
          axios.get(`http://localhost:8080/api/expert-reports/${detailId}`),
        ]);

        setBasicInfo(basicRes.data);
        setCompletedRounds(roundRes.data || []);
      } catch (error) {
        console.error("초기 데이터 조회 실패", error);
        setIsLinkValid(false);
        alert("접근할 수 없는 링크입니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitData();
  }, [detailId]);

  useEffect(() => {
    if (selectedRound === "") return;

    const fetchPreviousRoundDetail = async () => {
      try {
        const selected = completedRounds.find(
          (item) => String(item.times) === selectedRound
        );

        if (!selected) {
          setPreviousRoundData([]);
          return;
        }

        const res = await axios.get(
          `http://localhost:8080/api/expert-reports/${selected.detailId}/detail`
        );

        setPreviousRoundData(res.data || []);
      } catch (error) {
        console.error("이전 차수 조회 실패", error);
        setPreviousRoundData([]);
      }
    };

    fetchPreviousRoundDetail();
  }, [selectedRound, completedRounds]);

  const addMeasurement = () => {
    setMeasurements((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        treeType: "편백나무",
        kind: "conifer",
        dbh: "",
        height: "",
        width: "",
        treeStatus: "good",
        picture: "",
        pictureFile: null,
        latitude: "",
        longitude: "",
      },
    ]);
  };

  const removeMeasurement = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMeasurement = <K extends keyof TreeMeasurement>(
    id: string,
    field: K,
    value: TreeMeasurement[K]
  ) => {
    setMeasurements((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const setCurrentLocation = (id: string) => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        setMeasurements((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, latitude: lat, longitude: lng } : m
          )
        );
      },
      (error) => {
        console.error(error);
        alert("위치 정보를 가져오지 못했습니다. 위치 권한을 확인해주세요.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const estimateCarbonPerTree = (dbhCm: number) => {
    const biomassKg = 0.0396 * Math.pow(dbhCm, 2.3715);
    const carbonKg = biomassKg * 0.5;
    const co2Kg = carbonKg * (44 / 12);
    return co2Kg;
  };

  const totalCO2 = measurements.reduce((sum, m) => {
    const dbh = parseFloat(m.dbh);
    if (isNaN(dbh) || dbh <= 0) return sum;
    return sum + estimateCarbonPerTree(dbh);
  }, 0);

  const avgDbh =
    measurements.reduce((s, m) => s + (parseFloat(m.dbh) || 0), 0) /
    (measurements.length || 1);

  const comparisonRoundOptions = basicInfo
    ? Array.from({ length: basicInfo.times }, (_, i) => i)
    : [];

  const selectedPreviousMeasurements = previousRoundData;

  const handleSubmit = async () => {
    if (!detailId) {
      alert("detailId가 없습니다.");
      return;
    }

    if (isLinkValid === false) {
      alert("만료된 링크입니다.");
      return;
    }

    if (!sitePictureFile) {
      alert("전경 사진을 업로드해주세요.");
      return;
    }

    try {
      setSaving(true);

      const data: ExpertReportDto[] = measurements.map((m) => ({
        detailId: Number(detailId),
        treeType: m.treeType,
        dbh: Number(m.dbh) || 0,
        treeStatus: m.treeStatus,
        picture: "",
        height: Number(m.height) || 0,
        width: Number(m.width) || 0,
        kind: m.kind,
        latitude: Number(m.latitude) || 0,
        longitude: Number(m.longitude) || 0,
        opinion,
      }));

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("site", sitePictureFile);

      measurements.forEach((m) => {
        if (m.pictureFile) {
          formData.append("files", m.pictureFile);
        }
      });

      await axios.post("http://localhost:8080/api/expert-reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitted(true);
    } catch (error) {
      console.error("보고서 제출 실패", error);
      alert("보고서 제출에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center">불러오는 중...</div>;
  }

  if (isLinkValid === false) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-[1.5rem] text-gray-900 mb-2" style={{ fontWeight: 700 }}>
          접근할 수 없는 링크입니다
        </h2>
        <p className="text-gray-500 mb-2">
          답사 시작일 전이거나 답사 종료일이 지나서 링크가 만료되었습니다.
        </p>
        <p className="text-[0.85rem] text-gray-400">
          관리자에게 새로운 링크를 요청해주세요.
        </p>
      </div>
    );
  }

  if (!basicInfo) {
    return <div className="max-w-2xl mx-auto py-20 text-center">기본 정보가 없습니다.</div>;
  }

  const companyDisplayName = `${basicInfo.companyName} (${basicInfo.partyName})`;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-[1.5rem] text-gray-900 mb-2" style={{ fontWeight: 700 }}>
          보고서가 제출되었습니다
        </h2>
        <p className="text-gray-500 mb-2">
          답사 보고서 #{basicInfo.detailId}가 성공적으로 제출되었습니다.
        </p>
        <p className="text-[0.85rem] text-gray-400 mb-8">
          관리자 검토 후 기업에게 결과가 전달됩니다.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#245a42] transition-colors"
          style={{ fontWeight: 600 }}
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div>
        <div className="flex items-center gap-2 text-[0.8rem] text-[#2D6A4F] mb-2" style={{ fontWeight: 600 }}>
          <FileText className="w-4 h-4" />
          현장 답사 보고서
        </div>
        <h1 className="text-[1.75rem] text-gray-900" style={{ fontWeight: 800 }}>
          답사 보고서 작성
        </h1>
        <p className="text-gray-500 mt-1">현장 측정 데이터를 기록하고 보고서를 제출합니다</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-[1rem] text-gray-900 mb-4" style={{ fontWeight: 700 }}>
          답사 기본 정보
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>
                답사번호
              </p>
              <p className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>
                {basicInfo.detailId}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <TreePine className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>
                기업명
              </p>
              <p className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>
                {companyDisplayName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>
                주소
              </p>
              <p className="text-[0.9rem] text-gray-900">{basicInfo.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>
                답사 시작일
              </p>
              <p className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>
                {basicInfo.dueStartDate}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>
                답사 종료일
              </p>
              <p className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>
                {basicInfo.dueEndDate}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              <TreePine className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>
                현재 작성 차수
              </p>
              <p className="text-[0.9rem] text-gray-900" style={{ fontWeight: 600 }}>
                {basicInfo.times}차
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
            <div className="w-full">
              <p className="text-[0.75rem] text-gray-400" style={{ fontWeight: 600 }}>
                이전 차수 비교
              </p>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
              >
                <option value="">선택 안 함</option>
                {comparisonRoundOptions.map((round) => (
                  <option key={round} value={round}>
                    {round}차
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-[0.85rem] text-gray-600">
          <span style={{ fontWeight: 600 }}>담당자:</span> {basicInfo.partyName}
          <span className="mx-2">·</span>
          <span style={{ fontWeight: 600 }}>신청 내용:</span> {basicInfo.content}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[1rem] text-gray-900" style={{ fontWeight: 700 }}>
              수목 개별 측정
            </h2>
            <p className="text-[0.8rem] text-gray-400 mt-0.5">
              흉고직경(DBH), 수고, 수관폭을 측정하여 기록합니다
            </p>
          </div>
          <button
            onClick={addMeasurement}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2D6A4F] text-white rounded-xl text-[0.85rem] hover:bg-[#245a42] transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        <div className={selectedRound !== "" ? "grid grid-cols-1 xl:grid-cols-2 gap-6" : ""}>
          <div>
            <h3 className="text-[0.9rem] text-gray-800 mb-3" style={{ fontWeight: 700 }}>
              현재 답사 데이터
            </h3>

            <div className="space-y-4">
              {measurements.map((m, idx) => (
                <div key={m.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[0.85rem] text-gray-700" style={{ fontWeight: 700 }}>
                      #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeMeasurement(m.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                          수종
                        </label>
                        <select
                          value={m.treeType}
                          onChange={(e) => updateMeasurement(m.id, "treeType", e.target.value)}
                          className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
                        >
                          {speciesOptions.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[0.7rem] text-gray-400 mb-1 flex items-center gap-1" style={{ fontWeight: 600 }}>
                          <Ruler className="w-3 h-3" /> 흉고직경 (cm)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={m.dbh}
                          onChange={(e) => updateMeasurement(m.id, "dbh", e.target.value)}
                          placeholder="0.0"
                          className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                        />
                      </div>

                      <div>
                        <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                          수고 (m)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={m.height}
                          onChange={(e) => updateMeasurement(m.id, "height", e.target.value)}
                          placeholder="0.0"
                          className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                        />
                      </div>

                      <div>
                        <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                          수관폭 (m)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={m.width}
                          onChange={(e) => updateMeasurement(m.id, "width", e.target.value)}
                          placeholder="0.0"
                          className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                          건강상태
                        </label>
                        <select
                          value={m.treeStatus}
                          onChange={(e) =>
                            updateMeasurement(
                              m.id,
                              "treeStatus",
                              e.target.value as TreeMeasurement["treeStatus"]
                            )
                          }
                          className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
                        >
                          {Object.entries(healthLabels).map(([key, { label }]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                          수종 구분
                        </label>
                        <select
                          value={m.kind}
                          onChange={(e) =>
                            updateMeasurement(
                              m.id,
                              "kind",
                              e.target.value as TreeMeasurement["kind"]
                            )
                          }
                          className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] bg-white"
                        >
                          <option value="broadleaf">활엽수</option>
                          <option value="conifer">침엽수</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                          위도
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          value={m.latitude}
                          onChange={(e) => updateMeasurement(m.id, "latitude", e.target.value)}
                          placeholder="예: 35.824223"
                          className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                        />
                      </div>

                      <div>
                        <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                          경도
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          value={m.longitude}
                          onChange={(e) => updateMeasurement(m.id, "longitude", e.target.value)}
                          placeholder="예: 127.148000"
                          className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-4 flex-wrap">
                    <div>
                      <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                        측정 사진
                      </label>

                      <label className="block cursor-pointer">
                        <div className="aspect-[4/3] w-40 bg-gray-100 rounded-xl flex flex-col items-center justify-center border border-gray-200 overflow-hidden">
                          {m.picture ? (
                            <img
                              src={m.picture}
                              alt={`수목 ${idx + 1} 측정 사진`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <Camera className="w-6 h-6 text-gray-300 mb-1" />
                              <span className="text-[0.75rem] text-gray-400">사진 업로드</span>
                            </>
                          )}
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const imageUrl = URL.createObjectURL(file);
                            updateMeasurement(m.id, "picture", imageUrl);
                            updateMeasurement(m.id, "pictureFile", file);
                          }}
                        />
                      </label>
                    </div>

                    <div className="flex-1 min-w-[220px] flex flex-col justify-end">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setCurrentLocation(m.id)}
                          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-[0.8rem] hover:bg-blue-700 transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          내 위치 등록
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-[0.8rem] flex-wrap justify-end">
                        <span className="text-gray-400">추정 CO₂ 흡수:</span>
                        <span
                          className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md"
                          style={{ fontWeight: 600 }}
                        >
                          {(() => {
                            const dbh = parseFloat(m.dbh);
                            return !isNaN(dbh) && dbh > 0
                              ? `${estimateCarbonPerTree(dbh).toFixed(1)}kg`
                              : "0.0kg";
                          })()}
                        </span>

                        <span className="text-gray-300">|</span>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[0.75rem] ${healthLabels[m.treeStatus].color}`}
                          style={{ fontWeight: 600 }}
                        >
                          {healthLabels[m.treeStatus].emoji} {healthLabels[m.treeStatus].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedRound !== "" && (
            <div>
              <h3 className="text-[0.9rem] text-gray-800 mb-3" style={{ fontWeight: 700 }}>
                선택한 이전 차수 데이터 ({selectedRound}차)
              </h3>

              <div className="space-y-4">
                {selectedPreviousMeasurements.length > 0 ? (
                  selectedPreviousMeasurements.map((prev, idx) => (
                    <div
                      key={prev.treeId ?? idx}
                      className="p-4 bg-white rounded-xl border border-dashed border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-[0.85rem] text-gray-700" style={{ fontWeight: 700 }}>
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                              수종
                            </label>
                            <div className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[0.85rem] text-gray-800">
                              {prev.treeType}
                            </div>
                          </div>

                          <div>
                            <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                              흉고직경 (cm)
                            </label>
                            <div className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[0.85rem] text-gray-800">
                              {prev.dbh}
                            </div>
                          </div>

                          <div>
                            <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                              수고 (m)
                            </label>
                            <div className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[0.85rem] text-gray-800">
                              {prev.height}
                            </div>
                          </div>

                          <div>
                            <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                              수관폭 (m)
                            </label>
                            <div className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[0.85rem] text-gray-800">
                              {prev.width}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                              건강상태
                            </label>
                            <div className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[0.85rem] text-gray-800">
                              {healthLabels[prev.treeStatus]?.label ?? prev.treeStatus}
                            </div>
                          </div>

                          <div>
                            <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                              수종 구분
                            </label>
                            <div className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[0.85rem] text-gray-800">
                              {prev.kind === "broadleaf"
                                ? "활엽수"
                                : prev.kind === "conifer"
                                ? "침엽수"
                                : prev.kind || "-"}
                            </div>
                          </div>

                          <div>
                            <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                              위도
                            </label>
                            <div className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[0.85rem] text-gray-800">
                              {prev.latitude || "-"}
                            </div>
                          </div>

                          <div>
                            <label className="text-[0.7rem] text-gray-400 mb-1 block" style={{ fontWeight: 600 }}>
                              경도
                            </label>
                            <div className="w-full px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[0.85rem] text-gray-800">
                              {prev.longitude || "-"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-end justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-[0.75rem] text-gray-400 mb-1">이전 측정 사진</p>
                          <div className="aspect-[4/3] w-40 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                            {prev.picture ? (
                              <img
                                src={`http://localhost:8080/uploads/${prev.picture}`}
                                alt={`이전 ${selectedRound}차 수목 ${idx + 1} 사진`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[0.75rem] text-gray-400">사진 없음</span>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-[220px] flex flex-col justify-end">
                          <div className="mt-3 flex items-center gap-2 text-[0.8rem] flex-wrap justify-end">
                            <span className="text-gray-400">이전 추정 CO₂ 흡수:</span>
                            <span
                              className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md"
                              style={{ fontWeight: 600 }}
                            >
                              {prev.dbh > 0 ? `${estimateCarbonPerTree(prev.dbh).toFixed(1)}kg` : "0.0kg"}
                            </span>

                            <span className="text-gray-300">|</span>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[0.75rem] ${getHealthDisplay(prev.treeStatus).color}`}
                              style={{ fontWeight: 600 }}
                            >
                              {getHealthDisplay(prev.treeStatus).emoji} {getHealthDisplay(prev.treeStatus).label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-gray-200 text-[0.85rem] text-gray-400">
                    선택한 차수의 이전 데이터가 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-[0.8rem] text-gray-400 mb-1">측정 수목</p>
          <p className="text-[1.75rem] text-gray-900" style={{ fontWeight: 700 }}>
            {measurements.length}
          </p>
          <p className="text-[0.75rem] text-gray-400">그루</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-[0.8rem] text-gray-400 mb-1">평균 흉고직경</p>
          <p className="text-[1.75rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
            {avgDbh.toFixed(1)}
          </p>
          <p className="text-[0.75rem] text-gray-400">cm</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-[0.8rem] text-gray-400 mb-1">추정 CO₂ 흡수</p>
          <p className="text-[1.75rem] text-emerald-700" style={{ fontWeight: 700 }}>
            {totalCO2.toFixed(1)}
          </p>
          <p className="text-[0.75rem] text-gray-400">kg (측정분)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-[0.8rem] text-gray-400 mb-1">건강상태</p>
          <p className="text-[1.75rem] text-blue-700" style={{ fontWeight: 700 }}>
            {measurements.filter((m) => m.treeStatus === "excellent" || m.treeStatus === "good").length}/
            {measurements.length}
          </p>
          <p className="text-[0.75rem] text-gray-400">양호 이상</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-[1rem] text-gray-900 mb-4" style={{ fontWeight: 700 }}>
          전경 사진
        </h2>

        <label className="block cursor-pointer w-60">
          <div className="aspect-[4/3] bg-gray-100 rounded-xl flex flex-col items-center justify-center border border-gray-200 overflow-hidden">
            {sitePicture ? (
              <img
                src={sitePicture}
                alt="전경 사진"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <Camera className="w-6 h-6 text-gray-300 mb-1" />
                <span className="text-[0.8rem] text-gray-400">전경 사진 업로드</span>
              </>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const imageUrl = URL.createObjectURL(file);
              setSitePicture(imageUrl);
              setSitePictureFile(file);
            }}
          />
        </label>

        {sitePicture && (
          <button
            onClick={() => {
              setSitePicture(null);
              setSitePictureFile(null);
            }}
            className="mt-3 px-3 py-1.5 text-[0.8rem] text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
          >
            사진 제거
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-[1rem] text-gray-900 mb-4" style={{ fontWeight: 700 }}>
          종합 소견
        </h2>
        <textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[0.9rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] resize-none"
          placeholder="현장 답사 종합 소견을 작성하세요..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-[0.95rem]"
          style={{ fontWeight: 600 }}
        >
          <Save className="w-4.5 h-4.5" />
          임시 저장
        </button>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#245a42] transition-colors text-[0.95rem] shadow-lg shadow-[#2D6A4F]/20 disabled:opacity-50"
          style={{ fontWeight: 600 }}
        >
          <Send className="w-4.5 h-4.5" />
          {saving ? "제출 중..." : "보고서 제출"}
        </button>
      </div>
    </div>
  );
}