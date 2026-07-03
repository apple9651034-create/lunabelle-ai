import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface InteractionAnimationProps {
  type: 'empathy' | 'encouragement';
  onComplete?: () => void;
}

export default function InteractionAnimation({ type, onComplete }: InteractionAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 파티클 생성
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // 파티클 제거
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1000);

    onComplete?.();
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer transition-transform hover:scale-110 active:scale-95"
      style={{
        perspective: '1000px',
      }}
    >
      {/* 하트 아이콘 */}
      <div
        className="animate-pulse"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      >
        <Heart
          size={24}
          className="text-pink-400"
          fill="currentColor"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.6))',
          }}
        />
      </div>

      {/* 파티클 효과 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            animation: `float-up 1s ease-out forwards`,
            '--start-x': `${particle.x}px`,
            '--start-y': `${particle.y}px`,
          } as React.CSSProperties & { '--start-x': string; '--start-y': string }}
        >
          <Heart
            size={16}
            className="text-pink-300"
            fill="currentColor"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(244, 114, 182, 0.8))',
              opacity: 0.8,
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes float-up {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 60 - 30}px, -60px) scale(0);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
