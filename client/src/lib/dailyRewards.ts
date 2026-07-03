/* 일일/14일 보상 시스템
 * 자정마다 충전별 3개 자동 지급 + 14일 로그인 보상
 */

export interface DailyRewardState {
  lastClaimedDate: string; // YYYY-MM-DD
  consecutiveDays: number;
  loginDates: string[];
}

const DAILY_REWARD_KEY = 'luna_daily_reward';
const DAILY_REWARD_AMOUNT = 3;
const LOGIN_REWARD_MILESTONES = [1, 3, 7, 14]; // 1일, 3일, 7일, 14일

/**
 * 일일 보상 상태 초기화
 */
export function initializeDailyReward(): void {
  const existing = localStorage.getItem(DAILY_REWARD_KEY);
  if (!existing) {
    const state: DailyRewardState = {
      lastClaimedDate: new Date().toISOString().split('T')[0],
      consecutiveDays: 0,
      loginDates: [new Date().toISOString().split('T')[0]],
    };
    localStorage.setItem(DAILY_REWARD_KEY, JSON.stringify(state));
  }
}

/**
 * 오늘 보상을 받을 수 있는지 확인
 */
export function canClaimDailyReward(): boolean {
  const state = getRewardState();
  const today = new Date().toISOString().split('T')[0];
  return state.lastClaimedDate !== today;
}

/**
 * 일일 보상 청구
 */
export function claimDailyReward(): { amount: number; loginReward?: number } {
  const state = getRewardState();
  const today = new Date().toISOString().split('T')[0];

  if (state.lastClaimedDate === today) {
    return { amount: 0 }; // 이미 오늘 받음
  }

  // 연속 로그인 계산
  const lastDate = new Date(state.lastClaimedDate);
  const todayDate = new Date(today);
  const dayDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  let newConsecutiveDays = state.consecutiveDays;
  if (dayDiff === 1) {
    newConsecutiveDays += 1;
  } else if (dayDiff > 1) {
    newConsecutiveDays = 1; // 연속 끊김
  }

  // 14일 보상 확인
  let loginReward = 0;
  if (LOGIN_REWARD_MILESTONES.includes(newConsecutiveDays)) {
    loginReward = newConsecutiveDays * 2; // 1일=2개, 3일=6개, 7일=14개, 14일=28개
  }

  const newState: DailyRewardState = {
    lastClaimedDate: today,
    consecutiveDays: newConsecutiveDays,
    loginDates: [...state.loginDates, today],
  };

  localStorage.setItem(DAILY_REWARD_KEY, JSON.stringify(newState));

  return {
    amount: DAILY_REWARD_AMOUNT,
    loginReward: loginReward > 0 ? loginReward : undefined,
  };
}

/**
 * 보상 상태 조회
 */
export function getRewardState(): DailyRewardState {
  const state = localStorage.getItem(DAILY_REWARD_KEY);
  if (!state) {
    initializeDailyReward();
    return getRewardState();
  }
  return JSON.parse(state) as DailyRewardState;
}

/**
 * 연속 로그인 일수 조회
 */
export function getConsecutiveDays(): number {
  return getRewardState().consecutiveDays;
}

/**
 * 다음 보상 마일스톤 조회
 */
export function getNextMilestone(): number {
  const consecutive = getConsecutiveDays();
  const nextMilestone = LOGIN_REWARD_MILESTONES.find((m) => m > consecutive);
  return nextMilestone || 14;
}

/**
 * 보상 리셋 (테스트용)
 */
export function resetDailyReward(): void {
  localStorage.removeItem(DAILY_REWARD_KEY);
  initializeDailyReward();
}
