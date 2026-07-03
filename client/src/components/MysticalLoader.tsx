/* 신비로운 로딩 애니메이션 컴포넌트
 * Design: Mystic Dark Luxury — 부드러운 회전, 보라/금색 그라디언트
 */
import React from 'react';

interface MysticalLoaderProps {
  message?: string;
  type?: 'saju' | 'tarot' | 'yuk';
}

export default function MysticalLoader({ message = '분석 중...', type = 'saju' }: MysticalLoaderProps) {
  const getIcon = () => {
    switch (type) {
      case 'tarot':
        return '🃏';
      case 'yuk':
        return '☯️';
      case 'saju':
      default:
        return '✨';
    }
  };

  const getMessages = () => {
    switch (type) {
      case 'tarot':
        return ['카드를 섞고 있습니다...', '당신의 운명을 읽고 있습니다...', '신비한 메시지를 받고 있습니다...'];
      case 'yuk':
        return ['육괘를 계산 중입니다...', '천지의 기운을 감지하고 있습니다...', '변화의 흐름을 해석 중입니다...'];
      case 'saju':
      default:
        return ['사주를 계산 중입니다...', '천간지지를 분석 중입니다...', '오행의 균형을 살피고 있습니다...'];
    }
  };

  const [displayMessage, setDisplayMessage] = React.useState(message);

  React.useEffect(() => {
    const messages = getMessages();
    let index = 0;
    const interval = setInterval(() => {
      setDisplayMessage(messages[index % messages.length]);
      index++;
    }, 1500);
    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'oklch(0.12 0.03 270 / 80%)' }}>
      <div className="text-center space-y-6">
        {/* 외부 회전 원 */}
        <div className="relative w-32 h-32 mx-auto">
          {/* 배경 원 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, oklch(0.78 0.15 85), oklch(0.50 0.28 290), oklch(0.78 0.15 85))',
              animation: 'spin 4s linear infinite',
            }}
          />

          {/* 내부 원 */}
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center text-5xl"
            style={{
              background: 'oklch(0.12 0.03 270)',
            }}
          >
            {getIcon()}
          </div>

          {/* 중앙 회전 점들 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: 'oklch(0.78 0.15 85)',
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 120}deg) translateY(-12px)`,
                  animation: `spin ${3 - i * 0.5}s linear infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 메시지 */}
        <div className="space-y-2">
          <p
            className="text-lg font-semibold transition-all duration-500"
            style={{ color: 'oklch(0.78 0.15 85)', fontFamily: "'Noto Serif KR', serif" }}
          >
            {displayMessage}
          </p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'oklch(0.50 0.28 290)',
                  animation: `pulse 1.4s infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
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
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
