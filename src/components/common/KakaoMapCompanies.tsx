import { useEffect, useRef, useState } from "react";
import { Building2, TreePine, MapPin, Leaf } from "lucide-react";

// 참여 기업 데이터
const companies = [
  { id: 1, name: "그린테크 주식회사", address: "서울특별시 강남구 테헤란로 152", trees: 127, carbon: "4,820 kg", grade: "숲 🌳" },
  { id: 2, name: "한국에너지공사", address: "서울특별시 종로구 세종대로 209", trees: 342, carbon: "12,450 kg", grade: "산림 🏔️" },
  { id: 3, name: "그린빌딩(주)", address: "경기도 성남시 분당구 판교로 256", trees: 89, carbon: "3,210 kg", grade: "새싹 🌿" },
  { id: 4, name: "동아제약", address: "서울특별시 동대문구 천호대로 64", trees: 56, carbon: "2,030 kg", grade: "새싹 🌿" }, 
  { id: 5, name: "에코솔루션", address: "인천광역시 연수구 컨벤시아대로 165", trees: 203, carbon: "7,890 kg", grade: "숲 🌳" },
  { id: 6, name: "제이엔케이", address: "경기도 수원시 영통구 광교로 145", trees: 178, carbon: "6,520 kg", grade: "숲 🌳" },
  { id: 7, name: "대한건설", address: "서울특별시 서초구 반포대로 58", trees: 415, carbon: "15,200 kg", grade: "산림 🏔️" },
  { id: 8, name: "클린에어테크", address: "부산광역시 해운대구 센텀중앙로 97", trees: 95, carbon: "3,450 kg", grade: "새싹 🌿" },
  { id: 9, name: "바이오그린", address: "대전광역시 유성구 대학로 99", trees: 267, carbon: "9,780 kg", grade: "숲 🌳" },
  { id: 10, name: "서울환경", address: "서울특별시 마포구 월드컵북로 396", trees: 512, carbon: "18,900 kg", grade: "산림 🏔️" },
];

type Company = {
  id: number;
  name: string;
  address: string;
  trees: number;
  carbon: string;
  grade: string;
};

type CompanyWithCoords = Company & {
  lat: number;
  lng: number;
};

type TreePoint = {
  treeId: number;
  detailId: number;
  treeType: string;
  latitude: number;
  longitude: number;
};

// 나무 샘플
const companyTrees: Record<number, TreePoint[]> = {
  1: [
    { treeId: 101, detailId: 1, treeType: "기억나무 A", latitude: 37.5018, longitude: 127.0401 },
    { treeId: 102, detailId: 2, treeType: "기억나무 B", latitude: 37.5007, longitude: 127.0388 },
    { treeId: 103, detailId: 3, treeType: "기억나무 C", latitude: 37.5021, longitude: 127.0412 },
  ],
  2: [
    { treeId: 201, detailId: 1, treeType: "기억나무 D", latitude: 37.5727, longitude: 126.9775 },
    { treeId: 202, detailId: 2, treeType: "기억나무 E", latitude: 37.5719, longitude: 126.9762 },
  ],
};

declare global {
  interface Window {
    kakao: any;
  }
}

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
  const treeMarkersRef = useRef<any[]>([]);
  const companyMarkersRef = useRef<any[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<CompanyWithCoords | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [loadingCoords, setLoadingCoords] = useState(true);
  const [companiesWithCoords, setCompaniesWithCoords] = useState<CompanyWithCoords[]>([]);

  useEffect(() => {
    loadCompaniesWithCoordinates();
  }, []);

  useEffect(() => {
    if (companiesWithCoords.length === 0) return;

    const KAKAO_APP_KEY = "여기에_카카오_자바스크립트_키";

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };

    script.onerror = () => {
      setMapError(true);
    };

    document.head.appendChild(script);
  }, [companiesWithCoords]);

  useEffect(() => {
    if (!selectedCompany) {
      clearTreeMarkers();
      return;
    }

    showTreeMarkers(selectedCompany.id);
  }, [selectedCompany]);

  async function loadCompaniesWithCoordinates() {
    try {
      setLoadingCoords(true);

      const results = await Promise.all(
        companies.map(async (company) => {
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

      setCompaniesWithCoords(filtered);

      if (filtered.length > 0) {
        setSelectedCompany(filtered[0]);
      }
    } catch (error) {
      console.error("기업 주소 좌표 변환 실패:", error);
      setMapError(true);
    } finally {
      setLoadingCoords(false);
    }
  }

  async function getCoordinatesByAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }

      const data = await response.json();

      return {
        lat: Number(data.latitude),
        lng: Number(data.longitude),
      };
    } catch (error) {
      console.error(`주소 변환 실패: ${address}`, error);
      return null;
    }
  }

  function initMap() {
    if (!mapRef.current || companiesWithCoords.length === 0) return;

    try {
      const firstCompany = companiesWithCoords[0];

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(firstCompany.lat, firstCompany.lng),
        level: 10,
      });

      kakaoMapRef.current = map;
      clearCompanyMarkers();

      companiesWithCoords.forEach((company) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(company.lat, company.lng),
          map,
        });

        const infoContent = `
          <div style="padding:12px 16px;min-width:200px;font-family:Pretendard,sans-serif;">
            <strong style="font-size:14px;color:#2D6A4F;">${company.name}</strong>
            <p style="font-size:12px;color:#666;margin:4px 0;">${company.address}</p>
            <div style="display:flex;gap:12px;margin-top:8px;">
              <span style="font-size:12px;color:#52B788;font-weight:600;">🌳 ${company.trees}그루</span>
              <span style="font-size:12px;color:#2D6A4F;font-weight:600;">CO₂ ${company.carbon}</span>
            </div>
            <span style="font-size:11px;color:#888;margin-top:4px;display:block;">${company.grade}</span>
          </div>
        `;

        const infowindow = new window.kakao.maps.InfoWindow({
          content: infoContent,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(map, marker);
          moveToCompany(company);
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

  function clearTreeMarkers() {
    treeMarkersRef.current.forEach((marker) => marker.setMap(null));
    treeMarkersRef.current = [];
  }

  function showTreeMarkers(companyId: number) {
    if (!window.kakao?.maps || !kakaoMapRef.current) return;

    clearTreeMarkers();

    const trees = companyTrees[companyId] || [];
    const map = kakaoMapRef.current;

    trees.forEach((tree) => {
      const content = document.createElement("div");
      content.style.width = "10px";
      content.style.height = "10px";
      content.style.borderRadius = "9999px";
      content.style.background = "#2D6A4F";
      content.style.border = "2px solid white";
      content.style.boxShadow = "0 0 6px rgba(0,0,0,0.2)";
      content.title = tree.treeType;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(tree.latitude, tree.longitude),
        content,
        yAnchor: 0.5,
      });

      overlay.setMap(map);
      treeMarkersRef.current.push(overlay);
    });
  }

  if (loadingCoords) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        기업 주소를 위도/경도로 변환 중입니다...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Container */}
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

      {/* Selected Company Info */}
      {selectedCompany && (
        <div className="bg-white rounded-xl border border-[#52B788]/20 p-5 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-[1.05rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>
                {selectedCompany.name}
              </h4>
              <p className="text-[0.85rem] text-gray-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedCompany.address}
              </p>
              <p className="text-[0.75rem] text-gray-500 mt-1">
                위도: {selectedCompany.lat} / 경도: {selectedCompany.lng}
              </p>
            </div>
            <span className="text-[1.25rem]">{selectedCompany.grade.split(" ")[1]}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <TreePine className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.trees}그루
              </p>
              <p className="text-[0.7rem] text-gray-400">등록 수목</p>
            </div>
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <Leaf className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.carbon}
              </p>
              <p className="text-[0.7rem] text-gray-400">탄소흡수량</p>
            </div>
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <Building2 className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>
                {selectedCompany.grade.split(" ")[0]}
              </p>
              <p className="text-[0.7rem] text-gray-400">인증 등급</p>
            </div>
          </div>
        </div>
      )}

      {/* Company List */}
      {showList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {companiesWithCoords.map((company) => (
            <button
              key={company.id}
              onClick={() => moveToCompany(company)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                selectedCompany?.id === company.id
                  ? "border-[#52B788] bg-[#F0FFF4] shadow-sm"
                  : "border-gray-100 bg-white hover:border-[#52B788]/30 hover:bg-[#FAFFFE]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedCompany?.id === company.id ? "bg-[#2D6A4F]" : "bg-[#D8F3DC]"
                }`}
              >
                <Building2
                  className={`w-5 h-5 ${
                    selectedCompany?.id === company.id ? "text-white" : "text-[#2D6A4F]"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>
                  {company.name}
                </p>
                <p className="text-[0.75rem] text-gray-400 truncate">{company.address}</p>
                <p className="text-[0.7rem] text-gray-500 truncate">
                  위도 {company.lat} / 경도 {company.lng}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[0.8rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>
                  {company.trees}그루
                </p>
                <p className="text-[0.65rem] text-gray-400">{company.carbon}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}