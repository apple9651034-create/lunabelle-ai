/* AI 루나 — HomePage.tsx
 * Design: Holographic Mystique - 신비로운 홀로그래픽 스타일
 * 사용자를 매료시키는 인터랙티브 요소와 시각적 깊이
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { MessageCircle, Wand2, Calendar, ShoppingBag, Heart, Sparkles, Star, ChevronRight, Moon } from 'lucide-react';
import DailyFortuneWidget from '@/components/DailyFortuneWidget';

export default function HomePage() {
  const [, navigate] = useLocation();
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const services = [
    {
      path: '/chat',
      icon: MessageCircle,
      title: 'AI 루나 채팅',
      emoji: '🌙',
      description: '실시간으로 AI 루나와 대화하며 당신의 운명을 알아보세요',
      gradient: 'from-purple-600 to-violet-700',
      glow: 'oklch(0.55 0.25 290 / 25%)',
      accent: 'oklch(0.55 0.25 290)',
    },
    {
      path: '/yuk',
      icon: Wand2,
      title: '육효 점술',
      emoji: '☯️',
      description: '변화의 흐름을 육효로 분석하고 깊은 조언을 얻어보세요',
      gradient: 'from-blue-600 to-indigo-700',
      glow: 'oklch(0.50 0.22 250 / 25%)',
      accent: 'oklch(0.50 0.22 250)',
    },
    {
      path: '/saju',
      icon: Calendar,
      title: '사주 분석',
      emoji: '🔮',
      description: '생년월일로 당신의 운명과 타고난 성격을 분석해보세요',
      gradient: 'from-indigo-600 to-purple-700',
      glow: 'oklch(0.48 0.22 270 / 25%)',
      accent: 'oklch(0.48 0.22 270)',
    },
    {
      path: '/shop',
      icon: ShoppingBag,
      title: '부적 상점',
      emoji: '🏮',
      description: '영적 보호와 행운을 위한 전통 한국 부적을 만나보세요',
      gradient: 'from-amber-600 to-orange-600',
      glow: 'oklch(0.70 0.18 60 / 25%)',
      accent: 'oklch(0.70 0.18 60)',
    },
    {
      path: '/wishes',
      icon: Heart,
      title: '소원 게시판',
      emoji: '💫',
      description: '다른 사용자들과 소원을 공유하고 서로 응원해보세요',
      gradient: 'from-pink-600 to-rose-600',
      glow: 'oklch(0.60 0.22 0 / 25%)',
      accent: 'oklch(0.60 0.22 0)',
    },
    {
      path: '/calendar',
      icon: Calendar,
      title: '월간 운세',
      emoji: '📅',
      description: '월별 길일과 흉일을 한눈에 보고 최적의 날짜를 선택하세요',
      gradient: 'from-teal-600 to-cyan-600',
      glow: 'oklch(0.55 0.20 180 / 25%)',
      accent: 'oklch(0.55 0.20 180)',
    },
  ];

  const features = [
    { icon: '✨', title: '정확한 해석', desc: '전통 지식과 현대적 관점의 결합' },
    { icon: '🎯', title: '맞춤형 상담', desc: '당신의 상황에 맞는 개인화된 조언' },
    { icon: '📊', title: '상담 기록', desc: '모든 상담 내역을 저장하고 분석' },
    { icon: '🌟', title: '커뮤니티', desc: '다른 사용자들과 경험 공유' },
  ];

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'oklch(0.10 0.02 270)' }}>
      {/* Animated background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, oklch(0.50 0.25 290 / 10%) 0%, transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.45 0.20 310 / 10%) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
        }} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative px-6 pt-12 pb-16">
          {/* Floating stars */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px',
                  background: 'oklch(0.78 0.15 85)',
                  borderRadius: '50%',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 30 + '%',
                  opacity: Math.random() * 0.5 + 0.3,
                  animationDuration: (Math.random() * 3 + 2) + 's',
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Moon size={32} style={{ color: 'oklch(0.78 0.15 85)' }} />
                <h1 className="text-4xl font-bold" style={{ color: 'oklch(0.97 0.005 90)', fontFamily: "'Noto Serif KR', serif" }}>
                  AI 루나
                </h1>
              </div>
              <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>당신의 운명을 예측하는 신비로운 경험</p>
            </div>
            <div className="px-4 py-2 rounded-full" style={{ background: 'oklch(0.50 0.28 290)', color: 'oklch(1 0 0)' }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <div>
                  <div className="text-xs font-semibold">남은 충전별</div>
                  <div className="text-sm font-bold">5개</div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome message */}
          <div className="mb-12 p-6 rounded-2xl border" style={{
            background: 'oklch(0.15 0.05 270)',
            borderColor: 'oklch(0.78 0.15 85 / 20%)',
            boxShadow: '0 0 30px oklch(0.55 0.25 290 / 10%)',
          }}>
            <div className="flex gap-4">
              <Sparkles size={24} style={{ color: 'oklch(0.78 0.15 85)', flexShrink: 0 }} />
              <div>
                <h2 className="text-lg font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
                  환영합니다
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.70 0.02 290)' }}>
                  AI 루나는 타로, 사주, 육효를 통해 당신의 운명을 예측해주는 신비로운 앱입니다.
                  아래 서비스를 통해 당신의 미래를 알아보고, 최적의 선택을 하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Fortune Widget */}
        <div className="px-6 mb-12">
          <DailyFortuneWidget />
        </div>

        {/* Services Grid */}
        <div className="px-6 mb-12">
          <h3 className="text-sm font-semibold mb-6 tracking-widest uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
            ✨ 서비스
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              const isHovered = hoveredService === service.path;
              return (
                <button
                  key={service.path}
                  onClick={() => navigate(service.path)}
                  onMouseEnter={() => setHoveredService(service.path)}
                  onMouseLeave={() => setHoveredService(null)}
                  className="relative rounded-2xl p-5 text-left transition-all duration-300 border group overflow-hidden"
                  style={{
                    background: isHovered ? 'oklch(0.20 0.06 270)' : 'oklch(0.15 0.04 270)',
                    borderColor: isHovered ? service.accent + ' / 40%' : 'oklch(1 0 0 / 8%)',
                    boxShadow: isHovered ? `0 0 30px ${service.glow}` : 'none',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  {/* Holographic effect */}
                  {isHovered && (
                    <div className="absolute inset-0 opacity-20" style={{
                      background: `linear-gradient(45deg, ${service.accent}, transparent)`,
                    }} />
                  )}

                  <div className="relative flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${service.accent}, ${service.accent}dd)`,
                        boxShadow: isHovered ? `0 0 20px ${service.glow}` : 'none',
                      }}
                    >
                      <span className="text-2xl">{service.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm mb-1" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
                        {service.title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.60 0.02 290)' }}>
                        {service.description}
                      </p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="flex-shrink-0 transition-all duration-300"
                      style={{
                        color: service.accent,
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 mb-12">
          <h3 className="text-sm font-semibold mb-6 tracking-widest uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
            🌟 AI 루나의 특징
          </h3>
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: 'oklch(0.15 0.05 270)',
              borderColor: 'oklch(1 0 0 / 8%)',
              boxShadow: '0 0 20px oklch(0.55 0.25 290 / 5%)',
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-lg" style={{ background: 'oklch(0.12 0.03 270)' }}>
                  <span className="text-2xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>{f.title}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'oklch(0.60 0.02 290)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 pb-12">
          <button
            onClick={() => navigate('/chat')}
            className="w-full py-5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, oklch(0.55 0.28 290), oklch(0.50 0.25 310))',
              color: 'oklch(0.97 0.005 90)',
              boxShadow: '0 8px 30px oklch(0.55 0.25 290 / 40%)',
              fontFamily: "'Noto Serif KR', serif",
            }}
          >
            <Moon size={20} />
            루나에게 지금 물어보기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .luna-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
