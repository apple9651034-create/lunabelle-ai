/**
 * 결제 성공 애니메이션 컴포넌트
 * 화려한 결제 완료 효과 표시
 */
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface PaymentSuccessAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function PaymentSuccessAnimation({
  isVisible,
  onComplete,
}: PaymentSuccessAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    // 파티클 생성
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);

    // 3초 후 완료 콜백
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(112, 24, 255, 0.1) 0%, transparent 70%)',
      }}
    >
      {/* 중앙 체크마크 */}
      <div
        className="relative w-32 h-32 flex items-center justify-center"
        style={{
          animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <Check
          size={64}
          style={{
            color: 'oklch(1 0 0)',
            filter: 'drop-shadow(0 0 20px oklch(0.70 0.18 60))',
          }}
        />
      </div>

      {/* 파티클 효과 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `oklch(0.70 0.18 ${60 + particle.id * 2})`,
            animation: `float ${2 + Math.random() * 1}s ease-out forwards`,
            boxShadow: `0 0 ${10 + particle.id}px oklch(0.70 0.18 ${60 + particle.id * 2})`,
          }}
        />
      ))}

      {/* 텍스트 */}
      <div
        className="absolute bottom-20 text-center"
        style={{
          animation: 'fadeInUp 0.8s ease-out 0.3s both',
        }}
      >
        <h2
          className="text-3xl font-bold mb-2"
          style={{
            color: 'oklch(0.94 0.015 90)',
            textShadow: '0 0 20px oklch(0.70 0.18 60)',
          }}
        >
          ✨ 결제 완료! ✨
        </h2>
        <p style={{ color: 'oklch(0.70 0.02 290)' }}>
          부적 이미지를 저장할 수 있습니다
        </p>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes float {
          to {
            transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(112, 24, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(112, 24, 255, 0);
          }
        }
      `}</style>
    </div>
  );
}
