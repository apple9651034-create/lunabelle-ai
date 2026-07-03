/* 행운의 색상, 숫자, 아이템 정보
 * 사주 기반 맞춤형 운세 위젯에 표시
 */

export interface FortuneDetails {
  luckyColors: Array<{ name: string; hex: string; emoji: string }>;
  luckyNumbers: number[];
  luckyItems: Array<{ name: string; emoji: string }>;
  luckyDirection: string;
  luckyTime: string;
}

// 천간별 행운 정보
const stemFortune: Record<string, FortuneDetails> = {
  '갑': {
    luckyColors: [
      { name: '청색', hex: '#1e90ff', emoji: '🔵' },
      { name: '초록색', hex: '#00b050', emoji: '💚' },
    ],
    luckyNumbers: [1, 3, 8],
    luckyItems: [
      { name: '나무 소품', emoji: '🌲' },
      { name: '식물', emoji: '🌿' },
      { name: '책', emoji: '📚' },
    ],
    luckyDirection: '동쪽',
    luckyTime: '새벽 5시~7시',
  },
  '을': {
    luckyColors: [
      { name: '청색', hex: '#1e90ff', emoji: '🔵' },
      { name: '검은색', hex: '#000000', emoji: '⬛' },
    ],
    luckyNumbers: [2, 4, 9],
    luckyItems: [
      { name: '수정', emoji: '💎' },
      { name: '물 관련 물품', emoji: '💧' },
      { name: '향초', emoji: '🕯️' },
    ],
    luckyDirection: '북동쪽',
    luckyTime: '오전 9시~11시',
  },
  '병': {
    luckyColors: [
      { name: '빨강색', hex: '#ff0000', emoji: '❤️' },
      { name: '주황색', hex: '#ffa500', emoji: '🧡' },
    ],
    luckyNumbers: [3, 5, 7],
    luckyItems: [
      { name: '촛불', emoji: '🕯️' },
      { name: '보석', emoji: '💎' },
      { name: '향수', emoji: '💐' },
    ],
    luckyDirection: '남쪽',
    luckyTime: '오전 11시~오후 1시',
  },
  '정': {
    luckyColors: [
      { name: '빨강색', hex: '#ff0000', emoji: '❤️' },
      { name: '분홍색', hex: '#ffb6c1', emoji: '🌸' },
    ],
    luckyNumbers: [4, 6, 8],
    luckyItems: [
      { name: '꽃', emoji: '🌹' },
      { name: '향료', emoji: '🌿' },
      { name: '그림', emoji: '🎨' },
    ],
    luckyDirection: '남동쪽',
    luckyTime: '오후 1시~3시',
  },
  '무': {
    luckyColors: [
      { name: '노란색', hex: '#ffff00', emoji: '💛' },
      { name: '갈색', hex: '#8b4513', emoji: '🟤' },
    ],
    luckyNumbers: [5, 7, 10],
    luckyItems: [
      { name: '흙 소품', emoji: '🪨' },
      { name: '도자기', emoji: '🏺' },
      { name: '광물', emoji: '⛏️' },
    ],
    luckyDirection: '중앙',
    luckyTime: '오후 3시~5시',
  },
  '기': {
    luckyColors: [
      { name: '노란색', hex: '#ffff00', emoji: '💛' },
      { name: '베이지', hex: '#f5deb3', emoji: '🟨' },
    ],
    luckyNumbers: [6, 8, 9],
    luckyItems: [
      { name: '흙 냄비', emoji: '🪴' },
      { name: '도자기', emoji: '🏺' },
      { name: '돌', emoji: '🪨' },
    ],
    luckyDirection: '남서쪽',
    luckyTime: '오후 5시~7시',
  },
  '경': {
    luckyColors: [
      { name: '흰색', hex: '#ffffff', emoji: '⚪' },
      { name: '은색', hex: '#c0c0c0', emoji: '🩶' },
    ],
    luckyNumbers: [7, 9, 10],
    luckyItems: [
      { name: '금속 소품', emoji: '⚙️' },
      { name: '동전', emoji: '🪙' },
      { name: '은반지', emoji: '💍' },
    ],
    luckyDirection: '서쪽',
    luckyTime: '오후 7시~9시',
  },
  '신': {
    luckyColors: [
      { name: '흰색', hex: '#ffffff', emoji: '⚪' },
      { name: '금색', hex: '#ffd700', emoji: '✨' },
    ],
    luckyNumbers: [8, 10, 1],
    luckyItems: [
      { name: '금 장식', emoji: '👑' },
      { name: '보석', emoji: '💎' },
      { name: '칼', emoji: '⚔️' },
    ],
    luckyDirection: '서북쪽',
    luckyTime: '밤 9시~11시',
  },
  '임': {
    luckyColors: [
      { name: '검은색', hex: '#000000', emoji: '⬛' },
      { name: '파란색', hex: '#0000ff', emoji: '🔵' },
    ],
    luckyNumbers: [1, 9, 6],
    luckyItems: [
      { name: '물 분수', emoji: '⛲' },
      { name: '수정', emoji: '💎' },
      { name: '파도 그림', emoji: '🌊' },
    ],
    luckyDirection: '북쪽',
    luckyTime: '밤 11시~자정',
  },
  '계': {
    luckyColors: [
      { name: '검은색', hex: '#000000', emoji: '⬛' },
      { name: '남색', hex: '#000080', emoji: '🟦' },
    ],
    luckyNumbers: [2, 8, 5],
    luckyItems: [
      { name: '물 조각', emoji: '💧' },
      { name: '얼음 결정', emoji: '❄️' },
      { name: '해양 생물 그림', emoji: '🐚' },
    ],
    luckyDirection: '북북동쪽',
    luckyTime: '자정~오전 1시',
  },
};

export function getFortuneDetails(stemChar: string): FortuneDetails {
  return (
    stemFortune[stemChar] || {
      luckyColors: [
        { name: '보라색', hex: '#9370db', emoji: '💜' },
        { name: '금색', hex: '#ffd700', emoji: '✨' },
      ],
      luckyNumbers: [3, 7, 9],
      luckyItems: [
        { name: '부적', emoji: '🪬' },
        { name: '향', emoji: '🌿' },
        { name: '촛불', emoji: '🕯️' },
      ],
      luckyDirection: '동쪽',
      luckyTime: '새벽',
    }
  );
}
