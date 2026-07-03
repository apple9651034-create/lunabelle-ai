/* AI 루나 — HomePage
 * Design: Mystic Dark Luxury — deep navy bg, purple/gold accents, serif headers
 */
import React from 'react';
import { useLocation } from 'wouter';
import { MessageCircle, Wand2, Calendar, ShoppingBag, Heart, Sparkles, Star } from 'lucide-react';
import DailyFortuneWidget from '@/components/DailyFortuneWidget';

export default function HomePage() {
  const [, navigate] = useLocation();

  const services = [
    {
      path: '/chat',
      icon: MessageCircle,
      title: 'AI 루나 채팅',
      emoji: '🌙',
      description: '실시간으로 AI 루나와 대화하며 당신의 운명을 알아보세요',
      gradient: 'from-purple-600 to-violet-700',
      glow: 'oklch(0.55 0.25 290 / 25%)',
    },
    {
      path: '/yuk',
      icon: Wand2,
      title: '육효 점술',
      emoji: '☯️',
      description: '변화의 흐름을 육효로 분석하고 깊은 조언을 얻어보세요',
      gradient: 'from-blue-600 to-indigo-700',
      glow: 'oklch(0.50 0.22 250 / 25%)',
    },
    {
      path: '/saju',
      icon: Calendar,
      title: '사주 분석',
      emoji: '🔮',
      description: '생년월일로 당신의 운명과 타고난 성격을 분석해보세요',
      gradient: 'from-indigo-600 to-purple-700',
      glow: 'oklch(0.48 0.22 270 / 25%)',
    },
    {
      path: '/shop',
      icon: ShoppingBag,
      title: '부적 상점',
      emoji: '🏮',
      description: '영적 보호와 행운을 위한 전통 한국 부적을 만나보세요',
      gradient: 'from-amber-600 to-orange-600',
      glow: 'oklch(0.70 0.18 60 / 25%)',
    },
    {
      path: '/wishes',
      icon: Heart,
      title: '소원 게시판',
      emoji: '💫',
      description: '다른 사용자들과 소원을 공유하고 서로 응원해보세요',
      gradient: 'from-pink-600 to-rose-600',
      glow: 'oklch(0.60 0.22 0 / 25%)',
    },
  ];

  const features = [
    { icon: '✨', title: '정확한 해석', desc: '전통 지식과 현대적 관점의 결합' },
    { icon: '🎯', title: '맞춤형 상담', desc: '당신의 상황에 맞는 개인화된 조언' },
    { icon: '📊', title: '상담 기록', desc: '모든 상담 내역을 저장하고 분석' },
    { icon: '🌟', title: '커뮤니티', desc: '다른 사용자들과 경험 공유' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>

      {/* Hero Header */}
      <div
        className="relative px-6 pt-10 pb-8 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.12 0.04 270) 100%)',
        }}
      >
        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {['top-4 right-8', 'top-12 right-20', 'top-6 right-32', 'top-16 right-12'].map((pos, i) => (
            <Star
              key={i}
              size={i % 2 === 0 ? 8 : 5}
              className={`absolute ${pos} luna-shimmer`}
              style={{
                color: 'oklch(0.78 0.15 85)',
                animationDelay: `${i * 0.5}s`,
                fill: 'currentColor',
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌙</span>
            <h1
              className="text-3xl font-bold"
              style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}
            >
              AI 루나
            </h1>
          </div>
          <p style={{ color: 'oklch(0.78 0.15 85)' }} className="text-sm font-medium tracking-wide">
            당신의 운명이 속삭입니다
          </p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">

        {/* Welcome Card */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: 'oklch(0.17 0.04 270)',
            borderColor: 'oklch(0.78 0.15 85 / 30%)',
            boxShadow: '0 0 30px oklch(0.55 0.25 290 / 10%)',
          }}
        >
          <div className="flex items-start gap-3">
            <Sparkles size={20} style={{ color: 'oklch(0.78 0.15 85)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h2
                className="text-base font-bold mb-1"
                style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}
              >
                안녕하세요
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.70 0.02 290)' }}>
                AI 루나는 타로, 사주, 육효를 통해 당신의 운명을 예측해주는 신비로운 앱입니다.
                아래 서비스를 통해 당신의 미래를 알아보세요.
              </p>
            </div>
          </div>
        </div>
        {/* Daily Fortune Widget */}
        <DailyFortuneWidget />

        {/* Services */}
        <div>
          <h3
            className="text-sm font-semibold mb-3 tracking-widest uppercase"
            style={{ color: 'oklch(0.78 0.15 85)' }}
          >
            서비스
          </h3>
          <div className="space-y-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.path}
                  onClick={() => navigate(service.path)}
                  className="w-full rounded-2xl p-4 text-left transition-all duration-150 border group"
                  style={{
                    background: 'oklch(0.17 0.04 270)',
                    borderColor: 'oklch(1 0 0 / 8%)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${service.glow}`;
                    (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.78 0.15 85 / 20%)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.borderColor = 'oklch(1 0 0 / 8%)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.gradient} flex-shrink-0`}
                    >
                      <span className="text-xl">{service.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-sm mb-0.5"
                        style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}
                      >
                        {service.title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.60 0.02 290)' }}>
                        {service.description}
                      </p>
                    </div>
                    <span style={{ color: 'oklch(0.55 0.15 290)' }} className="text-lg flex-shrink-0">›</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: 'oklch(0.17 0.04 270)',
            borderColor: 'oklch(1 0 0 / 8%)',
          }}
        >
          <h3
            className="text-sm font-semibold mb-4 tracking-widest uppercase"
            style={{ color: 'oklch(0.78 0.15 85)' }}
          >
            AI 루나의 특징
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>{f.title}</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'oklch(0.60 0.02 290)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/chat')}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-150 active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
            color: 'oklch(0.97 0.005 90)',
            boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
            fontFamily: "'Noto Serif KR', serif",
          }}
        >
          🌙 루나에게 물어보세요
        </button>

      </div>
    </div>
  );
}
