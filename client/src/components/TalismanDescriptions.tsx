export const TALISMAN_DATA = [
  {
    id: 'love',
    name: '연애 부적',
    emoji: '💕',
    price: 5000,
    description: '사랑과 인연을 맺는 부적입니다. 짝을 찾는 분들과 현재 연애 중인 분들의 감정을 더욱 돈독하게 만들어줍니다.',
    benefits: [
      '새로운 인연 만나기',
      '연애 감정 증진',
      '부부 금슬 개선',
      '짝사랑 성공',
    ],
    color: 'oklch(0.70 0.18 30)',
  },
  {
    id: 'wealth',
    name: '재물 부적',
    emoji: '💰',
    price: 5000,
    description: '재운을 높이고 금전 운을 개선하는 부적입니다. 사업 번영과 재정 안정을 원하는 분들에게 추천합니다.',
    benefits: [
      '사업 번영',
      '재정 안정',
      '투자 성공',
      '복권 운 상승',
    ],
    color: 'oklch(0.70 0.18 60)',
  },
  {
    id: 'health',
    name: '건강 부적',
    emoji: '🌿',
    price: 5000,
    description: '신체 건강과 정신 건강을 지켜주는 부적입니다. 질병 예방과 회복을 돕습니다.',
    benefits: [
      '질병 예방',
      '빠른 회복',
      '면역력 강화',
      '정신 건강 개선',
    ],
    color: 'oklch(0.70 0.18 120)',
  },
  {
    id: 'protection',
    name: '보호 부적',
    emoji: '🛡️',
    price: 5000,
    description: '악운과 부정적 에너지로부터 보호해주는 부적입니다. 일상의 안전과 평온함을 지켜줍니다.',
    benefits: [
      '악운 차단',
      '사고 예방',
      '에너지 보호',
      '평온함 유지',
    ],
    color: 'oklch(0.70 0.18 270)',
  },
  {
    id: 'success',
    name: '성공 부적',
    emoji: '🏆',
    price: 5000,
    description: '목표 달성과 성공을 이끌어주는 부적입니다. 시험, 면접, 프로젝트 성공을 원하는 분들에게 추천합니다.',
    benefits: [
      '시험 합격',
      '면접 성공',
      '프로젝트 완성',
      '목표 달성',
    ],
    color: 'oklch(0.70 0.18 85)',
  },
  {
    id: 'harmony',
    name: '조화 부적',
    emoji: '☮️',
    price: 5000,
    description: '인간관계를 원만하게 하고 조화로운 에너지를 불러오는 부적입니다. 가족, 직장, 친구 관계 개선에 효과적입니다.',
    benefits: [
      '가족 화목',
      '직장 인간관계 개선',
      '친구 관계 증진',
      '소통 능력 향상',
    ],
    color: 'oklch(0.70 0.18 180)',
  },
  {
    id: 'fortune',
    name: '행운 부적',
    emoji: '🍀',
    price: 5000,
    description: '일상 속 작은 행운들을 모아주는 부적입니다. 긍정적 에너지와 좋은 기회를 끌어당깁니다.',
    benefits: [
      '일상 행운 증가',
      '기회 포착',
      '긍정 에너지',
      '운 상승',
    ],
    color: 'oklch(0.70 0.18 150)',
  },
  {
    id: 'learning',
    name: '학업 부적',
    emoji: '📚',
    price: 5000,
    description: '학습 능력을 높이고 집중력을 향상시키는 부적입니다. 학생들의 성적 향상과 시험 합격을 돕습니다.',
    benefits: [
      '집중력 향상',
      '학습 능력 증진',
      '성적 향상',
      '기억력 개선',
    ],
    color: 'oklch(0.70 0.18 240)',
  },
];

interface TalismanDescriptionProps {
  talismanId: string;
}

export function TalismanDescription({ talismanId }: TalismanDescriptionProps) {
  const talisman = TALISMAN_DATA.find(t => t.id === talismanId);

  if (!talisman) return null;

  return (
    <div className="p-6 rounded-xl border" style={{
      background: 'oklch(0.15 0.05 270)',
      borderColor: `${talisman.color}40`,
    }}>
      <div className="flex items-start gap-4">
        <div style={{ fontSize: '48px' }}>{talisman.emoji}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
            {talisman.name}
          </h3>
          <p className="text-sm mb-4" style={{ color: 'oklch(0.78 0.15 85)' }}>
            {talisman.description}
          </p>
          
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: talisman.color }}>
              효과
            </p>
            <div className="grid grid-cols-2 gap-2">
              {talisman.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span style={{ color: talisman.color }}>✓</span>
                  <span className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
