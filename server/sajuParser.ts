/**
 * 사주 파싱 및 일간 판별 로직
 * 
 * 사주의 구성: 년주(年柱) / 월주(月柱) / 일주(日柱) / 시주(時柱)
 * 각 주(柱)는 천간(天干) + 지지(地支)로 구성
 * 
 * 일간(日干) = 일주(日柱)의 천간(天干)
 */

// 천간 (10개)
const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const HEAVENLY_STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 지지 (12개)
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const EARTHLY_BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 천간의 오행
const HEAVENLY_STEM_ELEMENTS: Record<string, string> = {
  '갑': '목', '을': '목',
  '병': '화', '정': '화',
  '무': '토', '기': '토',
  '경': '금', '신': '금',
  '임': '수', '계': '수',
};

// 지지의 오행
const EARTHLY_BRANCH_ELEMENTS: Record<string, string> = {
  '자': '수', '축': '토',
  '인': '목', '묘': '목',
  '진': '토', '사': '화',
  '오': '화', '미': '토',
  '신': '금', '유': '금',
  '술': '토', '해': '수',
};

interface ParsedPillar {
  heavenlyStem: string;
  earthlyBranch: string;
  element: string;
}

interface ParsedSaju {
  yearPillar: ParsedPillar;
  monthPillar: ParsedPillar;
  dayPillar: ParsedPillar;
  timePillar: ParsedPillar;
  dayMaster: string; // 일간 (일주의 천간)
  dayMasterElement: string; // 일간의 오행
}

/**
 * 천간지 문자열을 파싱하여 천간과 지지로 분리
 * 예: "정사" -> { heavenlyStem: "정", earthlyBranch: "사" }
 */
function parsePillar(pillarStr: string): ParsedPillar | null {
  const cleaned = pillarStr.trim();
  
  if (cleaned.length < 2) return null;
  
  // 첫 글자: 천간
  const heavenlyStem = cleaned[0];
  // 두 번째 글자: 지지
  const earthlyBranch = cleaned[1];
  
  // 유효성 검사
  if (!HEAVENLY_STEMS.includes(heavenlyStem)) {
    console.warn(`Invalid heavenly stem: ${heavenlyStem}`);
    return null;
  }
  
  if (!EARTHLY_BRANCHES.includes(earthlyBranch)) {
    console.warn(`Invalid earthly branch: ${earthlyBranch}`);
    return null;
  }
  
  const element = HEAVENLY_STEM_ELEMENTS[heavenlyStem];
  
  return {
    heavenlyStem,
    earthlyBranch,
    element,
  };
}

/**
 * 명식 문자열을 파싱하여 사주 정보 추출
 * 예: "정사 / 정미 / 정축 / 갑진"
 */
export function parseSajuChart(chartStr: string): ParsedSaju | null {
  try {
    // "/" 또는 "／"로 분리
    const pillars = chartStr.split(/\/|／/).map(p => p.trim()).filter(p => p.length > 0);
    
    if (pillars.length !== 4) {
      console.warn(`Expected 4 pillars, got ${pillars.length}`);
      return null;
    }
    
    const yearPillar = parsePillar(pillars[0]);
    const monthPillar = parsePillar(pillars[1]);
    const dayPillar = parsePillar(pillars[2]);
    const timePillar = parsePillar(pillars[3]);
    
    if (!yearPillar || !monthPillar || !dayPillar || !timePillar) {
      console.warn('Failed to parse one or more pillars');
      return null;
    }
    
    // 일간 = 일주(dayPillar)의 천간
    const dayMaster = dayPillar.heavenlyStem;
    const dayMasterElement = dayPillar.element;
    
    return {
      yearPillar,
      monthPillar,
      dayPillar,
      timePillar,
      dayMaster,
      dayMasterElement,
    };
  } catch (error) {
    console.error('Error parsing saju chart:', error);
    return null;
  }
}

/**
 * 파싱된 사주 정보를 문자열로 포맷팅
 */
export function formatSajuInfo(saju: ParsedSaju): string {
  return `
【 사주 분석 정보 】

명식: ${saju.yearPillar.heavenlyStem}${saju.yearPillar.earthlyBranch} / ${saju.monthPillar.heavenlyStem}${saju.monthPillar.earthlyBranch} / ${saju.dayPillar.heavenlyStem}${saju.dayPillar.earthlyBranch} / ${saju.timePillar.heavenlyStem}${saju.timePillar.earthlyBranch}

【 주요 정보 】
- 일간(日干): ${saju.dayMaster}(${saju.dayMasterElement})
- 일주(日柱): ${saju.dayPillar.heavenlyStem}${saju.dayPillar.earthlyBranch}

【 각 주 분석 】
- 년주(年柱): ${saju.yearPillar.heavenlyStem}${saju.yearPillar.earthlyBranch} (${saju.yearPillar.element})
- 월주(月柱): ${saju.monthPillar.heavenlyStem}${saju.monthPillar.earthlyBranch} (${saju.monthPillar.element})
- 일주(日柱): ${saju.dayPillar.heavenlyStem}${saju.dayPillar.earthlyBranch} (${saju.dayPillar.element}) ← 일간의 기준
- 시주(時柱): ${saju.timePillar.heavenlyStem}${saju.timePillar.earthlyBranch} (${saju.timePillar.element})
`;
}

/**
 * 테스트: 1977.07.19 양력 / 정사 / 정미 / 정축 / 갑진
 */
export function testSajuParser() {
  const testChart = "정사 / 정미 / 정축 / 갑진";
  console.log(`\n테스트 입력: ${testChart}`);
  
  const parsed = parseSajuChart(testChart);
  
  if (!parsed) {
    console.error("파싱 실패");
    return;
  }
  
  console.log(`\n파싱 결과:`);
  console.log(`- 일간: ${parsed.dayMaster} (${parsed.dayMasterElement})`);
  console.log(`- 일주: ${parsed.dayPillar.heavenlyStem}${parsed.dayPillar.earthlyBranch}`);
  console.log(`\n상세 정보:`);
  console.log(formatSajuInfo(parsed));
  
  // 검증
  const isCorrect = parsed.dayMaster === '정' && parsed.dayMasterElement === '화';
  console.log(`\n✅ 검증: ${isCorrect ? '정확함 (일간: 정화)' : '오류 (일간이 잘못됨)'}`);
}
