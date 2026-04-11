import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Filter, X, MapPin, Calendar, TreePine } from "lucide-react";

interface TreeItem {
  treeId: number;
  treeType: string;
  treeStatus: string;
  kind: string;
  createDate: string;
  address: string;
  carbonAbsorption: number;
}

const healthColors: Record<string, string> = {
  양호: "#22C55E",
  보통: "#EAB308",
  불량: "#EF4444",
};

function formatCarbon(value: number) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
  })}`;
}

export function TreeList() {
  const [trees, setTrees] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [selectedTree, setSelectedTree] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:8080/api/expert-reports/company/trees",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const mappedData: TreeItem[] = response.data.map((item: any) => ({
          treeId: item.treeId,
          treeType: item.treeType,
          treeStatus: item.treeStatus,
          kind: item.kind,
          createDate: item.createDate,
          address: item.address,
          carbonAbsorption: Number(item.carbonAbsorption ?? 0),
        }));

        setTrees(mappedData);
      } catch (err) {
        console.error(err);
        setError("나무 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrees();
  }, []);

  const species = useMemo(
    () => [...new Set(trees.map((t) => t.treeType))],
    [trees]
  );

  const filtered = useMemo(() => {
    return trees.filter((t) => {
      if (speciesFilter !== "all" && t.treeType !== speciesFilter) return false;

      if (
        search &&
        !t.treeType.includes(search) &&
        !t.address.includes(search) &&
        !t.kind.includes(search)
      ) {
        return false;
      }

      return true;
    });
  }, [trees, speciesFilter, search]);

  const tree = trees.find((t) => t.treeId === selectedTree);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.5rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>
          나무 목록
        </h1>
        <p className="text-muted-foreground mt-1">
          기업의 최신 차수 기준 나무 정보를 조회합니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="수종, 수종 구분, 위치 검색"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-border focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none text-[0.875rem]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white border border-border text-[0.875rem] outline-none focus:ring-2 focus:ring-[#52B788]"
          >
            <option value="all">전체 수종</option>
            {species.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-border">
                {["나무 번호", "수종", "탄소흡수량", "수종 구분", "건강상태", "위치", "등록날짜"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[0.75rem] text-muted-foreground whitespace-nowrap"
                    style={{ fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    데이터를 불러오는 중입니다.
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    조회된 나무가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.treeId}
                    className="border-b border-border hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                    onClick={() => setSelectedTree(t.treeId)}
                  >
                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ fontWeight: 600 }}>
                      {t.treeId}
                    </td>

                    <td className="px-4 py-3.5 text-[0.875rem]" style={{ fontWeight: 500 }}>
                      <div className="flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-[#2D6A4F]" />
                        {t.treeType}
                      </div>
                    </td>

                    <td
                      className="px-4 py-3.5 text-[0.875rem] text-[#2D6A4F]"
                      style={{ fontWeight: 600 }}
                    >
                      {formatCarbon(t.carbonAbsorption)}
                    </td>

                    <td className="px-4 py-3.5 text-[0.875rem] text-muted-foreground">
                      {t.kind}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className="px-2.5 py-1 rounded-full text-[0.75rem]"
                        style={{
                          fontWeight: 500,
                          backgroundColor: (healthColors[t.treeStatus] || "#9CA3AF") + "15",
                          color: healthColors[t.treeStatus] || "#6B7280",
                        }}
                      >
                        {t.treeStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[0.875rem] text-muted-foreground">
                      {t.address}
                    </td>

                    <td className="px-4 py-3.5 text-[0.875rem] text-muted-foreground">
                      {t.createDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTree && tree && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTree(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-[1.125rem]" style={{ fontWeight: 600 }}>
                {tree.treeType} 상세 정보
              </h3>
              <button
                onClick={() => setSelectedTree(null)}
                className="p-1 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="h-48 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TreePine className="w-10 h-10 text-[#2D6A4F] mx-auto mb-2" />
                  <p className="text-[0.875rem] text-muted-foreground">나무 정보</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[0.875rem]">
                <div>
                  <span className="text-muted-foreground block">나무 번호</span>
                  <p style={{ fontWeight: 500 }}>{tree.treeId}</p>
                </div>

                <div>
                  <span className="text-muted-foreground block">수종</span>
                  <p style={{ fontWeight: 500 }}>{tree.treeType}</p>
                </div>

                <div>
                  <span className="text-muted-foreground block">수종 구분</span>
                  <p style={{ fontWeight: 500 }}>{tree.kind}</p>
                </div>

                <div>
                  <span className="text-muted-foreground block">건강상태</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[0.75rem]"
                    style={{
                      fontWeight: 500,
                      backgroundColor: (healthColors[tree.treeStatus] || "#9CA3AF") + "15",
                      color: healthColors[tree.treeStatus] || "#6B7280",
                    }}
                  >
                    {tree.treeStatus}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block">탄소흡수량</span>
                  <p className="text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                    {formatCarbon(tree.carbonAbsorption)}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground block">등록날짜</span>
                  <p style={{ fontWeight: 500 }}>{tree.createDate}</p>
                </div>
              </div>

              <div className="bg-[#F8F9FA] rounded-xl p-4 space-y-2 text-[0.875rem]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{tree.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>등록일: {tree.createDate}</span>
                </div>
              </div>

              <div className="border border-border rounded-xl p-4">
                <h4 className="text-[0.875rem] mb-2" style={{ fontWeight: 600 }}>
                  탄소흡수량
                </h4>
                <p className="text-[0.875rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                  {formatCarbon(tree.carbonAbsorption)}
                </p>
                <p className="text-[0.75rem] text-muted-foreground mt-2">
                  해당 나무의 개별 탄소흡수량 계산값입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}