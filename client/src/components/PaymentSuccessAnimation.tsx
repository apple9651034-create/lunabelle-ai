/* 결제 완료 애니메이션 컴포넌트
 * 동전이 떨어지는 화려한 효과
 */

import React, { useEffect, useState } from 'react';

interface Coin {
  id: number;
  left: number;
  delay: number;
}

interface PaymentSuccessAnimationProps {
  isVisible: boolean;
  chargeAmount?: number;
  onComplete: () => void;
}

export default function PaymentSuccessAnimation({
  isVisible,
  chargeAmount = 0,
  onComplete,
}: PaymentSuccessAnimationProps) {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (isVisible) {
      // 동전 생성
      const newCoins = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 80 + 10,
        delay: Math.random() * 0.4,
      }));
      setCoins(newCoins);

      // 3초 후 완료
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'oklch(0 0 0 / 20%)',
          animation: 'fadeOut 3s ease-out forwards',
        }}
      />

      {/* 중앙 빛나는 효과 */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          animation: 'pulse 0.8s ease-out',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(0.70 0.18 60 / 70%) 0%, oklch(0.70 0.18 60 / 0%) 70%)',
        }}
      />

      {/* 동전들 */}
      {coins.map(coin => (
        <div
          key={coin.id}
          style={{
            position: 'fixed',
            left: `${coin.left}%`,
            top: '50%',
            animation: `fallCoin 2.5s ease-in forwards`,
            animationDelay: `${coin.delay}s`,
            transformOrigin: 'center',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, oklch(0.90 0.12 60), oklch(0.70 0.18 60))',
              boxShadow: '0 0 25px oklch(0.70 0.18 60 / 80%), inset -2px -2px 5px oklch(0 0 0 / 30%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'oklch(0.10 0.02 270)',
              border: '2px solid oklch(0.85 0.15 60)',
            }}
          >
            💰
          </div>
        </div>
      ))}

      {/* 성공 텍스트 */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        style={{
          animation: 'scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: 'oklch(0.70 0.18 60)',
            textShadow: '0 0 40px oklch(0.70 0.18 60 / 80%), 0 0 20px oklch(0.70 0.18 60 / 40%)',
            fontFamily: "'Noto Serif KR', serif",
            marginBottom: '12px',
          }}
        >
          ✨ 결제 완료! ✨
        </h2>
        <p
          style={{
            fontSize: '20px',
            color: 'oklch(0.94 0.015 90)',
            animation: 'fadeIn 0.8s ease-out 0.2s forwards',
            opacity: 0,
            textShadow: '0 2px 8px oklch(0 0 0 / 50%)',
          }}
        >
          💝 {chargeAmount > 0 ? `+${chargeAmount}개 크레딧 충전됨` : '크레딧이 충전되었습니다'}
        </p>
      </div>

      <style>{`
        @keyframes fallCoin {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(500px) scale(0.2) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes scaleUp {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.3);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.5);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
