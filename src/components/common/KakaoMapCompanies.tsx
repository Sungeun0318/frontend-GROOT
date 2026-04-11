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

export function KakaoMapCompanies({
  height = "480px",
  showList = true,
}: KakaoMapCompaniesProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);
  const companyMarkersRef = useRef<any[]>([]);
  const treeMarkersRef = useRef<any[]>([]);
 

  const [companies, setCompanies] = useState<CompanyWithCoords[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithCoords | null>(null);
  const [selectedTrees, setSelectedTrees] = useState<TreeDto[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [treeLoading, setTreeLoading] = useState(false);

  useEffect(() => {
  const KAKAO_APP_KEY = "42704a18299feca7b6e9b3db5637a7de";

  // 이미 로드된 경우
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    loadCompanies();
    return;
  }

  const existingScript = document.querySelector('script[data-kakao-map="true"]');
  if (existingScript) return;

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
}, []);

useEffect(() => {
  if (companies.length > 0) {
    initMap();
  }
}, [companies]);


  useEffect(() => {
    if (companies.length === 0) return;

    const KAKAO_APP_KEY = "42704a18299feca7b6e9b3db5637a7de";

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const existingScript = document.querySelector('script[data-kakao-map="true"]');
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.setAttribute("data-kakao-map", "true");

    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };

    script.onerror = () => {
      setMapError(true);
    };

    document.head.appendChild(script);
  }, [companies]);

  async function loadCompanies() {
    try {
      setLoading(true);
      setMapError(false);

      const response = await axios.get("http://localhost:8080/api/kakaomap");
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

    const response = await axios.get(`http://localhost:8080/api/kakaomap/tree/${memberId}`);
    const treeList: TreeDto[] = Array.isArray(response.data) ? response.data : [];

    console.log("memberId:", memberId);
    console.log("treeList:", treeList);

    setSelectedTrees(treeList);
    showTreeMarkers(treeList);
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

  function initMap() {
    if (!mapRef.current || companies.length === 0) return;

    try {
      const firstCompany = companies[0];

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(firstCompany.lat, firstCompany.lng),
        level: 10,
      });

      kakaoMapRef.current = map;

      clearCompanyMarkers();
      clearTreeMarkers();
      closeAllInfoWindows();

      companies.forEach((company) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(company.lat, company.lng),
          map,
        });

        const infoContent = `
          <div style="padding:12px 16px;min-width:220px;font-family:Pretendard,sans-serif;">
            <strong style="font-size:14px;color:#2D6A4F;">${company.companyName}</strong>
            <p style="font-size:12px;color:#666;margin:4px 0;">${company.address}</p>
            <div style="display:flex;gap:12px;margin-top:8px;">
              <span style="font-size:12px;color:#52B788;font-weight:600;">🌳 ${company.treeCount}그루</span>
              <span style="font-size:12px;color:#2D6A4F;font-weight:600;">CO₂ ${company.totalCarbonAbsorption}</span>
            </div>
            <span style="font-size:11px;color:#888;margin-top:4px;display:block;">${company.grade}</span>
          </div>
        `;

      

        window.kakao.maps.event.addListener(marker, "click", () => {
  moveToCompany(company);
  setSelectedCompany(company);
  loadTreesByMemberId(company.memberId);
});

        companyMarkersRef.current.push(marker);
       
      });

      setMapLoaded(true);
    } catch (error) {
      console.error(error);
      setMapError(true);
    }
  }

  function moveToCompany(company: CompanyWithCoords) {
    if (!window.kakao?.maps || !kakaoMapRef.current) {
      setSelectedCompany(company);
      return;
    }

    const map = kakaoMapRef.current;
    const moveLatLng = new window.kakao.maps.LatLng(company.lat, company.lng);

    map.jump(moveLatLng, 4, {
      animate: {
        duration: 700,
      },
    });

    setSelectedCompany(company);
  }

  function clearCompanyMarkers() {
    companyMarkersRef.current.forEach((marker) => marker.setMap(null));
    companyMarkersRef.current = [];
  }

  function closeAllInfoWindows() {
    
  }

  function clearTreeMarkers() {
    treeMarkersRef.current.forEach((marker) => marker.setMap(null));
    treeMarkersRef.current = [];
  }

  function showTreeMarkers(trees: TreeDto[]) {
    if (!window.kakao?.maps || !kakaoMapRef.current) return;

    clearTreeMarkers();

    const map = kakaoMapRef.current;

    trees.forEach((tree) => {
      const content = document.createElement("div");
      content.style.width = "10px";
      content.style.height = "10px";
      content.style.borderRadius = "9999px";
      content.style.background = "#2D6A4F";
      content.style.border = "2px solid white";
      content.style.boxShadow = "0 0 6px rgba(0,0,0,0.2)";
      content.title = `${tree.treeType} (${tree.times}차)`;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(tree.latitude, tree.longitude),
        content,
        yAnchor: 0.5,
      });

      overlay.setMap(map);
      treeMarkersRef.current.push(overlay);
    });
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
        className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
        style={{ height }}
      >
        <div ref={mapRef} className="w-full h-full" />

        {(!mapLoaded || mapError) && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
            <div className="text-center px-6">
              <p className="text-[#2D6A4F] font-semibold">지도를 불러오지 못했습니다.</p>
              <p className="text-sm text-gray-600 mt-2">
                카카오 JavaScript 키 또는 geocode API를 확인하세요.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedCompany && (
        <div className="bg-white rounded-xl border border-[#52B788]/20 p-5 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-[1.05rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>
                {selectedCompany.companyName}
              </h4>
              <p className="text-[0.85rem] text-gray-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedCompany.address}
              </p>
              <p className="text-[0.75rem] text-gray-500 mt-1">
                담당자: {selectedCompany.partyName}
              </p>
              <p className="text-[0.75rem] text-gray-500">
                위도: {selectedCompany.lat} / 경도: {selectedCompany.lng}
              </p>
            </div>
            <span className="text-[1rem] text-[#2D6A4F] font-semibold">
              {selectedCompany.grade}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <TreePine className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.treeCount}그루
              </p>
              <p className="text-[0.7rem] text-gray-400">등록 수목</p>
            </div>
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <Leaf className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.totalCarbonAbsorption}
              </p>
              <p className="text-[0.7rem] text-gray-400">탄소흡수량</p>
            </div>
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <Building2 className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.grade}
              </p>
              <p className="text-[0.7rem] text-gray-400">인증 등급</p>
            </div>
          </div>
        </div>
      )}

      {showList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {companies.map((company) => (
            <button
              key={company.memberId}
              onClick={() => {
                moveToCompany(company);
                setSelectedCompany(company);
                loadTreesByMemberId(company.memberId);
              }}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                selectedCompany?.memberId === company.memberId
                  ? "border-[#52B788] bg-[#F0FFF4] shadow-sm"
                  : "border-gray-100 bg-white hover:border-[#52B788]/30 hover:bg-[#FAFFFE]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedCompany?.memberId === company.memberId
                    ? "bg-[#2D6A4F]"
                    : "bg-[#D8F3DC]"
                }`}
              >
                <Building2
                  className={`w-5 h-5 ${
                    selectedCompany?.memberId === company.memberId
                      ? "text-white"
                      : "text-[#2D6A4F]"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>
                  {company.companyName}
                </p>
                <p className="text-[0.75rem] text-gray-400 truncate">
                  {company.address}
                </p>
                <p className="text-[0.7rem] text-gray-500 truncate">
                  위도 {company.lat} / 경도 {company.lng}
                </p>
              </div>

              <div className="text-right shrink-0">
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
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#2D6A4F]" />
            <h5 className="text-sm font-semibold text-[#2D2D2D]">
              선택 기업의 나무 목록
            </h5>
          </div>

          {treeLoading ? (
            <p className="text-sm text-gray-500">나무 정보를 불러오는 중입니다...</p>
          ) : selectedTrees.length === 0 ? (
            <p className="text-sm text-gray-500">조회된 나무 정보가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedTrees.map((tree, index) => (
                <div
                  key={`${tree.treeType}-${tree.latitude}-${tree.longitude}-${index}`}
                  className="rounded-lg border border-gray-100 bg-[#FAFFFE] p-3"
                >
                  <p className="text-sm font-semibold text-[#2D6A4F]">{tree.treeType}</p>
                  <p className="text-xs text-gray-500 mt-1">차수: {tree.times}</p>
                  <p className="text-xs text-gray-500">위도: {tree.latitude}</p>
                  <p className="text-xs text-gray-500">경도: {tree.longitude}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}