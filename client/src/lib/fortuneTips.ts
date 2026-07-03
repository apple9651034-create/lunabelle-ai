/* AI 루나 — fortuneTips.ts
 * 사주/타로 관련 흥미로운 팁 모음
 * 로딩 중 사용자 지루함 방지용
 */

export const fortuneTips = [
  // 사주 관련 팁
  {
    category: 'saju',
    title: '천간의 의미',
    content: '천간 10개(갑을병정무기경신임계)는 음양과 오행을 나타냅니다. 홀수는 양, 짝수는 음입니다.',
  },
  {
    category: 'saju',
    title: '지지의 순환',
    content: '지지 12개(자축인묘진사오미신유술해)는 12년 주기로 순환합니다. 당신의 띠는 출생년도의 지지입니다.',
  },
  {
    category: 'saju',
    title: '오행의 상생',
    content: '목생화, 화생토, 토생금, 금생수, 수생목. 오행의 상생 관계는 조화와 발전을 의미합니다.',
  },
  {
    category: 'saju',
    title: '오행의 상극',
    content: '목극토, 토극수, 수극화, 화극금, 금극목. 상극 관계는 견제와 균형을 의미합니다.',
  },
  {
    category: 'saju',
    title: '십간십이지',
    content: '60갑자는 천간 10개와 지지 12개의 조합으로 60년 주기를 이룹니다. 당신의 사주도 이 주기 안에 있습니다.',
  },
  {
    category: 'saju',
    title: '납음오행',
    content: '납음오행은 시간의 오행을 나타냅니다. 자시는 수, 축시는 토, 인시는 목 등으로 배정됩니다.',
  },
  {
    category: 'saju',
    title: '십성의 의미',
    content: '정재, 편재, 정관, 편관 등 십성은 일간과의 관계로 길흉을 판단하는 중요한 요소입니다.',
  },
  {
    category: 'saju',
    title: '대운과 세운',
    content: '대운은 10년 단위의 큰 흐름, 세운은 1년 단위의 작은 흐름입니다. 두 흐름이 만나는 지점이 중요합니다.',
  },
  {
    category: 'saju',
    title: '공망의 의미',
    content: '공망은 특정 지지가 없는 상태를 의미합니다. 공망된 오행은 약해지거나 숨겨진 특성을 가집니다.',
  },
  {
    category: 'saju',
    title: '납음오행의 시간',
    content: '자정(23-01시)은 자시, 새벽 1-3시는 축시입니다. 정확한 시간이 사주 해석의 핵심입니다.',
  },

  // 타로 관련 팁
  {
    category: 'tarot',
    title: '대아르카나의 의미',
    content: '타로 78장 중 22장의 대아르카나는 인생의 큰 여정을 나타냅니다. 0번 바보부터 21번 세계까지 순환합니다.',
  },
  {
    category: 'tarot',
    title: '소아르카나의 구성',
    content: '타로의 56장 소아르카나는 완드, 펜타클, 검, 컵 4개 슈트로 나뉘며 각각 불, 흙, 공기, 물을 나타냅니다.',
  },
  {
    category: 'tarot',
    title: '정방향과 역방향',
    content: '타로 카드의 정방향은 긍정적 의미, 역방향은 부정적 의미 또는 약화된 의미를 나타냅니다.',
  },
  {
    category: 'tarot',
    title: '3카드 스프레드',
    content: '3카드 스프레드는 과거-현재-미래, 또는 상황-행동-결과 등으로 해석됩니다. 가장 기본적인 스프레드입니다.',
  },
  {
    category: 'tarot',
    title: '켈틱 크로스',
    content: '켈틱 크로스는 10장의 카드로 상황을 깊이 있게 분석합니다. 가장 복잡하고 정확한 스프레드입니다.',
  },
  {
    category: 'tarot',
    title: '완드 슈트의 의미',
    content: '완드는 불의 원소로 창의성, 열정, 행동을 나타냅니다. 사업과 창조적 활동을 상징합니다.',
  },
  {
    category: 'tarot',
    title: '펜타클 슈트의 의미',
    content: '펜타클은 흙의 원소로 물질, 재정, 안정을 나타냅니다. 현실적이고 실질적인 문제를 다룹니다.',
  },
  {
    category: 'tarot',
    title: '검 슈트의 의미',
    content: '검은 공기의 원소로 지성, 갈등, 진실을 나타냅니다. 어려운 결정과 명확한 판단을 상징합니다.',
  },
  {
    category: 'tarot',
    title: '컵 슈트의 의미',
    content: '컵은 물의 원소로 감정, 관계, 영적 성장을 나타냅니다. 사랑과 감정적 문제를 다룹니다.',
  },
  {
    category: 'tarot',
    title: '타로 해석의 핵심',
    content: '타로는 미래를 예측하는 것이 아니라 현재 상황을 반영하고 가능성을 제시합니다. 당신의 선택이 미래를 결정합니다.',
  },
];

export function getRandomTip(category?: 'saju' | 'tarot'): (typeof fortuneTips)[0] {
  let filtered = fortuneTips;
  if (category) {
    filtered = fortuneTips.filter((tip) => tip.category === category);
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomTips(count: number, category?: 'saju' | 'tarot'): (typeof fortuneTips)[0][] {
  const tips: (typeof fortuneTips)[0][] = [];
  const seen = new Set<number>();

  let filtered = fortuneTips;
  if (category) {
    filtered = fortuneTips.filter((tip) => tip.category === category);
  }

  while (tips.length < count && tips.length < filtered.length) {
    const index = Math.floor(Math.random() * filtered.length);
    if (!seen.has(index)) {
      seen.add(index);
      tips.push(filtered[index]);
    }
  }

  return tips;
}
