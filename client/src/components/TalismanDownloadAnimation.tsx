/**
 * 부적 다운로드 신비로운 애니메이션
 * 빛이 퍼지는 신비로운 효과
 */
import React, { useEffect } from 'react';

interface TalismanDownloadAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function TalismanDownloadAnimation({
  isVisible,
  onComplete,
}: TalismanDownloadAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* 배경 어두워짐 */}
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'radial-gradient(circle at center, oklch(0.70 0.18 60 / 40%) 0%, transparent 70%)',
          animation: 'fadeInOut 2s ease-in-out forwards',
        }}
      />

      {/* 중심 빛 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, oklch(0.78 0.15 85) 0%, oklch(0.70 0.18 60) 30%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'expandGlow 2s ease-out forwards',
        }}
      />

      {/* 확산 입자들 */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 150;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: '8px',
              height: '8px',
              background: `oklch(0.70 0.18 ${60 + i * 5})`,
              boxShadow: `0 0 20px oklch(0.70 0.18 ${60 + i * 5})`,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animation: `particleFloat 2s ease-out forwards`,
              animationDelay: `${i * 0.05}s`,
              opacity: 1,
            }}
          />
        );
      })}

      {/* 중심 별 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '60px',
          animation: 'starPulse 2s ease-out forwards',
        }}
      >
        ✨
      </div>

      {/* 텍스트 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-32 text-center"
        style={{
          animation: 'textFadeIn 1.5s ease-out forwards',
        }}
      >
        <p className="text-lg font-bold" style={{ color: 'oklch(0.70 0.18 60)' }}>
          부적이 저장되었습니다
        </p>
        <p className="text-sm mt-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
          신비로운 기운이 당신을 감싸고 있습니다
        </p>
      </div>

      {/* 애니메이션 정의 */}
      <style>{`
        @keyframes expandGlow {
          0% {
            width: 200px;
            height: 200px;
            opacity: 1;
          }
          100% {
            width: 600px;
            height: 600px;
            opacity: 0;
          }
        }

        @keyframes particleFloat {
          0% {
            opacity: 1;
            transform: translate(calc(-50%), calc(-50%)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.3);
          }
        }

        @keyframes starPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }

        @keyframes textFadeIn {
          0% {
            opacity: 0;
            transform: translate(-50%, calc(100% + 20px));
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 100%);
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
