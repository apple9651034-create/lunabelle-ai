import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { ReadingRecord } from './ReadingResultTracking';

export const ReadingAccuracyStats: React.FC = () => {
  const [readings, setReadings] = useState<ReadingRecord[]>([]);
  const [stats, setStats] = useState({
    totalReadings: 0,
    verifiedReadings: 0,
    accurateReadings: 0,
    overallAccuracy: 0,
    tarotAccuracy: 0,
    sajuAccuracy: 0,
    yukAccuracy: 0,
    recentTrend: [] as { date: string; accuracy: number }[],
  });

  // 로컬스토리지에서 리딩 기록 로드
  useEffect(() => {
    const stored = localStorage.getItem('readingRecords');
    if (stored) {
      const records = JSON.parse(stored);
      setReadings(records);
      calculateStats(records);
    }
  }, []);

  const calculateStats = (records: ReadingRecord[]) => {
    const verified = records.filter((r) => r.resultStatus !== 'pending');
    const accurate = verified.filter((r) => r.accuracy);

    // 상담 유형별 적중률
    const tarotReadings = verified.filter((r) => r.consultationType === 'tarot');
    const sajuReadings = verified.filter((r) => r.consultationType === 'saju');
    const yukReadings = verified.filter((r) => r.consultationType === 'yuk');

    const tarotAccurate = tarotReadings.filter((r) => r.accuracy).length;
    const sajuAccurate = sajuReadings.filter((r) => r.accuracy).length;
    const yukAccurate = yukReadings.filter((r) => r.accuracy).length;

    // 날짜별 추이
    const trend = calculateTrend(verified);

    setStats({
      totalReadings: records.length,
      verifiedReadings: verified.length,
      accurateReadings: accurate.length,
      overallAccuracy: verified.length > 0 ? Math.round((accurate.length / verified.length) * 100) : 0,
      tarotAccuracy: tarotReadings.length > 0 ? Math.round((tarotAccurate / tarotReadings.length) * 100) : 0,
      sajuAccuracy: sajuReadings.length > 0 ? Math.round((sajuAccurate / sajuReadings.length) * 100) : 0,
      yukAccuracy: yukReadings.length > 0 ? Math.round((yukAccurate / yukReadings.length) * 100) : 0,
      recentTrend: trend,
    });
  };

  const calculateTrend = (verified: ReadingRecord[]) => {
    const last7Days: { [key: string]: { total: number; accurate: number } } = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days[dateStr] = { total: 0, accurate: 0 };
    }

    verified.forEach((r) => {
      const dateStr = r.resultDate?.split('T')[0] || r.date.split('T')[0];
      if (last7Days[dateStr]) {
        last7Days[dateStr].total++;
        if (r.accuracy) {
          last7Days[dateStr].accurate++;
        }
      }
    });

    return Object.entries(last7Days)
      .map(([date, data]) => ({
        date,
        accuracy: data.total > 0 ? Math.round((data.accurate / data.total) * 100) : 0,
      }))
      .reverse();
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'oklch(0.80 0.15 120)'; // 녹색
    if (accuracy >= 60) return 'oklch(0.78 0.15 85)'; // 황색
    return 'oklch(0.70 0.10 30)'; // 빨강색
  };

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy >= 80) return '탁월함';
    if (accuracy >= 60) return '양호';
    return '개선 필요';
  };

  return (
    <div className="space-y-6">
      {/* 전체 적중률 */}
      <Card className="p-8" style={{ background: 'oklch(0.15 0.05 270)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
              루나의 전체 적중률
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h2
                className="text-5xl font-bold"
                style={{ color: getAccuracyColor(stats.overallAccuracy) }}
              >
                {stats.overallAccuracy}%
              </h2>
              <span style={{ color: 'oklch(0.70 0.02 290)' }}>
                ({stats.accurateReadings}/{stats.verifiedReadings} 적중)
              </span>
            </div>
            <p
              className="text-sm mt-2 font-semibold"
              style={{ color: getAccuracyColor(stats.overallAccuracy) }}
            >
              {getAccuracyLabel(stats.overallAccuracy)}
            </p>
          </div>
          <TrendingUp
            size={64}
            style={{ color: getAccuracyColor(stats.overallAccuracy) }}
          />
        </div>
      </Card>

      {/* 상담 유형별 적중률 */}
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'oklch(0.94 0.015 90)' }}>
          📊 상담 유형별 적중률
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 타로 */}
          <Card className="p-6" style={{ background: 'oklch(0.15 0.05 270)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                🃏 타로
              </p>
              <span className="text-xs px-2 py-1 rounded-full" style={{
                background: getAccuracyColor(stats.tarotAccuracy) + '20',
                color: getAccuracyColor(stats.tarotAccuracy),
              }}>
                {getAccuracyLabel(stats.tarotAccuracy)}
              </span>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color: getAccuracyColor(stats.tarotAccuracy) }}
            >
              {stats.tarotAccuracy}%
            </p>
            <p className="text-xs mt-2" style={{ color: 'oklch(0.70 0.02 290)' }}>
              타로 상담 기반 계산
            </p>
          </Card>

          {/* 사주 */}
          <Card className="p-6" style={{ background: 'oklch(0.15 0.05 270)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                📅 사주
              </p>
              <span className="text-xs px-2 py-1 rounded-full" style={{
                background: getAccuracyColor(stats.sajuAccuracy) + '20',
                color: getAccuracyColor(stats.sajuAccuracy),
              }}>
                {getAccuracyLabel(stats.sajuAccuracy)}
              </span>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color: getAccuracyColor(stats.sajuAccuracy) }}
            >
              {stats.sajuAccuracy}%
            </p>
            <p className="text-xs mt-2" style={{ color: 'oklch(0.70 0.02 290)' }}>
              사주 상담 기반 계산
            </p>
          </Card>

          {/* 육효 */}
          <Card className="p-6" style={{ background: 'oklch(0.15 0.05 270)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                ☯️ 육효
              </p>
              <span className="text-xs px-2 py-1 rounded-full" style={{
                background: getAccuracyColor(stats.yukAccuracy) + '20',
                color: getAccuracyColor(stats.yukAccuracy),
              }}>
                {getAccuracyLabel(stats.yukAccuracy)}
              </span>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color: getAccuracyColor(stats.yukAccuracy) }}
            >
              {stats.yukAccuracy}%
            </p>
            <p className="text-xs mt-2" style={{ color: 'oklch(0.70 0.02 290)' }}>
              육효 상담 기반 계산
            </p>
          </Card>
        </div>
      </div>

      {/* 최근 7일 추이 */}
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'oklch(0.94 0.015 90)' }}>
          📈 최근 7일 적중률 추이
        </h3>
        <Card className="p-6" style={{ background: 'oklch(0.15 0.05 270)' }}>
          <div className="flex items-end justify-between h-48 gap-2">
            {stats.recentTrend.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${Math.max(day.accuracy * 1.5, 20)}px`,
                      background: getAccuracyColor(day.accuracy),
                    }}
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: 'oklch(0.70 0.02 290)' }}>
                  {new Date(day.date).toLocaleDateString('ko-KR', {
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  {day.accuracy}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 통계 요약 */}
      <Card className="p-6" style={{ background: 'oklch(0.20 0.06 270)' }}>
        <div className="flex items-start gap-3">
          <BarChart3 size={24} style={{ color: 'oklch(0.78 0.15 85)' }} />
          <div>
            <p className="font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
              📊 통계 요약
            </p>
            <ul className="space-y-1 text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
              <li>• 총 상담 횟수: {stats.totalReadings}회</li>
              <li>• 검증된 상담: {stats.verifiedReadings}회</li>
              <li>• 적중한 상담: {stats.accurateReadings}회</li>
              <li>• 아직 검증 대기중: {stats.totalReadings - stats.verifiedReadings}회</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 팁 */}
      <Card
        className="p-4 border-l-4"
        style={{
          background: 'oklch(0.78 0.15 85 / 10%)',
          borderColor: 'oklch(0.78 0.15 85)',
        }}
      >
        <p className="text-sm" style={{ color: 'oklch(0.78 0.15 85)' }}>
          💡 <strong>팁:</strong> 마이페이지 "리딩 결과" 탭에서 상담 결과를 입력하면 적중률이 자동으로 계산됩니다.
          더 많은 상담을 검증할수록 루나의 정확도가 더 정확하게 측정됩니다.
        </p>
      </Card>
    </div>
  );
};

export default ReadingAccuracyStats;
