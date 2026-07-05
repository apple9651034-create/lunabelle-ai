/* AI 루나 — HomePage.tsx
 * Design: Mystic Dark Luxury — dark theme default
 * 메인 페이지: 오늘의 운세, 사주 명식, 서비스 카드
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Edit2, ChevronDown } from 'lucide-react';
import DailyFortuneWidget from '@/components/DailyFortuneWidget';
import { getUserSajuProfile } from '@/lib/userSajuProfile';
import ProfileSelector from '@/components/ProfileSelector';
import { migrateOldProfile, getAllProfiles, getActiveProfile, setActiveProfile } from '@/lib/profileManager';

interface SajuProfile {
  year: string;
  month: string;
  day: string;
  hour: string;
  gender: string;
  fourPillars?: {
    yearString: string;
    monthString: string;
    dayString: string;
    hourString: string;
  };
  personality?: string;
  luck?: string;
}

const PILLAR_MEANINGS: Record<string, Record<string, string>> = {
  yearString: {
    '갑': '갑목(甲木) - 큰 나무, 리더십과 진취성',
    '을': '을목(乙木) - 작은 나무, 섬세함과 예술성',
    '병': '병화(丙火) - 태양의 불, 열정과 활발함',
    '정': '정화(丁火) - 촛불의 불, 따뜻함과 섬세함',
    '무': '무토(戊土) - 산의 흙, 안정성과 신뢰',
    '기': '기토(己土) - 밭의 흙, 배려심과 세심함',
    '경': '경금(庚金) - 광산의 금속, 결단력과 정의감',
    '신': '신금(辛金) - 보석의 금속, 정교함과 우아함',
    '임': '임수(壬水) - 강의 물, 지혜와 유연성',
    '계': '계수(癸水) - 이슬의 물, 감정과 직관',
  },
  monthString: {
    '갑': '갑목 - 봄의 시작, 새로운 기운',
    '을': '을목 - 봄의 성장, 발전의 기운',
    '병': '병화 - 여름의 활력, 번성의 기운',
    '정': '정화 - 여름의 온화, 조화의 기운',
    '무': '무토 - 계절의 전환, 변화의 기운',
    '기': '기토 - 계절의 전환, 안정의 기운',
    '경': '경금 - 가을의 수확, 결실의 기운',
    '신': '신금 - 가을의 정교, 정제의 기운',
    '임': '임수 - 겨울의 흐름, 저장의 기운',
    '계': '계수 - 겨울의 고요, 휴식의 기운',
  },
  dayString: {
    '갑': '갑일생 - 주도적이고 창의적인 성격',
    '을': '을일생 - 섬세하고 감정이 풍부한 성격',
    '병': '병일생 - 활발하고 표현력 좋은 성격',
    '정': '정일생 - 따뜻하고 직관적인 성격',
    '무': '무일생 - 안정적이고 신뢰할 수 있는 성격',
    '기': '기일생 - 배려심 많고 세심한 성격',
    '경': '경일생 - 결단력 있고 원칙적인 성격',
    '신': '신일생 - 정교하고 우아한 성격',
    '임': '임일생 - 지혜롭고 유연한 성격',
    '계': '계일생 - 감정 풍부하고 직관적인 성격',
  },
  hourString: {
    '갑': '갑시생 - 아침의 새로운 기운',
    '을': '을시생 - 이른 아침의 부드러운 기운',
    '병': '병시생 - 오전의 활발한 기운',
    '정': '정시생 - 오전의 따뜻한 기운',
    '무': '무시생 - 정오의 안정적인 기운',
    '기': '기시생 - 정오의 배려로운 기운',
    '경': '경시생 - 오후의 결단적인 기운',
    '신': '신시생 - 오후의 정교한 기운',
    '임': '임시생 - 저녁의 지혜로운 기운',
    '계': '계시생 - 밤의 신비로운 기운',
  },
};

export default function HomePage() {
  const [, navigate] = useLocation();
  const [sajuProfile, setSajuProfile] = useState<SajuProfile | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<{ type: keyof typeof PILLAR_MEANINGS; char: string } | null>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);

  useEffect(() => {
    // 기본 사주 프로필 자동 로드 (없으면 기본값으로 설정)
    const profile = getUserSajuProfile();
    setSajuProfile({
      year: String(profile.year),
      month: String(profile.month),
      day: String(profile.day),
      hour: `오전 ${profile.hour}시 ${profile.minute}분`,
      gender: profile.gender,
      fourPillars: profile.fourPillars,
      personality: profile.personality,
      luck: profile.luck,
    });
  }, []);

  const pillarLabels = { yearString: '년주', monthString: '월주', dayString: '일주', hourString: '시주' };
  const handleProfileChange = (profileId: string) => {
    setActiveProfileId(profileId);
    setActiveProfile(profileId);
    setShowProfileDropdown(false);
    
    // 프로필 변경 후 페이지 새로고침
    window.location.reload();
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* 별 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `oklch(0.78 0.15 85 / ${Math.random() * 0.5 + 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 헤더 */}
      <div className="px-5 py-6 border-b relative z-10" style={{ background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)', borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌙</span>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>AI 루나</h1>
              <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>당신의 운명을 예측하는 신비로운 경험</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/charge')}
            className="px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, oklch(0.78 0.15 85), oklch(0.70 0.20 290))',
              color: 'oklch(0.12 0.03 270)',
            }}
          >
            ⭐ 충전별 구매
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-5 space-y-6 relative z-10">
        {/* 사주 명식 - 헤더 바로 아래 + 드롭다운 */}
        {sajuProfile && (
          <div className="space-y-3">
            {/* 프로필 드롭다운 */}
            {allProfiles.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-full px-4 py-3 rounded-lg border flex items-center justify-between transition-all hover:bg-white/5"
                  style={{
                    background: 'oklch(0.18 0.08 290)',
                    borderColor: 'oklch(0.70 0.18 60 / 50%)',
                  }}
                >
                  <span style={{ color: 'oklch(0.94 0.015 90)' }} className="font-semibold">
                    👤 프로필 선택
                  </span>
                  <ChevronDown size={20} style={{ color: 'oklch(0.70 0.18 60)', transform: showProfileDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border z-50 overflow-hidden" style={{
                    background: 'oklch(0.18 0.08 290)',
                    borderColor: 'oklch(0.70 0.18 60 / 50%)',
                  }}>
                    {allProfiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleProfileChange(profile.id)}
                        className="w-full px-4 py-3 text-left border-b last:border-b-0 transition-colors hover:bg-white/10"
                        style={{
                          borderColor: 'oklch(0.70 0.18 60 / 20%)',
                          color: activeProfileId === profile.id ? 'oklch(0.70 0.18 60)' : 'oklch(0.78 0.15 85)',
                          background: activeProfileId === profile.id ? 'oklch(0.25 0.10 290)' : 'transparent',
                        }}
                      >
                        <div className="font-semibold">{profile.name}</div>
                        <div className="text-xs" style={{ color: 'oklch(0.60 0.02 290)' }}>
                          {profile.year}년 {profile.month}월 {profile.day}일
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="px-5 py-4 rounded-xl border flex items-center justify-between" style={{
              background: 'oklch(0.18 0.08 290)',
              borderColor: 'oklch(0.78 0.15 85 / 30%)',
              boxShadow: '0 0 20px oklch(0.55 0.25 290 / 10%)',
            }}>
              <div className="flex-1">
                <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs mb-2 font-semibold">📍 사주 명식</p>
              <div className="flex gap-2 text-base font-bold" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {sajuProfile.fourPillars && [
                  sajuProfile.fourPillars.yearString,
                  sajuProfile.fourPillars.monthString,
                  sajuProfile.fourPillars.dayString,
                  sajuProfile.fourPillars.hourString,
                ].map((char, idx) => (
                  <span key={idx} className="px-3 py-2 rounded-lg" style={{
                    background: 'oklch(0.30 0.10 290)',
                    color: 'oklch(0.94 0.015 90)',
                    border: '1px solid oklch(0.78 0.15 85 / 20%)',
                  }}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => navigate('/saju')}
                className="p-2 rounded-lg transition-all hover:opacity-80"
                style={{
                  background: 'oklch(0.50 0.28 290)',
                  color: 'oklch(1 0 0)',
                }}
                title="사주 수정"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => setIsProfileSelectorOpen(true)}
                className="p-2 rounded-lg transition-all hover:opacity-80"
                style={{
                  background: 'oklch(0.50 0.28 290)',
                  color: 'oklch(1 0 0)',
                }}
                title="프로필 추가"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>
          </div>
        )}

        {/* 환영 메시지 */}
        <div className="p-6 rounded-2xl border" style={{
          background: 'oklch(0.17 0.04 270)',
          border: '1px solid oklch(1 0 0 / 10%)',
          boxShadow: '0 0 30px oklch(0.55 0.25 290 / 15%)',
        }}>
          <div className="flex items-start gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <h2 className="text-lg font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>환영합니다</h2>
              <p style={{ color: 'oklch(0.70 0.02 290)' }} className="text-sm leading-relaxed">
                AI 루나는 타로, 사주, 육효를 통해 당신의 운명을 예측하는 신비로운 경험입니다. 아래 서비스를 통해 당신의 미래를 알아보고, 직적 선택을 하세요.
              </p>
            </div>
          </div>
        </div>



        {/* 오늘의 운세 */}
        <DailyFortuneWidget />

        {/* 크레딧 충전소 - 중앙 */}
        <div className="p-6 rounded-2xl border relative overflow-hidden" style={{
          background: 'oklch(0.18 0.08 290)',
          borderColor: 'oklch(0.78 0.15 85 / 30%)',
          boxShadow: '0 0 30px oklch(0.55 0.25 290 / 15%)',
        }}>
          {/* 반짝이는 배경 효과 */}
          <div className="absolute inset-0 opacity-30" style={{
            background: 'linear-gradient(45deg, transparent 30%, oklch(0.55 0.25 290 / 20%) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s infinite',
          }} />
          
          <div className="relative z-10">
            <h3 className="text-sm font-semibold mb-4 tracking-widest uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              💳 크레딧 충전 ✨ (20% 추가 이벤트)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { price: '10,000원', bonus: '12,000원' },
                { price: '30,000원', bonus: '36,000원' },
                { price: '50,000원', bonus: '60,000원' },
                { price: '100,000원', bonus: '120,000원' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className="p-4 rounded-lg text-xs font-semibold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                    color: 'oklch(1 0 0)',
                  }}
                >
                  <div className="font-bold">{item.price}</div>
                  <div style={{ color: 'oklch(0.94 0.015 90)' }}>→ {item.bonus}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 서비스 카드 */}
        <div>
          <h3 className="text-sm font-semibold mb-3 tracking-widest uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>✨ 서비스</h3>
          <div className="space-y-3">
            {[
              { icon: '🌙', title: 'AI 루나 운세 상담', desc: '당신의 사주를 기반으로 실시간 운세 상담을 받으세요', path: '/saju-consultation' },
              { icon: '🎴', title: '육효 상담', desc: '변화하는 운명의 흐름을 육효로 읽어보세요', path: '/yuk-consultation' },
              { icon: '🔮', title: '사주 분석', desc: '생년월일시로 당신의 사주를 분석합니다', path: '/saju' },
              { icon: '🃏', title: '타로 상담', desc: '타로 카드로 당신의 미래를 예측해보세요', path: '/tarot-consultation' },
              { icon: '📅', title: '월간 운세', desc: '이달의 길일과 흉일을 확인하세요', path: '/calendar' },
            ].map((service, idx) => (
              <button
                key={idx}
                onClick={() => navigate(service.path)}
                className="w-full p-4 rounded-xl text-left transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'oklch(0.20 0.05 270)',
                  border: '1px solid oklch(1 0 0 / 10%)',
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <h4 className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>{service.title}</h4>
                    <p className="text-xs mt-1" style={{ color: 'oklch(0.70 0.02 290)' }}>{service.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ProfileSelector
        isOpen={isProfileSelectorOpen}
        onClose={() => setIsProfileSelectorOpen(false)}
        onProfileChange={(profile) => {
          setSajuProfile(profile);
          setIsProfileSelectorOpen(false);
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
