/* 타로 카드 이미지 시각화 컴포넌트
 * 채팅창에서 타로 카드를 시각적으로 표시
 */

import React from 'react';

interface TarotCardImageProps {
  cardName: string;
  isReversed?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function TarotCardImage({ cardName, isReversed = false, size = 'medium' }: TarotCardImageProps) {
  const sizeClasses = {
    small: 'w-24 h-32',
    medium: 'w-32 h-44',
    large: 'w-40 h-56',
  };

  // 타로 카드 색상 매핑 (대아르카나)
  const cardColors: Record<string, { bg: string; accent: string }> = {
    'The Fool': { bg: 'oklch(0.85 0.15 60)', accent: 'oklch(0.70 0.20 30)' },
    'The Magician': { bg: 'oklch(0.75 0.20 290)', accent: 'oklch(0.60 0.25 50)' },
    'The High Priestess': { bg: 'oklch(0.70 0.15 250)', accent: 'oklch(0.85 0.10 60)' },
    'The Empress': { bg: 'oklch(0.80 0.18 120)', accent: 'oklch(0.60 0.25 30)' },
    'The Emperor': { bg: 'oklch(0.75 0.20 30)', accent: 'oklch(0.60 0.25 290)' },
    'The Hierophant': { bg: 'oklch(0.70 0.18 280)', accent: 'oklch(0.85 0.15 60)' },
    'The Lovers': { bg: 'oklch(0.80 0.20 0)', accent: 'oklch(0.65 0.25 120)' },
    'The Chariot': { bg: 'oklch(0.75 0.18 250)', accent: 'oklch(0.60 0.25 50)' },
    'Strength': { bg: 'oklch(0.85 0.18 60)', accent: 'oklch(0.60 0.25 280)' },
    'The Hermit': { bg: 'oklch(0.65 0.15 280)', accent: 'oklch(0.85 0.15 60)' },
    'The Wheel of Fortune': { bg: 'oklch(0.75 0.20 50)', accent: 'oklch(0.65 0.25 280)' },
    'Justice': { bg: 'oklch(0.70 0.18 280)', accent: 'oklch(0.85 0.15 50)' },
    'The Hanged Man': { bg: 'oklch(0.75 0.15 250)', accent: 'oklch(0.60 0.25 30)' },
    'Death': { bg: 'oklch(0.60 0.15 280)', accent: 'oklch(0.85 0.15 120)' },
    'Temperance': { bg: 'oklch(0.80 0.18 120)', accent: 'oklch(0.65 0.25 280)' },
    'The Devil': { bg: 'oklch(0.55 0.20 30)', accent: 'oklch(0.85 0.15 60)' },
    'The Tower': { bg: 'oklch(0.70 0.20 30)', accent: 'oklch(0.85 0.15 60)' },
    'The Star': { bg: 'oklch(0.80 0.15 250)', accent: 'oklch(0.85 0.15 60)' },
    'The Moon': { bg: 'oklch(0.70 0.12 280)', accent: 'oklch(0.85 0.15 60)' },
    'The Sun': { bg: 'oklch(0.85 0.20 60)', accent: 'oklch(0.60 0.25 280)' },
    'Judgement': { bg: 'oklch(0.75 0.18 30)', accent: 'oklch(0.65 0.25 280)' },
    'The World': { bg: 'oklch(0.75 0.18 120)', accent: 'oklch(0.60 0.25 30)' },
  };

  const colors = cardColors[cardName] || { bg: 'oklch(0.70 0.15 280)', accent: 'oklch(0.85 0.15 60)' };

  // 카드 번호 추출 (예: "Two of Cups" -> "02")
  const getCardNumber = (name: string): string => {
    const numberMap: Record<string, string> = {
      'Ace': '01',
      'Two': '02',
      'Three': '03',
      'Four': '04',
      'Five': '05',
      'Six': '06',
      'Seven': '07',
      'Eight': '08',
      'Nine': '09',
      'Ten': '10',
      'Page': '11',
      'Knight': '12',
      'Queen': '13',
      'King': '14',
    };

    for (const [key, value] of Object.entries(numberMap)) {
      if (name.includes(key)) return value;
    }

    return '00';
  };

  const cardNumber = getCardNumber(cardName);
  const displayName = cardName.length > 15 ? cardName.substring(0, 12) + '...' : cardName;

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg shadow-lg flex flex-col items-center justify-center relative overflow-hidden transition-transform ${
        isReversed ? 'rotate-180' : ''
      }`}
      style={{
        background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent})`,
        border: '2px solid oklch(1 0 0 / 20%)',
      }}
    >
      {/* 카드 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, oklch(1 0 0) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
      </div>

      {/* 카드 내용 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        {/* 상단 번호 */}
        <div className="text-xs font-bold opacity-70" style={{ color: 'oklch(1 0 0 / 60%)' }}>
          {cardNumber}
        </div>

        {/* 카드 이름 */}
        <div className="text-center px-2 font-semibold text-xs leading-tight" style={{ color: 'oklch(1 0 0)' }}>
          {displayName}
        </div>

        {/* 중앙 심볼 */}
        <div className="text-3xl my-2">
          {getCardSymbol(cardName)}
        </div>

        {/* 역방향 표시 */}
        {isReversed && (
          <div className="text-xs opacity-70 mt-1" style={{ color: 'oklch(1 0 0 / 60%)' }}>
            ↻ 역
          </div>
        )}

        {/* 하단 번호 */}
        <div className="text-xs font-bold opacity-70 mt-auto" style={{ color: 'oklch(1 0 0 / 60%)' }}>
          {cardNumber}
        </div>
      </div>
    </div>
  );
}

function getCardSymbol(cardName: string): string {
  const symbols: Record<string, string> = {
    'The Fool': '🤡',
    'The Magician': '🎩',
    'The High Priestess': '👑',
    'The Empress': '👸',
    'The Emperor': '👨‍🦱',
    'The Hierophant': '⛪',
    'The Lovers': '💕',
    'The Chariot': '🏇',
    'Strength': '💪',
    'The Hermit': '🕯️',
    'The Wheel of Fortune': '🎡',
    'Justice': '⚖️',
    'The Hanged Man': '🪢',
    'Death': '💀',
    'Temperance': '⚗️',
    'The Devil': '😈',
    'The Tower': '🏰',
    'The Star': '⭐',
    'The Moon': '🌙',
    'The Sun': '☀️',
    'Judgement': '📯',
    'The World': '🌍',
    'Ace of Wands': '🔥',
    'Ace of Cups': '🏆',
    'Ace of Swords': '⚔️',
    'Ace of Pentacles': '💰',
  };

  // 정확한 매칭 시도
  if (symbols[cardName]) return symbols[cardName];

  // 부분 매칭 시도
  for (const [key, symbol] of Object.entries(symbols)) {
    if (cardName.includes(key)) return symbol;
  }

  // 기본값
  if (cardName.includes('Wands')) return '🔥';
  if (cardName.includes('Cups')) return '🏆';
  if (cardName.includes('Swords')) return '⚔️';
  if (cardName.includes('Pentacles')) return '💰';

  return '🔮';
}
