import { describe, it, expect } from 'vitest';
import { parseSajuChart, formatSajuInfo } from './sajuParser';

describe('SajuParser', () => {
  describe('parseSajuChart', () => {
    it('should correctly parse "정사 / 정미 / 정축 / 갑진"', () => {
      const chart = '정사 / 정미 / 정축 / 갑진';
      const result = parseSajuChart(chart);
      
      expect(result).not.toBeNull();
      expect(result?.dayMaster).toBe('정');
      expect(result?.dayMasterElement).toBe('화');
      expect(result?.dayPillar.heavenlyStem).toBe('정');
      expect(result?.dayPillar.earthlyBranch).toBe('축');
    });

    it('should correctly identify day master as the heavenly stem of day pillar', () => {
      const chart = '정사 / 정미 / 정축 / 갑진';
      const result = parseSajuChart(chart);
      
      // 일간은 일주(정축)의 천간(정)이어야 함
      expect(result?.dayMaster).toBe('정');
      // 절대 갑이 아님
      expect(result?.dayMaster).not.toBe('갑');
    });

    it('should parse all four pillars correctly', () => {
      const chart = '정사 / 정미 / 정축 / 갑진';
      const result = parseSajuChart(chart);
      
      expect(result?.yearPillar.heavenlyStem).toBe('정');
      expect(result?.yearPillar.earthlyBranch).toBe('사');
      
      expect(result?.monthPillar.heavenlyStem).toBe('정');
      expect(result?.monthPillar.earthlyBranch).toBe('미');
      
      expect(result?.dayPillar.heavenlyStem).toBe('정');
      expect(result?.dayPillar.earthlyBranch).toBe('축');
      
      expect(result?.timePillar.heavenlyStem).toBe('갑');
      expect(result?.timePillar.earthlyBranch).toBe('진');
    });

    it('should handle different separator formats', () => {
      const chart1 = '정사 / 정미 / 정축 / 갑진';
      const chart2 = '정사／정미／정축／갑진';
      
      const result1 = parseSajuChart(chart1);
      const result2 = parseSajuChart(chart2);
      
      expect(result1?.dayMaster).toBe(result2?.dayMaster);
      expect(result1?.dayMaster).toBe('정');
    });

    it('should return null for invalid input', () => {
      const invalidChart = '갑 / 을 / 병';
      const result = parseSajuChart(invalidChart);
      
      expect(result).toBeNull();
    });

    it('should correctly identify element for each heavenly stem', () => {
      const testCases = [
        { chart: '갑자 / 갑자 / 갑자 / 갑자', expectedElement: '목' },
        { chart: '을자 / 을자 / 을자 / 을자', expectedElement: '목' },
        { chart: '병자 / 병자 / 병자 / 병자', expectedElement: '화' },
        { chart: '정자 / 정자 / 정자 / 정자', expectedElement: '화' },
        { chart: '무자 / 무자 / 무자 / 무자', expectedElement: '토' },
        { chart: '기자 / 기자 / 기자 / 기자', expectedElement: '토' },
        { chart: '경자 / 경자 / 경자 / 경자', expectedElement: '금' },
        { chart: '신자 / 신자 / 신자 / 신자', expectedElement: '금' },
        { chart: '임자 / 임자 / 임자 / 임자', expectedElement: '수' },
        { chart: '계자 / 계자 / 계자 / 계자', expectedElement: '수' },
      ];
      
      testCases.forEach(({ chart, expectedElement }) => {
        const result = parseSajuChart(chart);
        expect(result?.dayMasterElement).toBe(expectedElement);
      });
    });
  });

  describe('formatSajuInfo', () => {
    it('should format saju info correctly', () => {
      const chart = '정사 / 정미 / 정축 / 갑진';
      const parsed = parseSajuChart(chart);
      
      expect(parsed).not.toBeNull();
      
      if (parsed) {
        const formatted = formatSajuInfo(parsed);
        
        expect(formatted).toContain('정사 / 정미 / 정축 / 갑진');
        expect(formatted).toContain('일간(日干): 정(화)');
        expect(formatted).toContain('일주(日柱): 정축');
      }
    });
  });

  describe('Critical Test: 1977.07.19 명식', () => {
    it('should correctly identify 정화(丁火) as day master, NOT 갑목(甲木)', () => {
      const chart = '정사 / 정미 / 정축 / 갑진';
      const result = parseSajuChart(chart);
      
      // 정확한 일간
      expect(result?.dayMaster).toBe('정');
      expect(result?.dayMasterElement).toBe('화');
      
      // 오류: 갑목이 아님
      expect(result?.dayMaster).not.toBe('갑');
      expect(result?.dayMasterElement).not.toBe('목');
      
      // 일주 확인
      expect(result?.dayPillar.heavenlyStem).toBe('정');
      expect(result?.dayPillar.earthlyBranch).toBe('축');
    });
  });
});
