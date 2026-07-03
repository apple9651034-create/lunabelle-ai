import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export interface ReadingRecord {
  id: string;
  date: string;
  consultationType: 'tarot' | 'saju' | 'yuk';
  question: string;
  cards?: string[];
  summary: string;
  resultStatus?: 'pending' | 'verified' | 'rejected';
  actualResult?: string;
  resultDate?: string;
  accuracy?: boolean;
}

export const ReadingResultTracking: React.FC = () => {
  const [readings, setReadings] = useState<ReadingRecord[]>([]);
  const [selectedReading, setSelectedReading] = useState<ReadingRecord | null>(null);
  const [resultFeedback, setResultFeedback] = useState('');

  // 로컬스토리지에서 리딩 기록 로드
  useEffect(() => {
    const stored = localStorage.getItem('readingRecords');
    if (stored) {
      setReadings(JSON.parse(stored));
    }
  }, []);

  // 리딩 기록 저장
  const saveReading = (reading: ReadingRecord) => {
    const updated = [...readings, reading];
    setReadings(updated);
    localStorage.setItem('readingRecords', JSON.stringify(updated));
  };

  // 결과 피드백 제출
  const submitResultFeedback = (reading: ReadingRecord, accuracy: boolean) => {
    const updated = readings.map((r) =>
      r.id === reading.id
        ? {
            ...r,
            resultStatus: accuracy ? ('verified' as const) : ('rejected' as const),
            resultDate: new Date().toISOString(),
            accuracy,
            actualResult: resultFeedback,
          }
        : r
    ) as ReadingRecord[];
    setReadings(updated);
    localStorage.setItem('readingRecords', JSON.stringify(updated));
    setSelectedReading(null);
    setResultFeedback('');
  };

  // 정확도 통계
  const calculateAccuracy = () => {
    const verified = readings.filter((r) => r.resultStatus === 'verified');
    if (verified.length === 0) return 0;
    const accurate = verified.filter((r) => r.accuracy).length;
    return Math.round((accurate / verified.length) * 100);
  };

  const getConsultationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tarot: '🃏 타로',
      saju: '📅 사주',
      yuk: '☯️ 육효',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* 정확도 통계 */}
      <Card className="p-6" style={{ background: 'oklch(0.15 0.05 270)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'oklch(0.94 0.015 90)' }}>
              📊 루나의 리딩 정확도
            </h3>
            <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
              검증된 리딩 중 정확한 예측의 비율
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold" style={{ color: 'oklch(0.80 0.10 60)' }}>
              {calculateAccuracy()}%
            </div>
            <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
              {readings.filter((r) => r.resultStatus).length}개 검증됨
            </p>
          </div>
        </div>
      </Card>

      {/* 리딩 기록 목록 */}
      <div className="space-y-3">
        <h3 className="font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
          📖 지난 리딩 기록
        </h3>
        {readings.length === 0 ? (
          <Card className="p-6 text-center" style={{ background: 'oklch(0.15 0.05 270)' }}>
            <p style={{ color: 'oklch(0.70 0.02 290)' }}>아직 리딩 기록이 없습니다.</p>
          </Card>
        ) : (
          readings.map((reading) => (
            <Card
              key={reading.id}
              className="p-4 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: 'oklch(0.15 0.05 270)' }}
              onClick={() => setSelectedReading(reading)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">
                      {getConsultationTypeLabel(reading.consultationType)}
                    </span>
                    <span className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                      {new Date(reading.date).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                    Q: {reading.question}
                  </p>
                  <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                    {reading.summary}
                  </p>
                </div>
                <div className="ml-4">
                  {reading.resultStatus === 'verified' ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 size={24} style={{ color: 'oklch(0.80 0.10 120)' }} />
                      <span className="text-xs mt-1" style={{ color: 'oklch(0.80 0.10 120)' }}>
                        일치함
                      </span>
                    </div>
                  ) : reading.resultStatus === 'rejected' ? (
                    <div className="flex flex-col items-center">
                      <XCircle size={24} style={{ color: 'oklch(0.70 0.10 30)' }} />
                      <span className="text-xs mt-1" style={{ color: 'oklch(0.70 0.10 30)' }}>
                        불일치
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Clock size={24} style={{ color: 'oklch(0.70 0.02 290)' }} />
                      <span className="text-xs mt-1" style={{ color: 'oklch(0.70 0.02 290)' }}>
                        대기중
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 결과 피드백 모달 */}
      {selectedReading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6" style={{ background: 'oklch(0.12 0.04 270)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'oklch(0.94 0.015 90)' }}>
              리딩 결과 확인
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  질문
                </p>
                <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
                  {selectedReading.question}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  루나의 예측
                </p>
                <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
                  {selectedReading.summary}
                </p>
              </div>

              {selectedReading.resultStatus !== 'pending' && (
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'oklch(0.94 0.015 90)' }}>
                    실제 결과
                  </p>
                  <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
                    {selectedReading.actualResult}
                  </p>
                </div>
              )}

              {selectedReading.resultStatus === 'pending' && (
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: 'oklch(0.94 0.015 90)' }}>
                    실제 결과를 입력해주세요
                  </label>
                  <textarea
                    value={resultFeedback}
                    onChange={(e) => setResultFeedback(e.target.value)}
                    placeholder="예: 연락이 왔어요, 면접에 합격했어요..."
                    className="w-full p-3 rounded-lg text-sm outline-none"
                    style={{
                      background: 'oklch(0.20 0.06 270)',
                      color: 'oklch(0.94 0.015 90)',
                    }}
                    rows={3}
                  />
                </div>
              )}
            </div>

            {selectedReading.resultStatus === 'pending' && (
              <div className="flex gap-3">
                <Button
                  onClick={() => submitResultFeedback(selectedReading, true)}
                  disabled={!resultFeedback.trim()}
                  className="flex-1"
                  style={{
                    background: 'oklch(0.80 0.10 120)',
                    color: 'oklch(0.12 0.04 270)',
                  }}
                >
                  ✓ 일치했어요
                </Button>
                <Button
                  onClick={() => submitResultFeedback(selectedReading, false)}
                  disabled={!resultFeedback.trim()}
                  className="flex-1"
                  style={{
                    background: 'oklch(0.70 0.10 30)',
                    color: 'oklch(0.94 0.015 90)',
                  }}
                >
                  ✗ 다달랐어요
                </Button>
              </div>
            )}

            <Button
              onClick={() => setSelectedReading(null)}
              className="w-full mt-3"
              style={{
                background: 'oklch(0.20 0.06 270)',
                color: 'oklch(0.94 0.015 90)',
              }}
            >
              닫기
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export const saveReadingRecord = (record: ReadingRecord) => {
  const stored = localStorage.getItem('readingRecords');
  const records = stored ? JSON.parse(stored) : [];
  records.push(record);
  localStorage.setItem('readingRecords', JSON.stringify(records));
};
