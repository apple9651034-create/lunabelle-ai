/* 타로 카드 해석 유틸리티
 * AI 상담 중 추천질문 선택 시 타로 카드 1장 추가 뽑아서 함께 해석
 */

import { fullTarotDeck, drawCards, TarotCard } from './tarotCards';

export interface TarotReading {
  card: any;
  interpretation: string;
  question: string;
}

export function generateTarotReadingForQuestion(question: string): TarotReading {
  // 질문에 따라 타로 카드 1장 뽑기
  const { cards } = drawCards(1, fullTarotDeck);
  const card = cards[0];
  
  // 카드 해석 생성
  const cardInterpretation = `${card.name}\n정방향: ${card.meaning}\n역방향: ${card.reversed}`;
  
  // 질문과 카드를 연결한 해석 생성
  const contextualInterpretation = generateContextualInterpretation(question, card, cardInterpretation);
  
  return {
    card,
    interpretation: contextualInterpretation,
    question,
  };
}

function generateContextualInterpretation(question: string, card: any, cardInterpretation: string): string {
  // 질문 유형에 따른 타로 해석 커스터마이징
  const questionType = classifyQuestion(question);
  
  const interpretations: Record<string, string> = {
    career:       `당신의 커리어 관련 질문에 대해 "${card.name}" 카드가 나왔습니다.\n\n${cardInterpretation}\n\n이 카드는 당신의 직업적 성장과 발전에 대해 다음과 같은 메시지를 전달합니다:\n- 현재 상황: ${card.meaning.split('\n')[0]}\n- 조언: 이 시기에는 ${getCareerAdvice(card.name)}을 중심으로 진행하시기를 권장합니다.`,
    
    love:       `당신의 연애 관련 질문에 대해 "${card.name}" 카드가 나왔습니다.\n\n${cardInterpretation}\n\n이 카드는 당신의 감정과 관계에 대해 다음과 같은 메시지를 전달합니다:\n- 현재 감정: ${card.meaning.split('\n')[0]}\n- 조언: 이 시기에는 ${getLoveAdvice(card.name)}이 중요합니다.`,
    
    fortune:       `당신의 재운 관련 질문에 대해 "${card.name}" 카드가 나왔습니다.\n\n${cardInterpretation}\n\n이 카드는 당신의 재정 상황에 대해 다음과 같은 메시지를 전달합니다:\n- 현재 운세: ${card.meaning.split('\n')[0]}\n- 조언: ${getFortuneAdvice(card.name)}`,
    
    health: `당신의 건강 관련 질문에 대해 "${card.name}" 카드가 나왔습니다.\n\n${cardInterpretation}\n\n이 카드는 당신의 건강과 웰빙에 대해 다음과 같은 메시지를 전달합니다:\n- 현재 상태: ${card.meaning.split('\n')[0]}\n- 조언: ${getHealthAdvice(card.name)}`,
    general: `당신의 질문에 대해 "${card.name}" 카드가 나왔습니다.\n\n${cardInterpretation}\n\n이 카드가 전달하는 메시지:\n${card.meaning}`,
  };
  
  return interpretations[questionType] || interpretations.general;
}

function classifyQuestion(question: string): string {
  const careerKeywords = ['직업', '일', '커리어', '사업', '취업', '승진', '회사', '일자리'];
  const loveKeywords = ['연애', '결혼', '사랑', '짝', '배우자', '관계', '인연', '애정'];
  const fortuneKeywords = ['돈', '재운', '재물', '금전', '수입', '투자', '부', '경제'];
  const healthKeywords = ['건강', '병', '질병', '운동', '체력', '정신', '스트레스'];
  
  const lowerQuestion = question.toLowerCase();
  
  if (careerKeywords.some(k => lowerQuestion.includes(k))) return 'career';
  if (loveKeywords.some(k => lowerQuestion.includes(k))) return 'love';
  if (fortuneKeywords.some(k => lowerQuestion.includes(k))) return 'fortune';
  if (healthKeywords.some(k => lowerQuestion.includes(k))) return 'health';
  
  return 'general';
}

function getCareerAdvice(cardName: string): string {
  const advices: Record<string, string> = {
    'The Magician': '당신의 능력과 기술을 최대한 활용하세요',
    'The Hermit': '신중한 계획과 성찰이 필요합니다',
    'The Wheel of Fortune': '새로운 기회가 찾아올 시기입니다',
    'The Sun': '성공과 번영의 시기입니다',
    'The Star': '꿈과 목표를 향해 나아가세요',
  };
  
  return advices[cardName] || '현재의 상황을 긍정적으로 받아들이고 나아가세요';
}

function getLoveAdvice(cardName: string): string {
  const advices: Record<string, string> = {
    'The Lovers': '진정한 연결과 이해가 중요합니다',
    'Two of Cups': '상호 존중과 신뢰를 바탕으로 하세요',
    'The Hermit': '혼자만의 시간을 통해 자신을 알아가세요',
    'The Sun': '밝고 행복한 관계를 기대할 수 있습니다',
    'The Tower': '변화를 받아들이고 새로운 시작을 준비하세요',
  };
  
  return advices[cardName] || '마음 속의 진정한 감정을 따르세요';
}

function getFortuneAdvice(cardName: string): string {
  const advices: Record<string, string> = {
    'The Magician': '당신의 능력으로 부를 창출할 수 있습니다',
    'The Wheel of Fortune': '재운이 호전될 시기입니다',
    'The Sun': '재정적 성공이 예상됩니다',
    'The Hermit': '신중한 투자와 저축이 필요합니다',
    'Ten of Pentacles': '장기적인 재정 안정을 기대할 수 있습니다',
  };
  
  return advices[cardName] || '현명한 재정 관리가 중요합니다';
}

function getHealthAdvice(cardName: string): string {
  const advices: Record<string, string> = {
    'The Sun': '건강한 상태를 유지하세요',
    'The Hermit': '휴식과 명상이 필요합니다',
    'Strength': '신체와 정신의 균형을 맞추세요',
    'The Wheel of Fortune': '건강 상태가 개선될 것입니다',
    'The Tower': '급격한 변화에 대비하세요',
  };
  
  return advices[cardName] || '건강한 생활습관을 유지하세요';
}
