/* 결제 완료 애니메이션 컴포넌트
 * 별 입자 효과와 함께 결제 완료 표시
 */

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface PaymentSuccessAnimationProps {
  isVisible: boolean;
  chargeAmount: number;
  onComplete: () => void;
}

export default function PaymentSuccessAnimation({
  isVisible,
  chargeAmount,
  onComplete,
}: PaymentSuccessAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // 입자 생성
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setParticles(newParticles);

      // 2초 후 완료
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'oklch(0 0 0 / 30%)',
          animation: 'fadeOut 2s ease-out forwards',
        }}
      />

      {/* 중앙 체크마크 */}
      <div
        className="relative z-10 flex flex-col items-center justify-center"
        style={{
          animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        {/* 원형 배경 */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(135deg, oklch(0.78 0.15 85), oklch(0.78 0.25 85))',
            boxShadow: '0 0 40px oklch(0.78 0.15 85 / 60%)',
          }}
        >
          <Check size={48} style={{ color: 'oklch(0.14 0.05 270)' }} strokeWidth={3} />
        </div>

        {/* 텍스트 */}
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
          결제 완료!
        </h3>
        <p className="text-lg" style={{ color: 'oklch(0.78 0.15 85)' }}>
          ⭐ +{chargeAmount}개 충전됨
        </p>
      </div>

      {/* 입자 효과 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `floatUp 2s ease-out forwards`,
            animationDelay: `${particle.id * 0.05}s`,
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>✨</span>
        </div>
      ))}

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

        @keyframes floatUp {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 0.3;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
