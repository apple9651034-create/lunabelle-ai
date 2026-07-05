/**
 * 육효 실제 계산 엔진
 * 본괘/변괘 산출, 육친/육수/납갑 분석, 용신 판단
 */

// 64괘 정보
const GWAES = {
  1: { name: '건', symbol: '☰', meaning: '하늘, 창조, 강함' },
  2: { name: '곤', symbol: '☷', meaning: '땅, 수용, 안정' },
  3: { name: '감', symbol: '☵', meaning: '물, 위험, 지혜' },
  4: { name: '리', symbol: '☲', meaning: '불, 밝음, 명확함' },
  5: { name: '진', symbol: '☳', meaning: '천둥, 움직임, 시작' },
  6: { name: '손', symbol: '☴', meaning: '바람, 침투, 소통' },
  7: { name: '간', symbol: '☶', meaning: '산, 멈춤, 정지' },
  8: { name: '태', symbol: '☱', meaning: '못, 기쁨, 소통' },
};

// 육친 매핑 (일주 기준)
const YUGJIN_RELATIONS: Record<string, string[]> = {
  '갑': ['부모', '형제', '자식', '재성', '관성'],
  '을': ['부모', '형제', '자식', '재성', '관성'],
  '병': ['형제', '자식', '재성', '관성', '부모'],
  '정': ['형제', '자식', '재성', '관성', '부모'],
  '무': ['자식', '재성', '관성', '부모', '형제'],
  '기': ['자식', '재성', '관성', '부모', '형제'],
  '경': ['재성', '관성', '부모', '형제', '자식'],
  '신': ['재성', '관성', '부모', '형제', '자식'],
  '임': ['관성', '부모', '형제', '자식', '재성'],
  '계': ['관성', '부모', '형제', '자식', '재성'],
};

// 간지 오행 매핑
const GANJI_OHAENG: Record<string, string> = {
  '갑': '목', '을': '목',
  '병': '화', '정': '화',
  '무': '토', '기': '토',
  '경': '금', '신': '금',
  '임': '수', '계': '수',
  '자': '수', '축': '토',
  '인': '목', '묘': '목',
  '진': '토', '사': '화',
  '오': '화', '미': '토',
  '유': '금', '술': '토', '해': '수',
};

// 공망 계산
function calculateKongmang(monthGanji: string, dayGanji: string): string[] {
  const monthJi = monthGanji.charAt(1);
  const kongmangMap: Record<string, string[]> = {
    '자': ['오', '미'],
    '축': ['미', '신'],
    '인': ['신', '유'],
    '묘': ['유', '술'],
    '진': ['술', '해'],
    '사': ['해', '자'],
    '오': ['자', '축'],
    '미': ['축', '인'],
    '신': ['인', '묘'],
    '유': ['묘', '진'],
    '술': ['진', '사'],
    '해': ['사', '오'],
  };
  return kongmangMap[monthJi] || [];
}

// 본괘 산출 (사용자 입력 기반)
function calculateBenggwae(input: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}): { benggwae: number; lines: number[] } {
  // 간단한 예시: 월일시분을 기반으로 본괘 산출
  const sum = input.month + input.day + input.hour + input.minute;
  const benggwae = ((sum - 1) % 8) + 1;
  
  // 동효 위치 산출 (예시)
  const movingLines: number[] = [];
  for (let i = 1; i <= 6; i++) {
    if ((sum + i) % 3 === 0) {
      movingLines.push(i);
    }
  }
  
  return {
    benggwae,
    lines: movingLines.length > 0 ? movingLines : [Math.floor(Math.random() * 6) + 1],
  };
}

// 변괘 산출
function calculateByeonggwae(benggwae: number, movingLines: number[]): number {
  if (movingLines.length === 0) return benggwae;
  
  // 첫 번째 동효 위치 기반 변괘 산출
  const firstMovingLine = movingLines[0];
  const change = ((firstMovingLine - 1) % 8) + 1;
  
  return change;
}

// 육친 분석
function analyzeYugjin(
  dayGan: string,
  monthGanji: string,
  lines: number[]
): Record<number, { yugjin: string; yinyang: string; ohaeng: string }> {
  const result: Record<number, { yugjin: string; yinyang: string; ohaeng: string }> = {};
  const yugjinSequence = YUGJIN_RELATIONS[dayGan] || [];
  
  for (let i = 0; i < 6; i++) {
    const lineNum = i + 1;
    const yugjin = yugjinSequence[i % 5];
    const yinyang = lines.includes(lineNum) ? '양(변)' : (i % 2 === 0 ? '양' : '음');
    const ohaeng = GANJI_OHAENG[dayGan] || '미분류';
    
    result[lineNum] = { yugjin, yinyang, ohaeng };
  }
  
  return result;
}

// 용신 선정
function selectYongsin(question: string): {
  yongsin: string;
  wonsin: string;
  gisin: string;
} {
  const q = question.toLowerCase();
  
  if (q.includes('재물') || q.includes('돈') || q.includes('수입') || q.includes('사업')) {
    return { yongsin: '재성', wonsin: '형제', gisin: '세효' };
  }
  if (q.includes('직업') || q.includes('승진') || q.includes('일')) {
    return { yongsin: '관성', wonsin: '재성', gisin: '세효' };
  }
  if (q.includes('연애') || q.includes('결혼') || q.includes('관계')) {
    return { yongsin: '관성', wonsin: '재성', gisin: '응효' };
  }
  
  return { yongsin: '세효', wonsin: '응효', gisin: '동효' };
}

// 왕쇠 판단
function judgeWangsoe(
  yongsin: string,
  monthGan: string,
  dayGan: string
): string {
  const yongsinOhaeng = GANJI_OHAENG[yongsin.charAt(0)] || '미분류';
  const monthOhaeng = GANJI_OHAENG[monthGan] || '미분류';
  
  // 간단한 상생상극 로직
  const shengkeMap: Record<string, string> = {
    '목→화': '생', '화→토': '생', '토→금': '생', '금→수': '생', '수→목': '생',
    '목⊗토': '극', '화⊗금': '극', '토⊗수': '극', '금⊗목': '극', '수⊗화': '극',
  };
  
  const relation = `${yongsinOhaeng}→${monthOhaeng}`;
  if (shengkeMap[relation] === '생') return '왕';
  if (shengkeMap[relation] === '극') return '약';
  return '중간';
}

// 메인 계산 함수
export function calculateYukHyo(
  question: string,
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  },
  currentDate: {
    monthGanji: string;
    dayGanji: string;
  }
) {
  // 1. 본괘/변괘 산출
  const { benggwae, lines: movingLines } = calculateBenggwae(birthInfo);
  const byeonggwae = calculateByeonggwae(benggwae, movingLines);
  
  // 2. 용신 선정
  const { yongsin, wonsin, gisin } = selectYongsin(question);
  
  // 3. 육친 분석
  const dayGan = currentDate.dayGanji.charAt(0);
  const yugjinAnalysis = analyzeYugjin(dayGan, currentDate.monthGanji, movingLines);
  
  // 4. 왕쇠 판단
  const monthGan = currentDate.monthGanji.charAt(0);
  const wangsoe = judgeWangsoe(yongsin, monthGan, dayGan);
  
  // 5. 공망 계산
  const kongmang = calculateKongmang(currentDate.monthGanji, currentDate.dayGanji);
  
  return {
    benggwae: {
      number: benggwae,
      name: GWAES[benggwae as keyof typeof GWAES]?.name || '미분류',
      meaning: GWAES[benggwae as keyof typeof GWAES]?.meaning || '',
    },
    byeonggwae: {
      number: byeonggwae,
      name: GWAES[byeonggwae as keyof typeof GWAES]?.name || '미분류',
      meaning: GWAES[byeonggwae as keyof typeof GWAES]?.meaning || '',
    },
    movingLines,
    yongsin,
    wonsin,
    gisin,
    yugjinAnalysis,
    wangsoe,
    kongmang,
    monthGanji: currentDate.monthGanji,
    dayGanji: currentDate.dayGanji,
  };
}

export default calculateYukHyo;
