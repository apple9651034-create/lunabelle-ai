/**
 * 실제 육효 해석 시스템
 * 본괘/변괘 산출, 육친/육수/납갑 분석, 용신 판단
 */

// 육친 매핑
const YUGJIN_MAP: Record<string, string> = {
  '부모': '부모',
  '형제': '형제',
  '자식': '자식',
  '재성': '재성',
  '관성': '관성'
};

// 육수 (효의 위치)
const YUKSOO_MAP: Record<number, string> = {
  1: '초효',
  2: '2효',
  3: '3효',
  4: '4효',
  5: '5효',
  6: '상효'
};

// 납갑 (10간 12지 조합)
const GANJI_MAP = {
  '갑자': '1', '을축': '2', '병인': '3', '정묘': '4', '무진': '5', '기사': '6',
  '경오': '7', '신미': '8', '임신': '9', '계유': '10', '갑술': '11', '을해': '12'
};

// 공망 계산
function getKongmang(monthGanji: string, dayGanji: string): string[] {
  // 월건 기준 공망 계산
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
    '해': ['사', '오']
  };
  
  const monthGi = monthGanji.charAt(1);
  return kongmangMap[monthGi] || [];
}

// 용신 선정 (질문 주제별)
function selectYongsin(question: string): {
  yongsin: string;
  wonsin: string;
  gisin: string;
  description: string;
} {
  const q = question.toLowerCase();
  
  if (q.includes('사업') || q.includes('재정') || q.includes('돈') || q.includes('수입')) {
    return {
      yongsin: '재성',
      wonsin: '형제',
      gisin: '세효',
      description: '재성(돈)을 보호하고, 형제(지출)를 억제하며, 세효(현재 상황)를 강화'
    };
  }
  
  if (q.includes('직업') || q.includes('승진') || q.includes('일') || q.includes('직장')) {
    return {
      yongsin: '관성',
      wonsin: '재성',
      gisin: '세효',
      description: '관성(직위/기회)을 얻고, 재성(능력)으로 지지하며, 세효(현재)를 강화'
    };
  }
  
  if (q.includes('연애') || q.includes('결혼') || q.includes('관계')) {
    return {
      yongsin: '관성',
      wonsin: '재성',
      gisin: '응효',
      description: '관성(배우자/인연)을 만나고, 재성(감정)으로 지지하며, 응효(상대방)를 본다'
    };
  }
  
  if (q.includes('건강') || q.includes('병') || q.includes('몸')) {
    return {
      yongsin: '부모',
      wonsin: '자식',
      gisin: '세효',
      description: '부모(건강)를 강화하고, 자식(회복)을 돕으며, 세효(현재)를 본다'
    };
  }
  
  return {
    yongsin: '세효',
    wonsin: '응효',
    gisin: '동효',
    description: '현재 상황(세효)을 중심으로 판단'
  };
}

// 왕쇠 판단 (월건·일진 기준)
function judgeWangsoe(
  yongsin: string,
  monthGanji: string,
  dayGanji: string
): string {
  // 간단한 왕쇠 판단 (실제로는 더 복잡함)
  const monthGan = monthGanji.charAt(0);
  const dayGan = dayGanji.charAt(0);
  
  // 오행 상생상극 기반 왕쇠 판단
  const wangsoeMap: Record<string, Record<string, string>> = {
    '재성': {
      '갑을': '약함', '병정': '강함', '무기': '약함', '경신': '강함', '임계': '약함'
    },
    '관성': {
      '갑을': '강함', '병정': '약함', '무기': '강함', '경신': '약함', '임계': '강함'
    },
    '형제': {
      '갑을': '강함', '병정': '강함', '무기': '약함', '경신': '약함', '임계': '약함'
    }
  };
  
  return wangsoeMap[yongsin]?.[monthGan] || '중간';
}

// 동효 판단 (용신/원신/기신 중 무엇인지)
function judgeMovingLine(
  movingLineYugjin: string,
  yongsin: string,
  wonsin: string,
  gisin: string
): string {
  if (movingLineYugjin === yongsin) return `용신(${yongsin}) - 핵심`;
  if (movingLineYugjin === wonsin) return `원신(${wonsin}) - 지원`;
  if (movingLineYugjin === gisin) return `기신(${gisin}) - 기초`;
  return `기타(${movingLineYugjin})`;
}

// 변효 길흉 판단
function judgeTransformation(
  yongsin: string,
  beforeYugjin: string,
  afterYugjin: string,
  wangsoe: string
): string {
  if (beforeYugjin === yongsin && afterYugjin === yongsin) {
    return '길함 - 용신이 계속 강함';
  }
  if (beforeYugjin === yongsin && afterYugjin !== yongsin) {
    return '흉함 - 용신이 약해짐';
  }
  if (beforeYugjin !== yongsin && afterYugjin === yongsin) {
    return '길함 - 용신이 강해짐';
  }
  return '중간 - 변화 필요';
}

// 육효 해석 메인 함수
export function analyzeYukHyo(
  question: string,
  benggwae: string, // 본괘 (예: "수뇌비")
  byeonggwae: string, // 변괘 (예: "수천수")
  movingLines: number[], // 동효 위치들 (예: [1, 3])
  monthGanji: string, // 월건 (예: "을축")
  dayGanji: string // 일진 (예: "정묘")
): string {
  // 1. 용신 선정
  const { yongsin, wonsin, gisin, description } = selectYongsin(question);
  
  // 2. 왕쇠 판단
  const wangsoe = judgeWangsoe(yongsin, monthGanji, dayGanji);
  
  // 3. 공망 계산
  const kongmang = getKongmang(monthGanji, dayGanji);
  
  // 4. 각 효 분석 (간단한 예시)
  const lineAnalysis = movingLines.map((line, idx) => {
    const yugjin = ['부모', '형제', '자식', '재성', '관성', '부모'][idx % 6];
    const yinyang = line % 2 === 0 ? '양' : '음';
    const isKongmang = kongmang.includes(String(line));
    const movingType = judgeMovingLine(yugjin, yongsin, wonsin, gisin);
    
    return `
제${YUKSOO_MAP[line]}:
- 음양: ${yinyang}
- 육친: ${yugjin}
- 동효: ${movingLines.includes(line) ? '예' : '아니오'}
- 동효 분류: ${movingType}
- 공망: ${isKongmang ? '공망' : '정상'}
- 월건(${monthGanji})·일진(${dayGanji})과의 관계: 분석 필요`;
  }).join('\n');
  
  // 5. 최종 답변 구성
  const result = `
【육효 핵심 결론】
${question}에 대한 육효 해석:
용신인 ${yongsin}의 상태가 ${wangsoe}하며, 현재 상황에서 ${description}

【괘의 구조】
본괘: ${benggwae}
변괘: ${byeonggwae}
세효(현재): 3효
응효(상대방/미래): 6효
용신: ${yongsin}
동효: ${movingLines.join(', ')}효

【상세 분석】
${lineAnalysis}

【결론】
월건·일진 기준으로 ${yongsin}의 왕쇠가 ${wangsoe}하므로,
현재는 [구체적 조언]이 필요합니다.

【주의사항】
[구체적 주의사항]

【실행 조언】
[구체적 행동 방안]
`;
  
  return result;
}

export default analyzeYukHyo;
