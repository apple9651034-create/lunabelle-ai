/* 월간 운세 달력
 * 길일/흉일을 직관적으로 표시
 */

export interface DayFortune {
  date: number;
  dayOfWeek: number; // 0=일, 1=월, 2=화, 3=수, 4=목, 5=금, 6=토
  fortuneType: 'lucky' | 'neutral' | 'unlucky'; // 길일, 평일, 흉일
  fortuneLevel: number; // 1-5
  description: string;
  luckyColor?: string;
  luckyNumber?: number;
}

export function generateMonthlyFortune(year: number, month: number): DayFortune[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  
  const days: DayFortune[] = [];
  
  // 이전 달의 날짜들 (회색으로 표시)
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthDays = new Date(year, month - 1, 0).getDate();
    days.push({
      date: prevMonthDays - firstDayOfWeek + i + 1,
      dayOfWeek: i,
      fortuneType: 'neutral',
      fortuneLevel: 0,
      description: '',
    });
  }
  
  // 현재 달의 날짜들
  for (let date = 1; date <= daysInMonth; date++) {
    const dayOfWeek = (firstDayOfWeek + date - 1) % 7;
    const fortune = calculateDayFortune(year, month, date, dayOfWeek);
    days.push({
      date,
      dayOfWeek,
      ...fortune,
    });
  }
  
  // 다음 달의 날짜들 (회색으로 표시)
  const remainingDays = 42 - days.length; // 6주 * 7일
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      dayOfWeek: (firstDayOfWeek + daysInMonth + i - 1) % 7,
      fortuneType: 'neutral',
      fortuneLevel: 0,
      description: '',
    });
  }
  
  return days;
}

function calculateDayFortune(year: number, month: number, date: number, dayOfWeek: number): Omit<DayFortune, 'date' | 'dayOfWeek'> {
  // 천간지지 기반 길흉 계산
  const dayNumber = new Date(year, month - 1, date).getDate();
  const monthNumber = month;
  
  // 간단한 길흉 알고리즘 (실제로는 더 복잡한 계산 필요)
  const fortuneScore = (dayNumber + monthNumber + year) % 10;
  
  const luckyDays = [1, 3, 5, 8, 10, 13, 15, 18, 20, 23, 25, 28, 30];
  const unluckyDays = [2, 4, 6, 7, 9, 11, 12, 14, 16, 17, 19, 21, 22, 24, 26, 27, 29, 31];
  
  let fortuneType: 'lucky' | 'neutral' | 'unlucky' = 'neutral';
  let fortuneLevel = 2;
  let description = '평범한 날';
  let luckyColor = undefined;
  let luckyNumber = undefined;
  
  if (luckyDays.includes(dayNumber)) {
    fortuneType = 'lucky';
    fortuneLevel = Math.floor(Math.random() * 3) + 3; // 3-5
    description = getLuckyDescription(dayNumber);
    luckyColor = getLuckyColor(dayNumber);
    luckyNumber = getLuckyNumber(dayNumber);
  } else if (unluckyDays.includes(dayNumber)) {
    fortuneType = 'unlucky';
    fortuneLevel = Math.floor(Math.random() * 3) + 1; // 1-3
    description = getUnluckyDescription(dayNumber);
  }
  
  return {
    fortuneType,
    fortuneLevel,
    description,
    luckyColor,
    luckyNumber,
  };
}

function getLuckyDescription(day: number): string {
  const descriptions = [
    '매우 길한 날입니다',
    '새로운 시작에 좋은 날',
    '중요한 일을 시작하기 좋은 날',
    '운이 좋은 날',
    '모든 일이 잘 풀리는 날',
    '행운이 따르는 날',
  ];
  
  return descriptions[day % descriptions.length];
}

function getUnluckyDescription(day: number): string {
  const descriptions = [
    '신중한 행동이 필요한 날',
    '중요한 결정은 피하는 것이 좋은 날',
    '조용히 지내는 것이 좋은 날',
    '조심스러운 날',
  ];
  
  return descriptions[day % descriptions.length];
}

function getLuckyColor(day: number): string {
  const colors = ['빨강', '노랑', '파랑', '초록', '보라', '주황'];
  return colors[day % colors.length];
}

function getLuckyNumber(day: number): number {
  const numbers = [1, 3, 5, 7, 8, 9];
  return numbers[day % numbers.length];
}

export function getWeekdayName(dayOfWeek: number): string {
  const names = ['일', '월', '화', '수', '목', '금', '토'];
  return names[dayOfWeek];
}

export function getFortuneColor(fortuneType: 'lucky' | 'neutral' | 'unlucky'): string {
  const colors = {
    lucky: 'oklch(0.65 0.25 120)', // 초록
    neutral: 'oklch(0.55 0.1 290)', // 회색
    unlucky: 'oklch(0.60 0.25 20)', // 빨강
  };
  
  return colors[fortuneType];
}

export function getFortuneEmoji(fortuneType: 'lucky' | 'neutral' | 'unlucky'): string {
  const emojis = {
    lucky: '✨',
    neutral: '○',
    unlucky: '⚠️',
  };
  
  return emojis[fortuneType];
}
