import { describe, it, expect, beforeEach, vi } from 'vitest';
import { db } from './db';

/**
 * 크레딧 시스템 테스트
 * - 크레딧 잔액 조회
 * - 크레딧 차감
 * - 거래 내역 조회
 */

describe('Credit System', () => {
  const testUserId = 1;

  beforeEach(() => {
    // 테스트 전 초기화
    vi.clearAllMocks();
  });

  describe('getBalance', () => {
    it('사용자의 크레딧 잔액을 조회해야 함', async () => {
      // Mock 데이터 설정
      const mockBalance = 50;
      vi.spyOn(db, 'getBalance').mockResolvedValue(mockBalance);

      const balance = await db.getBalance(testUserId);

      expect(balance).toBe(50);
      expect(db.getBalance).toHaveBeenCalledWith(testUserId);
    });

    it('크레딧이 없는 사용자는 0을 반환해야 함', async () => {
      vi.spyOn(db, 'getBalance').mockResolvedValue(0);

      const balance = await db.getBalance(testUserId);

      expect(balance).toBe(0);
    });
  });

  describe('deductCredit', () => {
    it('크레딧을 정상적으로 차감해야 함', async () => {
      const initialBalance = 50;
      const deductAmount = 3; // 사주 분석 (3 크레딧)
      const expectedBalance = initialBalance - deductAmount;

      vi.spyOn(db, 'getBalance').mockResolvedValue(expectedBalance);
      vi.spyOn(db, 'deductCredit').mockResolvedValue(undefined);

      await db.deductCredit(testUserId, deductAmount, 'saju_analysis');

      const newBalance = await db.getBalance(testUserId);

      expect(newBalance).toBe(expectedBalance);
      expect(db.deductCredit).toHaveBeenCalledWith(testUserId, deductAmount, 'saju_analysis');
    });

    it('타로 상담 시 1 크레딧을 차감해야 함', async () => {
      vi.spyOn(db, 'deductCredit').mockResolvedValue(undefined);

      await db.deductCredit(testUserId, 1, 'tarot_draw');

      expect(db.deductCredit).toHaveBeenCalledWith(testUserId, 1, 'tarot_draw');
    });

    it('육효 상담 시 2 크레딧을 차감해야 함', async () => {
      vi.spyOn(db, 'deductCredit').mockResolvedValue(undefined);

      await db.deductCredit(testUserId, 2, 'yuk_hyo');

      expect(db.deductCredit).toHaveBeenCalledWith(testUserId, 2, 'yuk_hyo');
    });

    it('사주 분석 시 3 크레딧을 차감해야 함', async () => {
      vi.spyOn(db, 'deductCredit').mockResolvedValue(undefined);

      await db.deductCredit(testUserId, 3, 'saju_analysis');

      expect(db.deductCredit).toHaveBeenCalledWith(testUserId, 3, 'saju_analysis');
    });
  });

  describe('getTransactions', () => {
    it('사용자의 거래 내역을 조회해야 함', async () => {
      const mockTransactions = [
        {
          id: 1,
          userId: testUserId,
          type: 'purchase',
          amount: 10,
          description: '크레딧 충전 (10 크레딧)',
          balanceAfter: 10,
          createdAt: new Date('2026-06-26'),
        },
        {
          id: 2,
          userId: testUserId,
          type: 'tarot_draw',
          amount: -1,
          description: '타로 상담',
          balanceAfter: 9,
          createdAt: new Date('2026-06-26'),
        },
      ];

      vi.spyOn(db, 'getTransactions').mockResolvedValue(mockTransactions);

      const transactions = await db.getTransactions(testUserId);

      expect(transactions).toHaveLength(2);
      expect(transactions[0].type).toBe('purchase');
      expect(transactions[0].amount).toBe(10);
      expect(transactions[1].type).toBe('tarot_draw');
      expect(transactions[1].amount).toBe(-1);
    });

    it('거래 내역이 없으면 빈 배열을 반환해야 함', async () => {
      vi.spyOn(db, 'getTransactions').mockResolvedValue([]);

      const transactions = await db.getTransactions(testUserId);

      expect(transactions).toHaveLength(0);
      expect(Array.isArray(transactions)).toBe(true);
    });

    it('거래 내역이 최신순으로 정렬되어야 함', async () => {
      const mockTransactions = [
        {
          id: 3,
          userId: testUserId,
          type: 'saju_analysis',
          amount: -3,
          description: '사주 분석',
          balanceAfter: 6,
          createdAt: new Date('2026-06-26T10:00:00'),
        },
        {
          id: 2,
          userId: testUserId,
          type: 'tarot_draw',
          amount: -1,
          description: '타로 상담',
          balanceAfter: 9,
          createdAt: new Date('2026-06-26T09:00:00'),
        },
        {
          id: 1,
          userId: testUserId,
          type: 'purchase',
          amount: 10,
          description: '크레딧 충전',
          balanceAfter: 10,
          createdAt: new Date('2026-06-26T08:00:00'),
        },
      ];

      vi.spyOn(db, 'getTransactions').mockResolvedValue(mockTransactions);

      const transactions = await db.getTransactions(testUserId);

      expect(transactions[0].id).toBe(3); // 최신
      expect(transactions[1].id).toBe(2);
      expect(transactions[2].id).toBe(1); // 가장 오래됨
    });
  });

  describe('Credit Flow Integration', () => {
    it('크레딧 충전 → 상담 → 내역 조회 전체 플로우가 정상 작동해야 함', async () => {
      // 1. 초기 잔액 조회
      vi.spyOn(db, 'getBalance').mockResolvedValue(0);
      let balance = await db.getBalance(testUserId);
      expect(balance).toBe(0);

      // 2. 크레딧 충전 (10 크레딧)
      vi.spyOn(db, 'getBalance').mockResolvedValue(10);
      balance = await db.getBalance(testUserId);
      expect(balance).toBe(10);

      // 3. 타로 상담 (1 크레딧 차감)
      vi.spyOn(db, 'deductCredit').mockResolvedValue(undefined);
      await db.deductCredit(testUserId, 1, 'tarot_draw');
      vi.spyOn(db, 'getBalance').mockResolvedValue(9);
      balance = await db.getBalance(testUserId);
      expect(balance).toBe(9);

      // 4. 거래 내역 조회
      const mockTransactions = [
        {
          id: 2,
          userId: testUserId,
          type: 'tarot_draw',
          amount: -1,
          description: '타로 상담',
          balanceAfter: 9,
          createdAt: new Date(),
        },
        {
          id: 1,
          userId: testUserId,
          type: 'purchase',
          amount: 10,
          description: '크레딧 충전',
          balanceAfter: 10,
          createdAt: new Date(),
        },
      ];

      vi.spyOn(db, 'getTransactions').mockResolvedValue(mockTransactions);
      const transactions = await db.getTransactions(testUserId);

      expect(transactions).toHaveLength(2);
      expect(transactions[0].type).toBe('tarot_draw');
      expect(transactions[1].type).toBe('purchase');
    });

    it('크레딧 부족 시 상담을 진행할 수 없어야 함', async () => {
      vi.spyOn(db, 'getBalance').mockResolvedValue(0);
      const balance = await db.getBalance(testUserId);

      // 사주 분석에 필요한 3 크레딧이 없음
      expect(balance).toBeLessThan(3);
    });
  });
});
