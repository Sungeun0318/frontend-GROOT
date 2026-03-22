import { useNavigate } from "react-router";
import {
  TreePine,
  Search,
  Award,
  BarChart3,
  ArrowRight,
  Leaf,
  Globe,
  ChevronRight,
  Shield,
  FileText,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Building2,
  Star,
  ArrowUpRight,
  Play,
  Zap,
  Users,
  Clock,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { GrootLogo } from "./GrootLogo";
import { KakaoMapCompanies } from "./KakaoMapCompanies";

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, started]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function FloatingCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const testimonials = [
  {
    name: "김태호",
    role: "ESG 경영팀장",
    company: "한국에너지공사",
    content:
      "GROOT 도입 후 탄소배출 관리가 체계적으로 변했습니다. 특히 실시간 탄소흡수량 모니터링과 자동 보고서 생성이 업무 효율을 크게 높였습니다.",
    rating: 5,
    avatar: "KT",
  },
  {
    name: "박서연",
    role: "지속가능경영 이사",
    company: "그린빌딩(주)",
    content:
      "인증마크 제도가 투자자 IR에 매우 효과적이었습니다. 데이터 기반의 투명한 탄소 관리로 ESG 등급이 2단계 상승했습니다.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "이준혁",
    role: "환경안전팀",
    company: "동아제약",
    content:
      "수목 추천 AI가 정말 정확합니다. 지역 기후와 토양에 최적화된 수종을 추천받아 활착률 95%를 달성했습니다.",
    rating: 5,
    avatar: "LJ",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI 수종 추천",
    desc: "지역 기후·토양 데이터를 분석하여 최적의 수종 3가지를 추천합니다.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: BarChart3,
    title: "실시간 탄소 모니터링",
    desc: "등록된 수목의 탄소흡수량을 실시간으로 추적하고 시각화합니다.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: Shield,
    title: "블록체인 인증",
    desc: "탄소흡수 데이터를 블록체인에 기록하여 위변조를 방지합니다.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: FileText,
    title: "자동 ESG 보고서",
    desc: "GRI·TCFD 기준에 맞는 ESG 보고서를 자동으로 생성합니다.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Globe,
    title: "글로벌 탄소 크레딧",
    desc: "국제 탄소 크레딧 시장과 연동하여 크레딧 거래를 지원합니다.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: Users,
    title: "전문가 현장 답사",
    desc: "검증된 전문가가 직접 현장을 방문하여 수목 상태를 점검합니다.",
    gradient: "from-purple-500 to-pink-600",
  },
];

export function Landing() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GrootLogo size="md" theme="dark" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[0.9rem] text-gray-600">
            <a
              href="#process"
              className="hover:text-[#2D6A4F] transition-colors"
            >
              프로세스
            </a>
            <a
              href="#features"
              className="hover:text-[#2D6A4F] transition-colors"
            >
              기능
            </a>
            <a
              href="#reviews"
              className="hover:text-[#2D6A4F] transition-colors"
            >
              후기
            </a>
            <a
              href="#map"
              className="hover:text-[#2D6A4F] transition-colors"
            >
              참여 기업
            </a>
            <a
              href="#pricing"
              className="hover:text-[#2D6A4F] transition-colors"
            >
              인증등급
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-[0.9rem] text-gray-700 hover:text-[#2D6A4F] transition-colors"
              style={{ fontWeight: 500 }}
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#235c43] transition-all shadow-lg shadow-[#2D6A4F]/25 hover:shadow-[#2D6A4F]/40 text-[0.9rem]"
              style={{ fontWeight: 600 }}
            >
              무료 시작하기
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16">
        <div className="relative min-h-[700px] flex items-center">
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1650006883843-c0335fd03c39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZvcmVzdCUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzczNzUzNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Green forest"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a3d2e]/95 via-[#2D6A4F]/80 to-[#2D6A4F]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
                >
                  <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
                  <span
                    className="text-white/90 text-[0.85rem]"
                    style={{ fontWeight: 500 }}
                  >
                    2026년 ESG 경영 필수 플랫폼
                  </span>
                </motion.div>

                <h1
                  className="text-[2.75rem] sm:text-[3.75rem] text-white mb-6"
                  style={{ fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}
                >
                  나무를 심고,
                  <br />
                  탄소를 계산하고,
                  <br />
                  <span className="bg-gradient-to-r from-[#52B788] to-[#95D5B2] bg-clip-text text-transparent">
                    인증을 받으세요.
                  </span>
                </h1>
                <p
                  className="text-[1.125rem] text-white/70 mb-10 max-w-lg"
                  style={{ lineHeight: 1.8 }}
                >
                  GROOT는 데이터 기반 수목 식재부터 탄소흡수량 인증까지
                  원스톱으로 제공하는 B2B 탄소 관리 플랫폼입니다.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/signup")}
                    className="group px-8 py-4 bg-[#52B788] text-white rounded-2xl hover:bg-[#40a578] transition-all shadow-xl shadow-[#52B788]/30 hover:shadow-[#52B788]/50 text-[1.05rem] flex items-center gap-2"
                    style={{ fontWeight: 600 }}
                  >
                    지금 시작하기
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("process");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all text-[1.05rem] flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    소개 보기
                  </button>
                </div>
              </motion.div>

              {/* Floating Stats Cards on right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="hidden lg:grid grid-cols-2 gap-4"
              >
                {[
                  {
                    icon: TreePine,
                    value: "34,520",
                    label: "등록 수목",
                    unit: "그루",
                    color: "#52B788",
                  },
                  {
                    icon: TrendingUp,
                    value: "182.4",
                    label: "탄소흡수량",
                    unit: "톤 CO₂",
                    color: "#40C9A2",
                  },
                  {
                    icon: Building2,
                    value: "248",
                    label: "파트너 기업",
                    unit: "개사",
                    color: "#3BB68E",
                  },
                  {
                    icon: Award,
                    value: "96.8",
                    label: "고객 만족도",
                    unit: "%",
                    color: "#2D9B73",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.15 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition-all cursor-default"
                  >
                    <stat.icon
                      className="w-6 h-6 mb-3"
                      style={{ color: stat.color }}
                    />
                    <div
                      className="text-white text-[1.75rem] mb-1"
                      style={{ fontWeight: 700 }}
                    >
                      {stat.value}
                      <span
                        className="text-[0.85rem] text-white/60 ml-1"
                        style={{ fontWeight: 400 }}
                      >
                        {stat.unit}
                      </span>
                    </div>
                    <p className="text-white/50 text-[0.85rem]">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section id="process" className="py-28 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#52B788]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FloatingCard className="text-center mb-20">
            <span
              className="inline-block px-4 py-1.5 bg-[#D8F3DC] text-[#2D6A4F] rounded-full text-[0.8rem] mb-5"
              style={{ fontWeight: 600 }}
            >
              HOW IT WORKS
            </span>
            <h2
              className="text-[2.25rem] sm:text-[2.75rem] text-[#1a1a1a] mb-4"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              간단한 3단계로 시작하세요
            </h2>
            <p
              className="text-gray-500 text-[1.1rem] max-w-2xl mx-auto"
              style={{ lineHeight: 1.7 }}
            >
              복잡한 탄소 관리, GROOT가 체계적으로 관리해 드립니다
            </p>
          </FloatingCard>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-[#52B788] via-[#40a578] to-[#2D6A4F]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: TreePine,
                  step: "01",
                  title: "수목 식재 신청",
                  desc: "AI가 지역 기후와 토양을 분석해 최적 수종 TOP 3를 추천합니다. 탄소흡수량 비교 차트로 최선의 선택을 하세요.",
                  image:
                    "https://images.unsplash.com/photo-1758599668429-121d54188b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwcGxhbnRpbmclMjB0cmVlcyUyMG5hdHVyZXxlbnwxfHx8fDE3NzM3OTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                },
                {
                  icon: Search,
                  step: "02",
                  title: "현장 답사 · 검증",
                  desc: "전문가가 식재 현장을 방문하여 수목 상태를 검증합니다. 실시간으로 탄소흡수량을 측정하고 기록합니다.",
                  image:
                    "https://images.unsplash.com/photo-1758343660101-10ee4fa1ca68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMGFlcmlhbCUyMGZvcmVzdCUyMHBsYW50YXRpb258ZW58MXx8fHwxNzczNzkzOTcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                },
                {
                  icon: Award,
                  step: "03",
                  title: "인증마크 발급",
                  desc: "검증된 탄소흡수량을 기반으로 4단계 인증등급을 산정하고 공식 인증마크와 ESG 보고서를 발급합니다.",
                  image:
                    "https://images.unsplash.com/photo-1695977722806-96e3fc746e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJib24lMjBuZXV0cmFsJTIwZ3JlZW4lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3Mzc5Mzk3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                },
              ].map((item, i) => (
                <FloatingCard key={item.step} delay={i * 0.15}>
                  <div className="group relative">
                    <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#52B788] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#2D6A4F]/20">
                      <span
                        className="text-white text-[0.85rem]"
                        style={{ fontWeight: 700 }}
                      >
                        {item.step}
                      </span>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                      <div className="h-48 overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-7">
                        <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mb-4">
                          <item.icon className="w-6 h-6 text-[#2D6A4F]" />
                        </div>
                        <h3
                          className="text-[1.3rem] text-[#1a1a1a] mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-gray-500 text-[0.95rem]"
                          style={{ lineHeight: 1.7 }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-28 bg-[#FAFBF9] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(82,183,136,0.06),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <FloatingCard className="text-center mb-20">
            <span
              className="inline-block px-4 py-1.5 bg-[#D8F3DC] text-[#2D6A4F] rounded-full text-[0.8rem] mb-5"
              style={{ fontWeight: 600 }}
            >
              FEATURES
            </span>
            <h2
              className="text-[2.25rem] sm:text-[2.75rem] text-[#1a1a1a] mb-4"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              강력한 기능들
            </h2>
            <p className="text-gray-500 text-[1.1rem] max-w-2xl mx-auto">
              탄소 관리에 필요한 모든 기능을 하나의 플랫폼에서 제공합니다
            </p>
          </FloatingCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FloatingCard key={feature.title} delay={i * 0.1}>
                <div className="group h-full bg-white rounded-3xl p-8 border border-gray-100 hover:border-[#52B788]/30 hover:shadow-xl hover:shadow-[#52B788]/5 transition-all duration-500 cursor-default">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    className="text-[1.2rem] text-[#1a1a1a] mb-3"
                    style={{ fontWeight: 700 }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-gray-500 text-[0.95rem]"
                    style={{ lineHeight: 1.7 }}
                  >
                    {feature.desc}
                  </p>
                  <div className="mt-5 flex items-center gap-1 text-[#2D6A4F] text-[0.9rem] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span style={{ fontWeight: 600 }}>자세히 보기</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats with Visual Impact */}
      <section className="py-28 bg-[#2D6A4F] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(82,183,136,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(45,106,79,0.5),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <FloatingCard className="text-center mb-16">
            <h2
              className="text-[2.25rem] sm:text-[2.75rem] text-white mb-4"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              숫자로 보는 GROOT
            </h2>
            <p className="text-white/60 text-[1.1rem]">
              실질적인 환경 변화를 만들어가고 있습니다
            </p>
          </FloatingCard>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "파트너 기업", value: 248, suffix: "+", icon: Building2, desc: "전국 주요 기업 참여" },
              { label: "등록 수목", value: 34520, suffix: "", icon: TreePine, desc: "전국 산림에 식재 완료" },
              { label: "탄소 흡수량", value: 182, suffix: "톤", icon: TrendingUp, desc: "연간 CO₂ 흡수량" },
              { label: "고객 만족도", value: 96, suffix: "%", icon: Star, desc: "재이용 의향 고객 비율" },
            ].map((stat, i) => (
              <FloatingCard key={stat.label} delay={i * 0.1}>
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-white/15 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-white/15 transition-colors">
                    <stat.icon className="w-7 h-7 text-[#95D5B2]" />
                  </div>
                  <div
                    className="text-[2.75rem] text-white mb-1"
                    style={{ fontWeight: 800 }}
                  >
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p
                    className="text-white/90 text-[1rem] mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    {stat.label}
                  </p>
                  <p className="text-white/40 text-[0.85rem]">{stat.desc}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Company Map Section */}
      <section id="map" className="py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FloatingCard className="text-center mb-16">
            <span
              className="inline-block px-4 py-1.5 bg-[#D8F3DC] text-[#2D6A4F] rounded-full text-[0.8rem] mb-5"
              style={{ fontWeight: 600 }}
            >
              PARTNER MAP
            </span>
            <h2
              className="text-[2.25rem] sm:text-[2.75rem] text-[#1a1a1a] mb-4"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              전국 참여 기업 현황
            </h2>
            <p
              className="text-gray-500 text-[1.1rem] max-w-2xl mx-auto"
              style={{ lineHeight: 1.7 }}
            >
              GROOT와 함께 탄소 흡수 프로젝트에 참여하고 있는 기업들의 위치를 확인하세요
            </p>
          </FloatingCard>

          <FloatingCard delay={0.2}>
            <KakaoMapCompanies height="520px" showList={false} />
          </FloatingCard>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FloatingCard className="text-center mb-16">
            <span
              className="inline-block px-4 py-1.5 bg-[#D8F3DC] text-[#2D6A4F] rounded-full text-[0.8rem] mb-5"
              style={{ fontWeight: 600 }}
            >
              TESTIMONIALS
            </span>
            <h2
              className="text-[2.25rem] sm:text-[2.75rem] text-[#1a1a1a] mb-4"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              고객 후기
            </h2>
            <p className="text-gray-500 text-[1.1rem]">
              GROOT와 함께 ESG 경영을 실천하는 기업들의 이야기
            </p>
          </FloatingCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <FloatingCard key={t.name} delay={i * 0.15}>
                <div className="h-full bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-[#52B788]/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4.5 h-4.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p
                    className="text-gray-700 text-[1rem] mb-8"
                    style={{ lineHeight: 1.8 }}
                  >
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#52B788] flex items-center justify-center text-white text-[0.8rem]"
                      style={{ fontWeight: 700 }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p
                        className="text-[0.95rem] text-[#1a1a1a]"
                        style={{ fontWeight: 600 }}
                      >
                        {t.name}
                      </p>
                      <p className="text-[0.8rem] text-gray-400">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Grade System */}
      <section id="pricing" className="py-28 bg-[#FAFBF9] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FloatingCard className="text-center mb-20">
            <span
              className="inline-block px-4 py-1.5 bg-[#D8F3DC] text-[#2D6A4F] rounded-full text-[0.8rem] mb-5"
              style={{ fontWeight: 600 }}
            >
              CERTIFICATION
            </span>
            <h2
              className="text-[2.25rem] sm:text-[2.75rem] text-[#1a1a1a] mb-4"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              인증 등급 시스템
            </h2>
            <p className="text-gray-500 text-[1.1rem] max-w-2xl mx-auto">
              수목 등록 수와 탄소흡수량에 따라 4단계 인증을 제공합니다
            </p>
          </FloatingCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "씨앗", emoji: "🌱", trees: "1 ~ 50그루", carbon: "500kg 미만", color: "#B7E4C7", bg: "from-[#B7E4C7]/20 to-[#D8F3DC]/30", borderColor: "border-[#B7E4C7]/40", features: ["기본 탄소 모니터링", "월간 리포트", "이메일 지원"] },
              { name: "새싹", emoji: "🌿", trees: "51 ~ 200그루", carbon: "500 ~ 2,000kg", color: "#95D5B2", bg: "from-[#95D5B2]/20 to-[#B7E4C7]/30", borderColor: "border-[#95D5B2]/40", features: ["실시간 모니터링", "주간 리포트", "전담 매니저"] },
              { name: "숲", emoji: "🌳", trees: "201 ~ 500그루", carbon: "2,000 ~ 5,000kg", color: "#52B788", bg: "from-[#52B788]/20 to-[#95D5B2]/30", borderColor: "border-[#52B788]/50", popular: true, features: ["AI 예측 분석", "ESG 보고서 자동생성", "전문가 답사 2회/년"] },
              { name: "산림", emoji: "🏔️", trees: "501그루 이상", carbon: "5,000kg 이상", color: "#2D6A4F", bg: "from-[#2D6A4F]/15 to-[#52B788]/20", borderColor: "border-[#2D6A4F]/40", features: ["무제한 분석 · 보고", "탄소 크레딧 거래 지원", "전문가 답사 무제한"] },
            ].map((badge, i) => (
              <FloatingCard key={badge.name} delay={i * 0.1}>
                <div className={`relative h-full bg-gradient-to-br ${badge.bg} rounded-3xl p-7 border ${badge.borderColor} hover:shadow-xl transition-all duration-500 group`}>
                  {badge.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#52B788] text-white text-[0.75rem] rounded-full shadow-md" style={{ fontWeight: 600 }}>
                      가장 인기
                    </div>
                  )}
                  <div className="text-center mb-6 pt-2">
                    <div className="text-[3.5rem] mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                      {badge.emoji}
                    </div>
                    <h3 className="text-[1.5rem] mb-1" style={{ fontWeight: 700, color: badge.color }}>
                      {badge.name}
                    </h3>
                    <p className="text-gray-500 text-[0.85rem]">{badge.trees}</p>
                    <p className="text-[0.85rem] mt-1" style={{ fontWeight: 600, color: badge.color }}>
                      {badge.carbon}
                    </p>
                  </div>
                  <div className="space-y-3 mb-6">
                    {badge.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4.5 h-4.5 shrink-0" style={{ color: badge.color }} />
                        <span className="text-gray-600 text-[0.9rem]">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full py-3 rounded-xl border-2 text-[0.95rem] transition-all hover:shadow-md"
                    style={{ fontWeight: 600, borderColor: badge.color, color: badge.color }}
                  >
                    시작하기
                  </button>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FloatingCard>
              <span className="inline-block px-4 py-1.5 bg-[#D8F3DC] text-[#2D6A4F] rounded-full text-[0.8rem] mb-5" style={{ fontWeight: 600 }}>
                DASHBOARD
              </span>
              <h2 className="text-[2.25rem] sm:text-[2.5rem] text-[#1a1a1a] mb-6" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                직관적인 대시보드로
                <br />
                <span className="text-[#2D6A4F]">한눈에 파악하세요</span>
              </h2>
              <p className="text-gray-500 text-[1.05rem] mb-8" style={{ lineHeight: 1.8 }}>
                실시간 탄소흡수량, 수목 현황, 인증 등급 등 핵심 지표를
                대시보드에서 한 번에 확인할 수 있습니다.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "실시간 데이터 업데이트" },
                  { icon: BarChart3, text: "인터랙티브 차트 시각화" },
                  { icon: Clock, text: "월별 · 연도별 추이 분석" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#2D6A4F]" />
                    </div>
                    <span className="text-gray-700 text-[1rem]" style={{ fontWeight: 500 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 bg-[#2D6A4F] text-white rounded-2xl hover:bg-[#235c43] transition-all shadow-lg shadow-[#2D6A4F]/20 text-[1rem]"
                style={{ fontWeight: 600 }}
              >
                대시보드 체험하기
                <ArrowRight className="w-5 h-5" />
              </button>
            </FloatingCard>

            <FloatingCard delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#52B788]/20 to-[#2D6A4F]/10 rounded-[2rem] blur-2xl" />
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="inline-block px-4 py-1 bg-white rounded-md text-[0.75rem] text-gray-400 border border-gray-200">
                        app.groot.kr/dashboard
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "총 수목", val: "1,247", change: "+12%" },
                        { label: "CO₂ 흡수", val: "8.2톤", change: "+23%" },
                        { label: "인증등급", val: "숲 🌳", change: "Lv.3" },
                      ].map((m) => (
                        <div key={m.label} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-[0.7rem] text-gray-400 mb-1">{m.label}</p>
                          <p className="text-[1.1rem] text-[#1a1a1a]" style={{ fontWeight: 700 }}>{m.val}</p>
                          <p className="text-[0.7rem] text-[#52B788]" style={{ fontWeight: 600 }}>{m.change}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-[0.8rem] text-gray-500 mb-3" style={{ fontWeight: 600 }}>
                        월별 탄소흡수량 추이
                      </p>
                      <div className="flex items-end gap-2 h-24">
                        {[40, 55, 45, 65, 80, 70, 90, 85, 95, 88, 100, 110].map((h, j) => (
                          <div
                            key={j}
                            className="flex-1 rounded-t-sm"
                            style={{
                              height: `${(h / 110) * 100}%`,
                              background: `linear-gradient(to top, #2D6A4F, #52B788)`,
                              opacity: 0.6 + (h / 110) * 0.4,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((m) => (
                          <span key={m} className="text-[0.6rem] text-gray-300 flex-1 text-center">
                            {m}월
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3d2e] via-[#2D6A4F] to-[#3d8b6b]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(82,183,136,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(45,106,79,0.3),transparent_50%)]" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/15 mb-8">
              <Sparkles className="w-4 h-4 text-[#95D5B2]" />
              <span className="text-white/90 text-[0.85rem]" style={{ fontWeight: 500 }}>
                30일 무료 체험 · 카드 등록 불필요
              </span>
            </div>
            <h2
              className="text-[2.5rem] sm:text-[3.25rem] text-white mb-6"
              style={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              지금 바로
              <br />
              <span className="bg-gradient-to-r from-[#95D5B2] to-[#52B788] bg-clip-text text-transparent">
                GROOT
              </span>
              을 시작하세요
            </h2>
            <p className="text-white/60 text-[1.15rem] mb-10 max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
              무료 가입 후 데이터 기반 탄소 관리 서비스를 경험해보세요.
              <br />
              설치 없이 바로 시작할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="group px-10 py-4 bg-white text-[#2D6A4F] rounded-2xl hover:bg-gray-50 transition-all shadow-xl text-[1.1rem] flex items-center gap-2"
                style={{ fontWeight: 700 }}
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-10 py-4 border-2 border-white/20 text-white rounded-2xl hover:bg-white/10 transition-all text-[1.1rem]"
                style={{ fontWeight: 500 }}
              >
                로그인
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#111111] text-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <GrootLogo size="sm" theme="light" />
              </div>
              <p className="text-[0.85rem]" style={{ lineHeight: 1.7 }}>
                데이터 기반 탄소 관리 플랫폼으로
                <br />
                지속 가능한 미래를 만들어갑니다.
              </p>
            </div>
            <div>
              <h4 className="text-white text-[0.85rem] mb-4" style={{ fontWeight: 600 }}>서비스</h4>
              <div className="space-y-2.5 text-[0.85rem]">
                <p className="hover:text-white/80 cursor-pointer transition-colors">수목 추천</p>
                <p className="hover:text-white/80 cursor-pointer transition-colors">탄소 모니터링</p>
                <p className="hover:text-white/80 cursor-pointer transition-colors">인증마크</p>
                <p className="hover:text-white/80 cursor-pointer transition-colors">ESG 보고서</p>
              </div>
            </div>
            <div>
              <h4 className="text-white text-[0.85rem] mb-4" style={{ fontWeight: 600 }}>회사</h4>
              <div className="space-y-2.5 text-[0.85rem]">
                <p className="hover:text-white/80 cursor-pointer transition-colors">소개</p>
                <p className="hover:text-white/80 cursor-pointer transition-colors">블로그</p>
                <p className="hover:text-white/80 cursor-pointer transition-colors">채용</p>
                <p className="hover:text-white/80 cursor-pointer transition-colors">문의하기</p>
              </div>
            </div>
            <div>
              <h4 className="text-white text-[0.85rem] mb-4" style={{ fontWeight: 600 }}>법적 고지</h4>
              <div className="space-y-2.5 text-[0.85rem]">
                <p className="hover:text-white/80 cursor-pointer transition-colors">이용약관</p>
                <p className="hover:text-white/80 cursor-pointer transition-colors">개인정보처리방침</p>
                <p className="hover:text-white/80 cursor-pointer transition-colors">쿠키 정책</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[0.8rem]">© 2026 GROOT. 김성은, 이태형, 이한승, 임도경</p>
            <p className="text-[0.8rem]">Made with 💚 for a greener future</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
