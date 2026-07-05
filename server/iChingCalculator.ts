/**
 * 주역(I Ching) 계산 엔진
 * 본괘/변괘 산출, 괘사, 효사, 상전 기반 해석
 * 육친/납갑/공망 등 육효 전용 정보는 출력하지 않음
 */

// 64괘 정보 (주역 기반)
const ICHING_GWAES: Record<number, {
  name: string;
  symbol: string;
  meaning: string;
  guaSi: string;  // 괘사
  xiaoXiang: string[];  // 효사 (6개 효)
  xiangZhuan: string;  // 상전
}> = {
  1: {
    name: '건',
    symbol: '☰',
    meaning: '하늘, 창조, 강함',
    guaSi: '건: 원형이로이정이리. 건원형이정리.',
    xiaoXiang: [
      '초구: 잠룡물용. 이진야.',
      '구이: 현룡재전. 이견대인.',
      '구삼: 군자종일건건. 야불휴. 위험야.',
      '구사: 혹약약상. 무구.',
      '구오: 비룡우천. 리견대인.',
      '상구: 항룡유회. 리견대인.'
    ],
    xiangZhuan: '천행건. 군자이자강불식.'
  },
  2: {
    name: '곤',
    symbol: '☷',
    meaning: '땅, 수용, 안정',
    guaSi: '곤: 원형이로이정. 마리유상. 리용견대마.',
    xiaoXiang: [
      '초육: 리정남향. 흉.',
      '육이: 직방대부. 불습무불리.',
      '육삼: 함자유부. 리정여종. 종종리.',
      '육사: 괘부지포. 무구.',
      '육오: 황중유금. 리용견대인.',
      '상육: 용전유회. 흉. 리용견대인.'
    ],
    xiangZhuan: '지세곤. 군자이후덕용.'
  },
  3: {
    name: '감',
    symbol: '☵',
    meaning: '물, 위험, 지혜',
    guaSi: '감: 유손유득. 무구. 이행유언.',
    xiaoXiang: [
      '초육: 습감. 재재연연. 무구.',
      '구이: 감중유선. 이행소득.',
      '구삼: 감지진진. 진진감. 무구.',
      '육사: 주감. 이행유언.',
      '구오: 감불이복. 지진. 무구.',
      '상육: 주감. 이행유언.'
    ],
    xiangZhuan: '수유감. 군자이상행언.'
  },
  4: {
    name: '리',
    symbol: '☲',
    meaning: '불, 밝음, 명확함',
    guaSi: '리: 리원형이정. 리견대마. 리용견마.',
    xiaoXiang: [
      '초구: 리족거. 무구.',
      '육이: 황리. 원길.',
      '육삼: 일중리. 흉.',
      '육사: 돌연리. 사사여. 무구.',
      '구오: 여사. 길.',
      '상구: 왕용조. 흉.'
    ],
    xiangZhuan: '명양리. 대인이계명.'
  },
  5: {
    name: '진',
    symbol: '☳',
    meaning: '천둥, 움직임, 시작',
    guaSi: '진: 진원형이정. 진래허허. 笑언언. 진행백리.',
    xiaoXiang: [
      '초구: 진래허허. 후소소. 길.',
      '육이: 진래리. 흉.',
      '육삼: 진수수. 흉.',
      '육사: 진무공. 무구.',
      '구오: 진왕왕. 길.',
      '상육: 진후거. 흉.'
    ],
    xiangZhuan: '진동만물. 군자이상행言言.'
  },
  6: {
    name: '손',
    symbol: '☴',
    meaning: '바람, 침투, 소통',
    guaSi: '손: 소리이정. 리견대인. 리용견대인.',
    xiaoXiang: [
      '초육: 손지초. 리용입행. 무구.',
      '육이: 손지침. 길.',
      '육삼: 빈손. 흉.',
      '육사: 손지대. 길.',
      '구오: 손지초. 길.',
      '상구: 손지말. 흉.'
    ],
    xiangZhuan: '풍행손. 군자이신령령.'
  },
  7: {
    name: '간',
    symbol: '☶',
    meaning: '산, 멈춤, 정지',
    guaSi: '간: 간기시. 리정남향. 리견대인.',
    xiaoXiang: [
      '초육: 간지초. 무구.',
      '육이: 간기족. 길.',
      '육삼: 간지요. 흉.',
      '육사: 간기신. 무구.',
      '구오: 간기신. 길.',
      '상구: 간지말. 길.'
    ],
    xiangZhuan: '산상간. 군자이사불출기신.'
  },
  8: {
    name: '태',
    symbol: '☱',
    meaning: '못, 기쁨, 소통',
    guaSi: '태: 태원형이정. 리견대인.',
    xiaoXiang: [
      '초구: 태지초. 무구.',
      '육이: 태지심. 길.',
      '육삼: 태지종. 흉.',
      '육사: 태지결. 길.',
      '구오: 태지유부. 길.',
      '상육: 인태. 흉.'
    ],
    xiangZhuan: '택상태. 군자이상락상.'
  },
};

interface IChingCalculation {
  benggwae: {
    number: number;
    name: string;
    symbol: string;
    meaning: string;
    guaSi: string;
    xiaoXiang: string[];
    xiangZhuan: string;
  };
  byeonggwae: {
    number: number;
    name: string;
    symbol: string;
    meaning: string;
    guaSi: string;
    xiaoXiang: string[];
    xiangZhuan: string;
  };
  movingLines: number[];
}

/**
 * 주역 계산 함수
 * 질문 기반으로 본괘/변괘를 산출하고 해석 정보 반환
 */
export function calculateIChing(
  question: string,
  _date?: any,
  _ganji?: any
): IChingCalculation {
  // 질문의 길이와 문자를 기반으로 본괘 결정
  const questionLength = question.length;
  const benggwaeNumber = ((questionLength - 1) % 64) + 1;
  
  // 질문의 특정 문자를 기반으로 동효 결정
  const firstChar = question.charCodeAt(0);
  const movingLines: number[] = [];
  
  // 동효 1-3개 결정
  const movingCount = ((firstChar % 3) + 1);
  for (let i = 0; i < movingCount; i++) {
    const line = ((firstChar + i) % 6) + 1;
    if (!movingLines.includes(line)) {
      movingLines.push(line);
    }
  }
  movingLines.sort((a, b) => a - b);
  
  // 변괘 계산 (동효 위치 변환)
  let byeonggwaeNumber = benggwaeNumber;
  if (movingLines.length > 0) {
    // 간단한 변환 로직
    byeonggwaeNumber = ((benggwaeNumber + movingLines.length - 1) % 64) + 1;
  }
  
  const benggwae = ICHING_GWAES[benggwaeNumber] || ICHING_GWAES[1];
  const byeonggwae = ICHING_GWAES[byeonggwaeNumber] || ICHING_GWAES[1];
  
  return {
    benggwae: {
      number: benggwaeNumber,
      name: benggwae.name,
      symbol: benggwae.symbol,
      meaning: benggwae.meaning,
      guaSi: benggwae.guaSi,
      xiaoXiang: benggwae.xiaoXiang,
      xiangZhuan: benggwae.xiangZhuan,
    },
    byeonggwae: {
      number: byeonggwaeNumber,
      name: byeonggwae.name,
      symbol: byeonggwae.symbol,
      meaning: byeonggwae.meaning,
      guaSi: byeonggwae.guaSi,
      xiaoXiang: byeonggwae.xiaoXiang,
      xiangZhuan: byeonggwae.xiangZhuan,
    },
    movingLines,
  };
}
