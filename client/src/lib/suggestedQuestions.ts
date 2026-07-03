/* 분석 결과 기반 추천질문 생성
 * 사주/타로 분석 결과에 맞춘 AI 상담 시작 질문 제공
 */

export interface SuggestedQuestion {
  text: string;
  emoji: string;
  category: string;
}

// 사주 분석 결과 기반 추천질문
export function generateSajuQuestions(sajuResult: any): SuggestedQuestion[] {
  const personality = sajuResult?.personality || '';
  const luck = sajuResult?.luck || '';
  
  const questions: SuggestedQuestion[] = [
    {
      text: '나의 성격 특성을 더 자세히 알고 싶어요',
      emoji: '🔍',
      category: '성격',
    },
    {
      text: '올해 운세는 어떻게 될까요?',
      emoji: '📅',
      category: '운세',
    },
    {
      text: '직업과 커리어에 대해 조언해주세요',
      emoji: '💼',
      category: '커리어',
    },
    {
      text: '연애와 결혼운은 어떨까요?',
      emoji: '💕',
      category: '연애',
    },
    {
      text: '재물운과 금전운을 알고 싶어요',
      emoji: '💰',
      category: '재물',
    },
    {
      text: '건강운과 주의할 점을 알려주세요',
      emoji: '🏥',
      category: '건강',
    },
  ];

  return questions;
}

// 타로 분석 결과 기반 추천질문
export function generateTarotQuestions(tarotResult: any): SuggestedQuestion[] {
  const spreadName = tarotResult?.spreadName || '';
  
  const questions: SuggestedQuestion[] = [
    {
      text: '이 카드들이 의미하는 구체적인 행동은?',
      emoji: '⚡',
      category: '행동',
    },
    {
      text: '앞으로의 흐름과 변화는 어떻게 될까요?',
      emoji: '🌊',
      category: '미래',
    },
    {
      text: '이 상황에서 주의할 점이 있나요?',
      emoji: '⚠️',
      category: '주의',
    },
    {
      text: '더 깊은 해석을 해주세요',
      emoji: '🔮',
      category: '심화',
    },
    {
      text: '이 카드가 나에게 주는 메시지는?',
      emoji: '💬',
      category: '메시지',
    },
    {
      text: '다른 관점에서의 해석도 궁금해요',
      emoji: '🎯',
      category: '관점',
    },
  ];

  return questions;
}

// 육효 분석 결과 기반 추천질문
export function generateYukQuestions(yukResult: any): SuggestedQuestion[] {
  const questions: SuggestedQuestion[] = [
    {
      text: '이 육효가 나의 상황을 어떻게 설명하나요?',
      emoji: '📖',
      category: '해석',
    },
    {
      text: '변효가 의미하는 바는 무엇인가요?',
      emoji: '🔄',
      category: '변화',
    },
    {
      text: '앞으로 어떤 결과가 나올까요?',
      emoji: '🎲',
      category: '결과',
    },
    {
      text: '지금 취해야 할 행동은?',
      emoji: '🚀',
      category: '행동',
    },
    {
      text: '이 육효의 길한 의미를 알려주세요',
      emoji: '✨',
      category: '길함',
    },
    {
      text: '주의해야 할 점이 있나요?',
      emoji: '🛡️',
      category: '주의',
    },
  ];

  return questions;
}
