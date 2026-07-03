/**
 * 복비 결제 처리
 * 사용자의 보유 크레딧에서 복비 금액을 차감하거나 결제창을 표시
 */

export interface UserCredit {
  id: string;
  balance: number;
  lastUpdated: Date;
}

const CREDIT_STORAGE_KEY = 'user_credit';
const DEFAULT_CREDIT = 10000; // 기본 크레딧 10,000원

/**
 * 사용자 크레딧 조회
 */
export function getUserCredit(): UserCredit {
  try {
    const stored = localStorage.getItem(CREDIT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('크레딧 조회 실패:', e);
  }

  // 초기 크레딧 설정
  const initialCredit: UserCredit = {
    id: `user_${Date.now()}`,
    balance: DEFAULT_CREDIT,
    lastUpdated: new Date(),
  };

  localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(initialCredit));
  return initialCredit;
}

/**
 * 크레딧 차감
 */
export function deductCredit(amount: number): { success: boolean; newBalance: number; message: string } {
  const credit = getUserCredit();

  if (credit.balance < amount) {
    return {
      success: false,
      newBalance: credit.balance,
      message: `크레딧이 부족합니다. 필요: ${amount}원, 보유: ${credit.balance}원`,
    };
  }

  const updatedCredit: UserCredit = {
    ...credit,
    balance: credit.balance - amount,
    lastUpdated: new Date(),
  };

  localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(updatedCredit));

  return {
    success: true,
    newBalance: updatedCredit.balance,
    message: `${amount}원이 차감되었습니다. 남은 크레딧: ${updatedCredit.balance}원`,
  };
}

/**
 * 크레딧 충전
 */
export function addCredit(amount: number): UserCredit {
  const credit = getUserCredit();

  const updatedCredit: UserCredit = {
    ...credit,
    balance: credit.balance + amount,
    lastUpdated: new Date(),
  };

  localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(updatedCredit));
  return updatedCredit;
}

/**
 * 복비 결제 처리
 */
export async function processBlessingPayment(
  blessingAmount: number,
  wishContent: string
): Promise<{ success: boolean; message: string; newBalance?: number }> {
  try {
    // 크레딧 차감 시도
    const result = deductCredit(blessingAmount);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    // 결제 성공 로그 (서버에 저장할 수 있음)
    console.log(`복비 결제 완료: ${blessingAmount}원, 소원: ${wishContent}`);

    return {
      success: true,
      message: `복비 ${blessingAmount}원으로 소원이 올라갔습니다!`,
      newBalance: result.newBalance,
    };
  } catch (error) {
    console.error('복비 결제 오류:', error);
    return {
      success: false,
      message: '결제 처리 중 오류가 발생했습니다.',
    };
  }
}
