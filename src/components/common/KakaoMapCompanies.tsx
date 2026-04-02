import { useEffect, useRef, useState } from "react";
import { Building2, TreePine, MapPin, Leaf } from "lucide-react";

// 참여 기업 모크 데이터
const companies = [
  { id: 1, name: "그린테크 주식회사", address: "서울특별시 강남구 테헤란로 152", trees: 127, carbon: "4,820 kg", lat: 37.5012, lng: 127.0396, grade: "숲 🌳" },
  { id: 2, name: "한국에너지공사", address: "서울특별시 종로구 세종대로 209", trees: 342, carbon: "12,450 kg", lat: 37.5723, lng: 126.9769, grade: "산림 🏔️" },
  { id: 3, name: "그린빌딩(주)", address: "경기도 성남시 분당구 판교로 256", trees: 89, carbon: "3,210 kg", lat: 37.3947, lng: 127.1112, grade: "새싹 🌿" },
  { id: 4, name: "동아제약", address: "서울특별시 동대문구 천호대로 64", trees: 56, carbon: "2,030 kg", lat: 37.5745, lng: 127.0407, grade: "새싹 🌿" },
  { id: 5, name: "에코솔루션", address: "인천광역시 연수구 컨벤시아대로 165", trees: 203, carbon: "7,890 kg", lat: 37.3823, lng: 126.6615, grade: "숲 🌳" },
  { id: 6, name: "제이엔케이", address: "경기도 수원시 영통구 광교로 145", trees: 178, carbon: "6,520 kg", lat: 37.2911, lng: 127.0465, grade: "숲 🌳" },
  { id: 7, name: "대한건설", address: "서울특별시 서초구 반포대로 58", trees: 415, carbon: "15,200 kg", lat: 37.4969, lng: 127.0000, grade: "산림 🏔️" },
  { id: 8, name: "클린에어테크", address: "부산광역시 해운대구 센텀중앙로 97", trees: 95, carbon: "3,450 kg", lat: 35.1696, lng: 129.1313, grade: "새싹 🌿" },
  { id: 9, name: "바이오그린", address: "대전광역시 유성구 대학로 99", trees: 267, carbon: "9,780 kg", lat: 36.3626, lng: 127.3566, grade: "숲 🌳" },
  { id: 10, name: "서울환경", address: "서울특별시 마포구 월드컵북로 396", trees: 512, carbon: "18,900 kg", lat: 37.5665, lng: 126.9002, grade: "산림 🏔️" },
];

// 나무 타입 
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

export function KakaoMapCompanies({ height = "480px", showList = true }: KakaoMapCompaniesProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<typeof companies[0] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Kakao Maps SDK 로드
    // 실제 운영 시 YOUR_KAKAO_APP_KEY를 카카오 개발자 콘솔에서 발급받은 JavaScript 키로 교체하세요
    const KAKAO_APP_KEY = "42704a18299feca7b6e9b3db5637a7de";

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




    return () => {
      // cleanup if needed
    };
  }, []);

useEffect(() => {
  if (!selectedCompany) {
    clearTreeMarkers();
    return;
  }

  showTreeMarkers(selectedCompany.id);
}, [selectedCompany]);




  function moveToCompany(company: typeof companies[0]) {
  if (!window.kakao?.maps || !kakaoMapRef.current) {
    setSelectedCompany(company);
    return;
  }

  const map = kakaoMapRef.current;
  const moveLatLng = new window.kakao.maps.LatLng(company.lat, company.lng);

  // 중심 이동 + 확대를 한 번에 처리
  map.jump(moveLatLng, 4, {
    animate: {
      duration: 700,
    },
  });

  setSelectedCompany(company);
}

  function initMap() {
    if (!mapRef.current) return;
    try {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5664, 126.9778),
        level: 10, // 지도 확대 정도
      });

      kakaoMapRef.current = map;

      companies.forEach((company) => {
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

        const infowindow = new window.kakao.maps.InfoWindow({ content: infoContent });

        window.kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(map, marker);
          moveToCompany(company);
          
        });
      });

      

      setMapLoaded(true);
    } catch {
      setMapError(true);
    }
  }
const treeMarkersRef = useRef<any[]>([]);

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




  
  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height }}>
        <div ref={mapRef} className="w-full h-full" />

        {/* Fallback if Kakao Map doesn't load */}
        {(!mapLoaded || mapError) && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex flex-col items-center justify-center">
            {/* Stylized map background */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232D6A4F'%3E%3Ccircle cx='10' cy='30' r='2'/%3E%3Ccircle cx='50' cy='20' r='2'/%3E%3Ccircle cx='80' cy='50' r='2'/%3E%3Ccircle cx='30' cy='70' r='2'/%3E%3Ccircle cx='70' cy='80' r='2'/%3E%3Ccircle cx='20' cy='50' r='1.5'/%3E%3Ccircle cx='60' cy='60' r='1.5'/%3E%3Ccircle cx='90' cy='30' r='1.5'/%3E%3Ccircle cx='40' cy='40' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`
            }} />

            {/* Mock markers on map */}
            <div className="absolute inset-0">
              {/* Korea outline approximation */}
              <svg viewBox="0 0 400 500" className="w-full h-full opacity-10">
                <path d="M200 50 Q250 80 260 150 Q270 200 250 280 Q240 330 220 370 Q200 400 180 420 Q160 380 150 330 Q140 280 145 230 Q150 180 160 130 Q170 90 200 50Z" fill="#2D6A4F" />
              </svg>

              {/* Company markers */}
              {companies.map((company, i) => {
                // Approximate positions on the container
                const positions: Record<number, { top: string; left: string }> = {
                  1: { top: "32%", left: "62%" },
                  2: { top: "28%", left: "58%" },
                  3: { top: "35%", left: "63%" },
                  4: { top: "29%", left: "62%" },
                  5: { top: "33%", left: "50%" },
                  6: { top: "37%", left: "61%" },
                  7: { top: "33%", left: "60%" },
                  8: { top: "68%", left: "72%" },
                  9: { top: "45%", left: "58%" },
                  10: { top: "30%", left: "56%" },
                };
                const pos = positions[company.id] || { top: "50%", left: "50%" };
                return (
                  <button
                    key={company.id}
                    onClick={() => moveToCompany(company)}
                    className="absolute group"
                    style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -100%)" }}
                  >
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-125 ${selectedCompany?.id === company.id ? "bg-[#2D6A4F] scale-125" : "bg-[#52B788]"}`}>
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#52B788] shadow-sm" style={{ backgroundColor: selectedCompany?.id === company.id ? "#2D6A4F" : "#52B788" }} />
                    </div>
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white rounded-lg shadow-lg text-[0.75rem] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
                      <p style={{ fontWeight: 600 }} className="text-[#2D6A4F]">{company.name}</p>
                      <p className="text-gray-400">{company.trees}그루 · {company.carbon}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md border border-gray-100">
              <p className="text-[0.7rem] text-gray-400 mb-2" style={{ fontWeight: 600 }}>참여 기업 현황</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#52B788]" />
                  <span className="text-[0.7rem] text-gray-600">활동 기업</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#2D6A4F]" />
                  <span className="text-[0.7rem] text-gray-600">선택된 기업</span>
                </div>
              </div>
            </div>

            {/* Total stats badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[1.25rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>248<span className="text-[0.8rem] text-gray-400 ml-1" style={{ fontWeight: 400 }}>개사</span></p>
                  <p className="text-[0.7rem] text-gray-400">전국 참여 기업</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Company Info */}
      {selectedCompany && (
        <div className="bg-white rounded-xl border border-[#52B788]/20 p-5 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-[1.05rem] text-[#2D2D2D]" style={{ fontWeight: 700 }}>{selectedCompany.name}</h4>
              <p className="text-[0.85rem] text-gray-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedCompany.address}
              </p>
            </div>
            <span className="text-[1.25rem]">{selectedCompany.grade.split(" ")[1]}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <TreePine className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>{selectedCompany.trees}그루</p>
              <p className="text-[0.7rem] text-gray-400">등록 수목</p>
            </div>
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <Leaf className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>{selectedCompany.carbon}</p>
              <p className="text-[0.7rem] text-gray-400">탄소흡수량</p>
            </div>
            <div className="bg-[#F0FFF4] rounded-lg p-3 text-center">
              <Building2 className="w-4 h-4 text-[#52B788] mx-auto mb-1" />
              <p className="text-[1rem] text-[#2D6A4F]" style={{ fontWeight: 700 }}>{selectedCompany.grade.split(" ")[0]}</p>
              <p className="text-[0.7rem] text-gray-400">인증 등급</p>
            </div>
          </div>
        </div>
      )}

      {/* Company List */}
      {showList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => moveToCompany(company)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${selectedCompany?.id === company.id
                  ? "border-[#52B788] bg-[#F0FFF4] shadow-sm"
                  : "border-gray-100 bg-white hover:border-[#52B788]/30 hover:bg-[#FAFFFE]"
                }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedCompany?.id === company.id ? "bg-[#2D6A4F]" : "bg-[#D8F3DC]"
                }`}>
                <Building2 className={`w-5 h-5 ${selectedCompany?.id === company.id ? "text-white" : "text-[#2D6A4F]"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{company.name}</p>
                <p className="text-[0.75rem] text-gray-400 truncate">{company.address}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[0.8rem] text-[#2D6A4F]" style={{ fontWeight: 600 }}>{company.trees}그루</p>
                <p className="text-[0.65rem] text-gray-400">{company.carbon}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}