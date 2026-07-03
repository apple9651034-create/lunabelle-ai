import React, { useState, useEffect } from 'react';
import { fortuneTips } from '@/lib/fortuneTips';

interface ChatLoadingWithTipsProps {
  category?: 'saju' | 'tarot' | 'yuk';
}

export default function ChatLoadingWithTips({ category = 'saju' }: ChatLoadingWithTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // 카테고리별 팁 선택
  const tips = fortuneTips
    .filter((tip) => tip.category === category || (category === 'yuk' && tip.category === 'saju'))
    .map((tip) => tip.content);

  // 팁 변경 (5초마다)
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, [tips.length]);

  // 진행 바 애니메이션
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 space-y-6">
      {/* 신비로운 오브 애니메이션 */}
      <div className="relative w-24 h-24">
        {/* 외부 회전 링 */}
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: 'oklch(0.55 0.25 290 / 30%)',
            animation: 'spin 4s linear infinite',
          }}
        />

        {/* 중간 회전 링 */}
        <div
          className="absolute inset-2 rounded-full border-2"
          style={{
            borderColor: 'oklch(0.78 0.15 85 / 40%)',
            animation: 'spin 3s linear reverse',
          }}
        />

        {/* 중앙 빛나는 구 */}
        <div
          className="absolute inset-6 rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.78 0.15 85 / 60%), oklch(0.55 0.25 290 / 20%))',
            boxShadow: '0 0 30px oklch(0.78 0.15 85 / 50%), 0 0 60px oklch(0.55 0.25 290 / 30%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />

        {/* 파티클 효과 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: 'oklch(0.78 0.15 85)',
              top: '50%',
              left: '50%',
              animation: `float-particle 3s ease-in-out infinite`,
              animationDelay: `${(i * 3) / 8}s`,
              transform: `rotate(${(i * 360) / 8}deg) translateY(-40px)`,
              boxShadow: '0 0 10px oklch(0.78 0.15 85 / 60%)',
            }}
          />
        ))}
      </div>

      {/* 팁 표시 */}
      <div className="max-w-md text-center">
        <p
          className="text-sm italic transition-opacity duration-500"
          style={{ color: 'oklch(0.70 0.02 290)' }}
        >
          💡 {tips[currentTipIndex]}
        </p>
      </div>

      {/* 진행 바 */}
      <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.05 270)' }}>
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, oklch(0.78 0.15 85), oklch(0.55 0.25 290))',
            boxShadow: '0 0 10px oklch(0.78 0.15 85 / 50%)',
          }}
        />
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
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes float-particle {
          0% {
            opacity: 0;
            transform: rotate(0deg) translateY(-40px) scale(1);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(360deg) translateY(-80px) scale(0);
          }
        }
      `}</style>
    </div>
  );
}
