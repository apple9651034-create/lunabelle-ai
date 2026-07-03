/**
 * 감정 표현 애니메이션
 * 루나가 사용자를 반가워하는 감정을 표현하는 애니메이션
 */
import React, { useEffect, useState } from 'react';

interface EmotionAnimationProps {
  isVisible: boolean;
  emotion?: 'happy' | 'warm' | 'welcoming';
}

export default function EmotionAnimation({ isVisible, emotion = 'welcoming' }: EmotionAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    // 파티클 생성
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.1,
    }));
    setParticles(newParticles);

    // 3초 후 자동 종료
    const timer = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible || particles.length === 0) return null;

  const emotionEmojis: Record<string, string[]> = {
    happy: ['😊', '✨', '💫', '🌟'],
    warm: ['🥰', '💕', '✨', '🌸'],
    welcoming: ['👋', '✨', '💫', '🌟', '💖'],
  };

  const emojis = emotionEmojis[emotion];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.5);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .emotion-particle {
          animation: float-up 2s ease-out forwards;
          font-size: 2rem;
          position: absolute;
        }

        .emotion-center {
          animation: pulse-glow 1s ease-in-out infinite;
          font-size: 4rem;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>

      {/* 중앙 이모티콘 */}
      <div className="emotion-center" style={{ animationDelay: '0s' }}>
        {emojis[0]}
      </div>

      {/* 떠오르는 파티클들 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="emotion-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {emojis[particle.id % emojis.length]}
        </div>
      ))}

      {/* 반짝이는 배경 효과 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, oklch(0.78 0.15 85 / 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse-glow 1.5s ease-in-out infinite',
        }}
      />
    </div>
  );
}
