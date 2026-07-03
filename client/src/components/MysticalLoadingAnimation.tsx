/* AI 루나 — MysticalLoadingAnimation.tsx
 * Design: Mystic Dark Luxury
 * 신비로운 분위기의 로딩 애니메이션 + 진행 상태 메시지
 */
import React, { useState, useEffect } from 'react';

interface MysticalLoadingAnimationProps {
  isLoading: boolean;
  stage?: 'analyzing' | 'divining' | 'interpreting' | 'completing';
}

const LOADING_MESSAGES = {
  analyzing: [
    '✨ 당신의 운명을 읽고 있습니다...',
    '🔮 우주의 에너지를 감지 중...',
    '⭐ 별들의 메시지를 해석 중...',
    '🌙 신비한 기운을 모으는 중...',
  ],
  divining: [
    '🃏 타로 카드를 섞고 있습니다...',
    '✨ 신성한 기운이 흐르고 있습니다...',
    '🔮 미래의 길을 찾고 있습니다...',
    '⭐ 운명의 실을 따라가는 중...',
  ],
  interpreting: [
    '📖 육효의 의미를 풀고 있습니다...',
    '✨ 고대의 지혜를 깨우는 중...',
    '🔮 변화의 흐름을 읽고 있습니다...',
    '⭐ 자연의 이치를 해석 중...',
  ],
  completing: [
    '💫 결과를 정리하고 있습니다...',
    '✨ 최종 메시지를 전달 준비 중...',
    '🌟 당신을 위한 조언을 마무리하는 중...',
    '⭐ 거의 다 되었습니다...',
  ],
};

export default function MysticalLoadingAnimation({ isLoading, stage = 'analyzing' }: MysticalLoadingAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES[stage].length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [isLoading, stage]);

  useEffect(() => {
    if (!isLoading) return;

    const particleInterval = setInterval(() => {
      setParticleCount((prev) => (prev + 1) % 12);
    }, 100);

    return () => clearInterval(particleInterval);
  }, [isLoading]);

  if (!isLoading) return null;

  const currentMessage = LOADING_MESSAGES[stage][messageIndex];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Mystical Orb Animation */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Outer Ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid oklch(0.78 0.15 85 / 30%)',
              animation: 'spin 8s linear infinite',
            }}
          />

          {/* Middle Ring */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              border: '2px solid oklch(0.55 0.25 290 / 40%)',
              animation: 'spin 6s linear reverse infinite',
            }}
          />

          {/* Inner Ring */}
          <div
            className="absolute inset-4 rounded-full"
            style={{
              border: '2px solid oklch(0.78 0.15 85 / 50%)',
              animation: 'spin 4s linear infinite',
            }}
          />

          {/* Core Glow */}
          <div
            className="absolute inset-6 rounded-full"
            style={{
              background: 'radial-gradient(circle, oklch(0.78 0.15 85 / 60%), oklch(0.55 0.25 290 / 20%))',
              boxShadow: '0 0 40px oklch(0.78 0.15 85 / 50%), 0 0 80px oklch(0.55 0.25 290 / 30%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />

          {/* Particles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360 + particleCount * 30;
            const x = Math.cos((angle * Math.PI) / 180) * 60;
            const y = Math.sin((angle * Math.PI) / 180) * 60;

            return (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: 'oklch(0.78 0.15 85)',
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  opacity: 0.6 + Math.sin(particleCount * 0.5 + i) * 0.4,
                  boxShadow: '0 0 10px oklch(0.78 0.15 85 / 80%)',
                }}
              />
            );
          })}
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <p
            className="text-lg font-semibold transition-all duration-500"
            style={{
              color: 'oklch(0.78 0.15 85)',
              fontFamily: "'Noto Serif KR', serif",
              opacity: 0.8 + Math.sin(Date.now() / 500) * 0.2,
            }}
          >
            {currentMessage}
          </p>

          {/* Progress Bar */}
          <div
            className="w-48 h-1 rounded-full mx-auto overflow-hidden"
            style={{
              background: 'oklch(0.20 0.05 270)',
              border: '1px solid oklch(0.78 0.15 85 / 30%)',
            }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                background: 'linear-gradient(90deg, oklch(0.78 0.15 85), oklch(0.55 0.25 290))',
                width: `${((messageIndex + 1) / LOADING_MESSAGES[stage].length) * 100}%`,
                boxShadow: '0 0 10px oklch(0.78 0.15 85 / 60%)',
              }}
            />
          </div>
        </div>

        {/* Stage Indicator */}
        <div className="flex items-center justify-center gap-2">
          {['analyzing', 'divining', 'interpreting', 'completing'].map((s) => (
            <div
              key={s}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: stage === s ? 'oklch(0.78 0.15 85)' : 'oklch(0.78 0.15 85 / 20%)',
                boxShadow: stage === s ? '0 0 10px oklch(0.78 0.15 85 / 60%)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
