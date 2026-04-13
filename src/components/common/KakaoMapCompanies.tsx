import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Building2, TreePine, MapPin, Leaf } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
  }
}

type CompanyDto = {
  memberId: number;
  grade: string;
  treeCount: number;
  totalCarbonAbsorption: number;
  companyName: string;
  partyName: string;
  address: string;
};

type CompanyWithCoords = CompanyDto & {
  lat: number;
  lng: number;
};

type TreeDto = {
  treeType: string;
  latitude: number;
  longitude: number;
  times: number;
};

interface KakaoMapCompaniesProps {
  height?: string;
  showList?: boolean;
}

const KAKAO_APP_KEY = "42704a18299feca7b6e9b3db5637a7de";
const TREE_VISIBLE_LEVEL = 6; // 숫자가 작을수록 더 확대된 상태

export function KakaoMapCompanies({
  height = "480px",
  showList = true,
}: KakaoMapCompaniesProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);

  const companyMarkersRef = useRef<any[]>([]);
  const treeMarkersRef = useRef<any[]>([]);
  const mapZoomListenerRef = useRef<(() => void) | null>(null);
  const treeMarkerImageRef = useRef<any>(null);

  const [companies, setCompanies] = useState<CompanyWithCoords[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithCoords | null>(null);
  const [selectedTrees, setSelectedTrees] = useState<TreeDto[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [treeLoading, setTreeLoading] = useState(false);

  useEffect(() => {
    loadKakaoMap();
  }, []);

  useEffect(() => {
    if (!window.kakao?.maps || companies.length === 0) return;

    initMapIfNeeded();
    renderCompanyMarkers();
  }, [companies]);

  useEffect(() => {
    if (!window.kakao?.maps || !kakaoMapRef.current) return;

    syncTreeMarkersByZoomLevel();
  }, [selectedTrees]);

  useEffect(() => {
    return () => {
      clearCompanyMarkers();
      clearTreeMarkers();
      detachZoomListener();
    };
  }, []);

  function loadKakaoMap() {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      loadCompanies();
      return;
    }

    const existingScript = document.querySelector('script[data-kakao-map="true"]');
    if (existingScript) {
      const waitUntilLoaded = setInterval(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
          clearInterval(waitUntilLoaded);
          loadCompanies();
        }
      }, 100);

      setTimeout(() => clearInterval(waitUntilLoaded), 10000);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.setAttribute("data-kakao-map", "true");

    script.onload = () => {
      window.kakao.maps.load(() => {
        loadCompanies();
      });
    };

    script.onerror = () => {
      setMapError(true);
      setLoading(false);
    };

    document.head.appendChild(script);
  }

  async function loadCompanies() {
    try {
      setLoading(true);
      setMapError(false);

      const response = await axios.get("/api/kakaomap");
      const companyList: CompanyDto[] = Array.isArray(response.data) ? response.data : [];

      const results = await Promise.all(
        companyList.map(async (company) => {
          const coords = await getCoordinatesByAddress(company.address);
          if (!coords) return null;

          return {
            ...company,
            lat: coords.lat,
            lng: coords.lng,
          };
        })
      );

      const filtered = results.filter(
        (item): item is CompanyWithCoords => item !== null
      );

      setCompanies(filtered);
    } catch (error) {
      console.error("기업 목록 조회 실패:", error);
      setMapError(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadTreesByMemberId(memberId: number) {
    try {
      setTreeLoading(true);

      const response = await axios.get(`/api/kakaomap/tree/${memberId}`);
      const treeList: TreeDto[] = Array.isArray(response.data) ? response.data : [];

      setSelectedTrees(treeList);
    } catch (error) {
      console.error("나무 목록 조회 실패:", error);
      setSelectedTrees([]);
      clearTreeMarkers();
    } finally {
      setTreeLoading(false);
    }
  }

  async function getCoordinatesByAddress(
    address: string
  ): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!window.kakao?.maps?.services) {
        console.error("카카오 maps services 라이브러리가 로드되지 않았습니다.");
        resolve(null);
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          resolve({
            lat: Number(result[0].y),
            lng: Number(result[0].x),
          });
        } else {
          console.error(`주소 변환 실패: ${address}, status=${status}`);
          resolve(null);
        }
      });
    });
  }

  function initMapIfNeeded() {
    if (!mapRef.current || companies.length === 0) return;
    if (kakaoMapRef.current) return;

    try {
      const firstCompany = companies[0];

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(firstCompany.lat, firstCompany.lng),
        level: 10,
      });

      kakaoMapRef.current = map;

      createTreeMarkerImage();
      attachZoomListener();

      setMapLoaded(true);
      setMapError(false);
    } catch (error) {
      console.error("지도 초기화 실패:", error);
      setMapError(true);
    }
  }

  function renderCompanyMarkers() {
    if (!window.kakao?.maps || !kakaoMapRef.current) return;

    clearCompanyMarkers();

    const map = kakaoMapRef.current;

    companies.forEach((company) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(company.lat, company.lng),
        map,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        handleSelectCompany(company);
      });

      companyMarkersRef.current.push(marker);
    });
  }

  function handleSelectCompany(company: CompanyWithCoords) {
    setSelectedCompany(company);
    moveToCompany(company);
    loadTreesByMemberId(company.memberId);
  }

  function moveToCompany(company: CompanyWithCoords) {
    if (!window.kakao?.maps || !kakaoMapRef.current) {
      setSelectedCompany(company);
      return;
    }

    const map = kakaoMapRef.current;
    const target = new window.kakao.maps.LatLng(company.lat, company.lng);
    const currentLevel = map.getLevel();

    map.panTo(target);

    if (currentLevel > TREE_VISIBLE_LEVEL) {
      window.setTimeout(() => {
        map.setLevel(TREE_VISIBLE_LEVEL, { animate: true });
      }, 220);
    }
  }

  function attachZoomListener() {
    if (!window.kakao?.maps || !kakaoMapRef.current) return;
    if (mapZoomListenerRef.current) return;

    const map = kakaoMapRef.current;

    const onZoomChanged = () => {
      syncTreeMarkersByZoomLevel();
    };

    window.kakao.maps.event.addListener(map, "zoom_changed", onZoomChanged);
    mapZoomListenerRef.current = onZoomChanged;
  }

  function detachZoomListener() {
    if (!window.kakao?.maps || !kakaoMapRef.current || !mapZoomListenerRef.current) return;

    window.kakao.maps.event.removeListener(
      kakaoMapRef.current,
      "zoom_changed",
      mapZoomListenerRef.current
    );

    mapZoomListenerRef.current = null;
  }

  function createTreeMarkerImage() {
    if (!window.kakao?.maps || treeMarkerImageRef.current) return;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="5" fill="#2D6A4F" stroke="white" stroke-width="2" />
      </svg>
    `;

    treeMarkerImageRef.current = new window.kakao.maps.MarkerImage(
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      new window.kakao.maps.Size(16, 16),
      {
        offset: new window.kakao.maps.Point(8, 8),
      }
    );
  }

  function syncTreeMarkersByZoomLevel() {
    if (!window.kakao?.maps || !kakaoMapRef.current) return;

    const map = kakaoMapRef.current;
    const level = map.getLevel();

    if (level <= TREE_VISIBLE_LEVEL) {
      showTreeMarkers(selectedTrees);
    } else {
      clearTreeMarkers();
    }
  }

  function showTreeMarkers(trees: TreeDto[]) {
    if (!window.kakao?.maps || !kakaoMapRef.current) return;

    clearTreeMarkers();

    if (trees.length === 0) return;

    const map = kakaoMapRef.current;

    trees.forEach((tree) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(tree.latitude, tree.longitude),
        image: treeMarkerImageRef.current ?? undefined,
        title: `${tree.treeType} (${tree.times}차)`,
      });

      marker.setMap(map);
      treeMarkersRef.current.push(marker);
    });
  }

  function clearCompanyMarkers() {
    companyMarkersRef.current.forEach((marker) => marker.setMap(null));
    companyMarkersRef.current = [];
  }

  function clearTreeMarkers() {
    treeMarkersRef.current.forEach((marker) => marker.setMap(null));
    treeMarkersRef.current = [];
  }

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        기업 주소를 위도/경도로 변환하고 지도를 준비하는 중입니다...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
        style={{ height }}
      >
        <div ref={mapRef} className="h-full w-full" />

        {(!mapLoaded || mapError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
            <div className="px-6 text-center">
              <p className="font-semibold text-[#2D6A4F]">지도를 불러오지 못했습니다.</p>
              <p className="mt-2 text-sm text-gray-600">
                카카오 JavaScript 키 또는 geocode API를 확인하세요.
              </p>
            </div>
          </div>
        )}

        {selectedCompany && mapLoaded && !mapError && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-white/92 px-3 py-2 text-xs text-gray-700 shadow">
            나무 표시는 지도 레벨 {TREE_VISIBLE_LEVEL} 이하에서만 보입니다.
          </div>
        )}
      </div>

      {selectedCompany && (
        <div className="animate-in fade-in rounded-xl border border-[#52B788]/20 bg-white p-5 shadow-sm duration-200">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-[1.05rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>
                {selectedCompany.companyName}
              </h4>
              <p className="mt-0.5 flex items-center gap-1 text-[0.85rem] text-gray-400">
                <MapPin className="h-3.5 w-3.5" />
                {selectedCompany.address}
              </p>
              <p className="mt-1 text-[0.75rem] text-gray-500">
                담당자: {selectedCompany.partyName}
              </p>
              <p className="text-[0.75rem] text-gray-500">
                위도: {selectedCompany.lat} / 경도: {selectedCompany.lng}
              </p>
            </div>
            <span className="text-[1rem] font-semibold text-[#2D6A4F]">
              {selectedCompany.grade}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-[#F0FFF4] p-3 text-center">
              <TreePine className="mx-auto mb-1 h-4 w-4 text-[#52B788]" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.treeCount}그루
              </p>
              <p className="text-[0.7rem] text-gray-400">등록 수목</p>
            </div>

            <div className="rounded-lg bg-[#F0FFF4] p-3 text-center">
              <Leaf className="mx-auto mb-1 h-4 w-4 text-[#52B788]" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.totalCarbonAbsorption}
              </p>
              <p className="text-[0.7rem] text-gray-400">탄소흡수량</p>
            </div>

            <div className="rounded-lg bg-[#F0FFF4] p-3 text-center">
              <Building2 className="mx-auto mb-1 h-4 w-4 text-[#52B788]" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.grade}
              </p>
              <p className="text-[0.7rem] text-gray-400">인증 등급</p>
            </div>
          </div>
        </div>
      )}

      {showList && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {companies.map((company) => (
            <button
              key={company.memberId}
              onClick={() => handleSelectCompany(company)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                selectedCompany?.memberId === company.memberId
                  ? "border-[#52B788] bg-[#F0FFF4] shadow-sm"
                  : "border-gray-100 bg-white hover:border-[#52B788]/30 hover:bg-[#FAFFFE]"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  selectedCompany?.memberId === company.memberId
                    ? "bg-[#2D6A4F]"
                    : "bg-[#D8F3DC]"
                }`}
              >
                <Building2
                  className={`h-5 w-5 ${
                    selectedCompany?.memberId === company.memberId
                      ? "text-white"
                      : "text-[#2D6A4F]"
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.875rem]" style={{ fontWeight: 600 }}>
                  {company.companyName}
                </p>
                <p className="truncate text-[0.75rem] text-gray-400">{company.address}</p>
                <p className="truncate text-[0.7rem] text-gray-500">
                  위도 {company.lat} / 경도 {company.lng}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[0.8rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                  {company.treeCount}그루
                </p>
                <p className="text-[0.65rem] text-gray-400">
                  {company.totalCarbonAbsorption}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedCompany && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#2D6A4F]" />
            <h5 className="text-sm font-semibold text-[#2D2D2D]">
              선택 기업의 나무 목록
            </h5>
          </div>

          {treeLoading ? (
            <p className="text-sm text-gray-500">나무 정보를 불러오는 중입니다...</p>
          ) : selectedTrees.length === 0 ? (
            <p className="text-sm text-gray-500">조회된 나무 정보가 없습니다.</p>
          ) : (
            <>
              <p className="mb-3 text-xs text-gray-500">
                지도에서는 확대된 상태(레벨 {TREE_VISIBLE_LEVEL} 이하)에서만 나무 마커를 표시합니다.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedTrees.map((tree, index) => (
                  <div
                    key={`${tree.treeType}-${tree.latitude}-${tree.longitude}-${index}`}
                    className="rounded-lg border border-gray-100 bg-[#FAFFFE] p-3"
                  >
                    <p className="text-sm font-semibold text-[#2D6A4F]">{tree.treeType}</p>
                    <p className="mt-1 text-xs text-gray-500">차수: {tree.times}</p>
                    <p className="text-xs text-gray-500">위도: {tree.latitude}</p>
                    <p className="text-xs text-gray-500">경도: {tree.longitude}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}