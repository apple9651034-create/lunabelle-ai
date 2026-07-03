/* 충전별 내역 관리
 * 차감/충전 기록 저장 및 조회
 */

export interface ChargeTransaction {
  id: string;
  type: 'deduct' | 'charge' | 'daily_reward' | 'login_reward';
  amount: number;
  reason: string;
  timestamp: string;
}

const CHARGE_HISTORY_KEY = 'luna_charge_history';

/**
 * 내역 초기화
 */
export function initializeChargeHistory(): void {
  const existing = localStorage.getItem(CHARGE_HISTORY_KEY);
  if (!existing) {
    localStorage.setItem(CHARGE_HISTORY_KEY, JSON.stringify([]));
  }
}

/**
 * 내역 추가
 */
export function addTransaction(
  type: ChargeTransaction['type'],
  amount: number,
  reason: string
): void {
  const history = getHistory();
  const transaction: ChargeTransaction = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    amount,
    reason,
    timestamp: new Date().toISOString(),
  };
  history.push(transaction);
  localStorage.setItem(CHARGE_HISTORY_KEY, JSON.stringify(history));
}

/**
 * 내역 조회
 */
export function getHistory(): ChargeTransaction[] {
  const history = localStorage.getItem(CHARGE_HISTORY_KEY);
  if (!history) {
    initializeChargeHistory();
    return [];
  }
  return JSON.parse(history) as ChargeTransaction[];
}

/**
 * 최근 N개 내역 조회
 */
export function getRecentHistory(limit: number = 20): ChargeTransaction[] {
  const history = getHistory();
  return history.slice(-limit).reverse();
}

/**
 * 타입별 내역 필터링
 */
export function getHistoryByType(type: ChargeTransaction['type']): ChargeTransaction[] {
  return getHistory().filter((t) => t.type === type);
}

/**
 * 오늘의 내역 조회
 */
export function getTodayHistory(): ChargeTransaction[] {
  const today = new Date().toISOString().split('T')[0];
  return getHistory().filter((t) => t.timestamp.startsWith(today));
}

/**
 * 내역 삭제 (테스트용)
 */
export function clearHistory(): void {
  localStorage.setItem(CHARGE_HISTORY_KEY, JSON.stringify([]));
}
