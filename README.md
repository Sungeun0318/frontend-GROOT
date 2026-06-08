# GROOT Frontend

> 기업 ESG 실천을 위한 탄소중립 수목 관리 플랫폼의 React 프론트엔드

GROOT는 지역 기후와 토양 데이터를 기반으로 기업에 적합한 수종을 추천하고, 식재 수목의 탄소흡수량을 측정·예측해 친환경 인증마크를 발급하는 서비스입니다. 이 저장소는 사용자, 전문가, 관리자 화면을 제공하는 웹 클라이언트입니다.

## 프로젝트 개요

| 항목 | 내용 |
|:---|:---|
| 프로젝트 | GROOT - 기업 ESG 탄소중립 플랫폼 |
| 저장소 역할 | React 기반 웹 프론트엔드 |
| 주요 사용자 | 기업 회원, 수목 전문가, 관리자 |
| 백엔드 | [backend-GROOT](https://github.com/Sungeun0318/backend-GROOT) |

## 담당 역할

- 기업 회원가입, 로그인, 마이페이지 화면 구성
- 기업 답사 신청 및 신청 현황 화면 구현
- 지역·면적·희망 수량 기반 수목 추천 화면 구현
- 탄소흡수량 시각화, 인증마크, ESG 보고서 화면 구성
- 관리자 대시보드와 전문가 일정 관리 화면 구성
- Spring Boot REST API 연동을 위한 Vite proxy 설정

## 기술 스택

| 구분 | 기술 |
|:---|:---|
| Core | React 18, TypeScript, Vite |
| Routing | React Router |
| Styling | Tailwind CSS, Radix UI, lucide-react |
| Data / Chart | axios, Recharts |
| Build | Vite |

## 주요 화면

- `/` - 서비스 랜딩 페이지
- `/login`, `/signup`, `/company-register` - 인증 및 기업 회원가입
- `/dashboard` - 기업 대시보드
- `/recommend` - 수목 추천
- `/applications`, `/applications/new` - 답사 신청 및 현황
- `/trees` - 수목 목록
- `/carbon` - 탄소흡수량 시각화
- `/certification` - 인증마크 확인
- `/esg-report`, `/expert-report/:detailId` - ESG/전문가 보고서
- `/admin`, `/admin/schedules` - 관리자 페이지

## 실행 방법

```bash
npm install
npm run dev
```

기본 개발 서버는 Vite 기본 포트에서 실행됩니다.

백엔드는 로컬 `http://localhost:8080` 기준으로 연동됩니다. 프론트에서 `/api`로 요청하면 `vite.config.ts`의 proxy 설정을 통해 백엔드로 전달됩니다.

## 빌드

```bash
npm run build
npm run preview
```

## 폴더 구조

```text
src/
  app/             # 라우터 설정
  assets/          # 로고 등 정적 자산
  components/      # 공통 레이아웃, UI 컴포넌트
  pages/           # 화면 단위 페이지
  styles/          # 전역 스타일, 폰트, 테마
```

## 관련 링크

- Backend Repository: [backend-GROOT](https://github.com/Sungeun0318/backend-GROOT)
- Frontend Repository: [frontend-GROOT](https://github.com/Sungeun0318/frontend-GROOT)
