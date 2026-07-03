/* 충전별 관리 시스템
 * 로컬스토리지 기반 충전별 차감 및 관리
 */

const CHARGE_STORAGE_KEY = 'luna_charges';
const INITIAL_CHARGES = 5;

export interface ChargeState {
  remaining: number;
  lastUpdated: string;
}

/**
 * 초기 충전별 설정
 */
export function initializeCharges(): void {
  const existing = localStorage.getItem(CHARGE_STORAGE_KEY);
  if (!existing) {
    const state: ChargeState = {
      remaining: INITIAL_CHARGES,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(CHARGE_STORAGE_KEY, JSON.stringify(state));
  }
}

/**
 * 현재 충전별 조회
 */
export function getCharges(): number {
  const state = localStorage.getItem(CHARGE_STORAGE_KEY);
  if (!state) {
    initializeCharges();
    return INITIAL_CHARGES;
  }
  const parsed = JSON.parse(state) as ChargeState;
  return parsed.remaining;
}

/**
 * 충전별 차감
 */
export function deductCharge(): boolean {
  const current = getCharges();
  if (current <= 0) {
    return false; // 충전별 부족
  }

  const state: ChargeState = {
    remaining: current - 1,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(CHARGE_STORAGE_KEY, JSON.stringify(state));
  
  // 로컬스토리지 변경 이벤트 발생 (다른 탭/창에서도 감지)
  window.dispatchEvent(new CustomEvent('chargesUpdated', { detail: { remaining: state.remaining } }));
  
  return true;
}

/**
 * 충전별 추가 (충전)
 */
export function addCharges(amount: number): void {
  const current = getCharges();
  const state: ChargeState = {
    remaining: current + amount,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(CHARGE_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('chargesUpdated', { detail: { remaining: state.remaining } }));
}

/**
 * 충전별 초기화 (테스트용)
 */
export function resetCharges(): void {
  const state: ChargeState = {
    remaining: INITIAL_CHARGES,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(CHARGE_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('chargesUpdated', { detail: { remaining: INITIAL_CHARGES } }));
}

/**
 * 충전별 부족 여부 확인
 */
export function isChargesEmpty(): boolean {
  return getCharges() <= 0;
}
