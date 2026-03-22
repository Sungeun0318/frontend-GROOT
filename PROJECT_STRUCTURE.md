# GreenZone Frontend 프로젝트 구조

> Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui 기반 ESG/탄소 관리 플랫폼

---

## 설정 파일

| 파일 | 설명 |
|------|------|
| `package.json` | 프로젝트 의존성 및 스크립트 (Vite, React 19, Tailwind v4, Radix UI, Recharts, Motion 등) |
| `vite.config.ts` | Vite 빌드 설정 - React 플러그인, Tailwind CSS 플러그인, `@` 경로 별칭 |
| `tsconfig.json` | TypeScript 설정 - `@/*` 경로 매핑, strict 모드 |
| `postcss.config.mjs` | PostCSS 설정 |
| `index.html` | SPA 진입점 HTML |

---

## 스타일 (`src/styles/`)

| 파일 | 설명 |
|------|------|
| `index.css` | 전체 앱 기본 스타일 |
| `tailwind.css` | Tailwind CSS v4 임포트 및 커스텀 설정 |
| `fonts.css` | 웹 폰트 정의 |
| `theme.css` | GreenZone 테마 변수 (--primary: #2D6A4F, --accent: #52B788 등 ESG 컬러 시스템) |

---

## 앱 코어 (`src/`)

| 파일 | 설명 |
|------|------|
| `main.tsx` | React 앱 진입점 - ReactDOM.createRoot, 스타일 임포트 |
| `app/App.tsx` | 최상위 앱 컴포넌트 - RouterProvider로 라우터 연결 |
| `app/routes.ts` | createBrowserRouter 라우팅 설정 - 모든 페이지 경로 정의 (`/`, `/login`, `/signup`, `/dashboard`, `/esg-report`, `/expert-report`, `/tree-recommendation`, `/application-status`, `/tree-list`, `/carbon-visualization`, `/certification`, `/admin`, `/logo-showcase`) |

---

## 페이지 컴포넌트 (`src/app/components/`)

| 파일 | 설명 |
|------|------|
| `Layout.tsx` | 공통 레이아웃 - 사이드바 네비게이션 (9개 메뉴), `/`, `/login`, `/signup`에서는 사이드바 미표시, Outlet으로 하위 페이지 렌더링 |
| `Landing.tsx` | 랜딩 페이지 - 히어로 섹션, 통계, 주요 기능 소개, 전국 참여 기업 현황(카카오맵/폴백 UI), 고객 후기, CTA |
| `Login.tsx` | 로그인 페이지 - 이메일/비밀번호 입력 폼 |
| `SignUp.tsx` | 회원가입 페이지 - 사업자등록번호 유효성 검사 포함 |
| `Dashboard.tsx` | 대시보드 - 요약 카드 (탄소 배출량, ESG 점수 등), 월별 탄소흡수량 바 차트(전년 대비 +18.2%), 수종별 분포 프로그레스바, 예정 일정 위젯(답사/점검/보고), 빠른 액션 |
| `ESGReport.tsx` | ESG 리포트 - 리포트 설정 + A4 미리보기, QR 코드 공유 (24시간 만료), 전송 버튼 |
| `ExpertReport.tsx` | 전문가 현장 리포트 - 수목 측정 데이터 입력 (DBH, 수고, 수관폭), 현장 조건, 사진 업로드, 탄소 추정 공식 계산, 제출 기능 |
| `TreeRecommendation.tsx` | 수목 추천 - 4단계 위저드 UI, Recharts 차트로 결과 시각화 |
| `ApplicationStatus.tsx` | 신청 현황 - 테이블 기반 신청 목록, 상태 뱃지, 상세 모달 |
| `TreeList.tsx` | 수목 목록 - 검색/필터 기능, 수목 테이블 |
| `CarbonVisualization.tsx` | 탄소 시각화 - 라인 차트, 파이 차트, CO₂ 비교 데이터 |
| `Certification.tsx` | 인증 페이지 - 등급 표시, 진행률 바, 인증서 다운로드 |
| `AdminPage.tsx` | 관리자 페이지 - 탭 (신청 관리/기업 관리), 신청 승인/거절, 기업 등급 개요 |
| `LogoShowcase.tsx` | 브랜드 아이덴티티 - 로고 락업, 심볼 스케일, 테마 변형, 컬러 시스템, 사용 목업 |
| `NotFound.tsx` | 404 페이지 - Leaf 아이콘, 홈으로 돌아가기 |

---

## 유틸리티 컴포넌트 (`src/app/components/`)

| 파일 | 설명 |
|------|------|
| `GrootLogo.tsx` | GreenZone 로고 컴포넌트 - lucide-react Leaf 아이콘 기반, size/variant/theme props 지원 |
| `KakaoMapCompanies.tsx` | 참여 기업 지도 컴포넌트 - 카카오맵 SDK 연동, API 키 없을 시 인터랙티브 폴백 UI (한국 지도 + 10개 기업 마커), 마커 클릭 시 기업 상세 정보 표시 |
| `figma/ImageWithFallback.tsx` | 이미지 폴백 컴포넌트 - 로드 실패 시 대체 UI 표시 |

---

## shadcn/ui 컴포넌트 (`src/app/components/ui/`)

### 유틸리티

| 파일 | 설명 |
|------|------|
| `utils.ts` | `cn()` 유틸리티 함수 - clsx + tailwind-merge로 클래스명 병합 |
| `use-mobile.ts` | `useIsMobile()` 훅 - 768px 브레이크포인트 기준 모바일 감지 |

### 기본 입력

| 파일 | 설명 |
|------|------|
| `button.tsx` | 버튼 - CVA 기반 variant(default/destructive/outline/secondary/ghost/link), size(default/sm/lg/icon) |
| `input.tsx` | 텍스트 입력 필드 |
| `textarea.tsx` | 멀티라인 텍스트 입력 |
| `label.tsx` | 폼 라벨 - Radix Label 프리미티브 |
| `checkbox.tsx` | 체크박스 - Radix Checkbox 프리미티브 |
| `radio-group.tsx` | 라디오 그룹 - Radix RadioGroup 프리미티브 |
| `switch.tsx` | 토글 스위치 - Radix Switch 프리미티브 |
| `select.tsx` | 드롭다운 셀렉트 - Radix Select (트리거, 콘텐츠, 아이템, 스크롤 버튼) |
| `slider.tsx` | 범위 슬라이더 - Radix Slider 프리미티브 |
| `toggle.tsx` | 토글 버튼 - CVA 기반 variant/size |
| `toggle-group.tsx` | 토글 그룹 - 컨텍스트로 variant/size 공유 |
| `input-otp.tsx` | OTP 입력 - 일회용 인증코드 입력 UI |
| `calendar.tsx` | 달력 - react-day-picker 기반 날짜 선택기 |

### 폼

| 파일 | 설명 |
|------|------|
| `form.tsx` | 폼 시스템 - react-hook-form 통합 (FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription) |

### 레이아웃 & 네비게이션

| 파일 | 설명 |
|------|------|
| `card.tsx` | 카드 - Header, Title, Description, Action, Content, Footer |
| `table.tsx` | 테이블 - Table, Header, Body, Footer, Row, Head, Cell, Caption |
| `tabs.tsx` | 탭 - Radix Tabs 프리미티브 |
| `accordion.tsx` | 아코디언 - Radix Accordion (접기/펼치기 애니메이션) |
| `separator.tsx` | 구분선 - Radix Separator (수평/수직) |
| `aspect-ratio.tsx` | 종횡비 컨테이너 - Radix AspectRatio |
| `scroll-area.tsx` | 커스텀 스크롤 영역 - Radix ScrollArea |
| `resizable.tsx` | 리사이즈 패널 - react-resizable-panels 래퍼 |
| `collapsible.tsx` | 접기/펼치기 - Radix Collapsible |
| `breadcrumb.tsx` | 브레드크럼 네비게이션 |
| `pagination.tsx` | 페이지네이션 - Previous, Next, Ellipsis |
| `navigation-menu.tsx` | 네비게이션 메뉴 - Radix NavigationMenu, 뷰포트 지원 |
| `sidebar.tsx` | 사이드바 시스템 - SidebarProvider, useSidebar, 쿠키 상태 저장, 키보드 단축키(Ctrl+B), 모바일 Sheet 지원, ~25개 서브 컴포넌트 |
| `carousel.tsx` | 캐러셀 - Embla Carousel 기반, 이전/다음 네비게이션 |

### 오버레이 & 모달

| 파일 | 설명 |
|------|------|
| `dialog.tsx` | 다이얼로그/모달 - Radix Dialog (오버레이, 콘텐츠, 헤더, 푸터, 닫기 버튼) |
| `alert-dialog.tsx` | 확인 다이얼로그 - Radix AlertDialog (취소/확인 액션) |
| `sheet.tsx` | 시트 패널 - 화면 사이드에서 슬라이드 (top/right/bottom/left) |
| `drawer.tsx` | 드로어 - vaul 기반, 4방향 지원 (top/bottom/left/right) |
| `popover.tsx` | 팝오버 - Radix Popover |
| `tooltip.tsx` | 툴팁 - Radix Tooltip + TooltipProvider |
| `hover-card.tsx` | 호버 카드 - Radix HoverCard |
| `command.tsx` | 커맨드 팔레트 - cmdk 기반, 다이얼로그 통합, 검색/그룹/아이템/단축키 |

### 메뉴

| 파일 | 설명 |
|------|------|
| `dropdown-menu.tsx` | 드롭다운 메뉴 - Radix DropdownMenu (체크박스/라디오 아이템, 서브메뉴, 단축키) |
| `context-menu.tsx` | 컨텍스트 메뉴 (우클릭) - Radix ContextMenu |
| `menubar.tsx` | 메뉴바 - Radix Menubar (데스크톱 앱 스타일 메뉴) |

### 피드백 & 상태

| 파일 | 설명 |
|------|------|
| `badge.tsx` | 뱃지 - CVA 기반 variant(default/secondary/destructive/outline) |
| `alert.tsx` | 알림 박스 - CVA 기반 variant(default/destructive) |
| `progress.tsx` | 프로그레스 바 - Radix Progress |
| `skeleton.tsx` | 스켈레톤 로딩 - 애니메이션 플레이스홀더 |
| `sonner.tsx` | 토스트 알림 - Sonner 라이브러리, next-themes 연동 |
| `avatar.tsx` | 아바타 - Radix Avatar (이미지 + 폴백) |

### 차트

| 파일 | 설명 |
|------|------|
| `chart.tsx` | 차트 시스템 - Recharts 래퍼, 테마 지원, 커스텀 툴팁/레전드 |

---

## 총 파일 수

- 설정 파일: 5개
- 스타일 파일: 4개
- 앱 코어: 3개
- 페이지 컴포넌트: 15개
- 유틸리티 컴포넌트: 3개
- shadcn/ui 컴포넌트: 46개 (유틸리티 2개 포함)
- **총: 76개 파일**
