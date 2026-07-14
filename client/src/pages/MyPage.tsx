/* 마이페이지
 * 사용자 정보 및 충전별 내역 관리
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Download, Trash2, TrendingDown, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { getRecentHistory, ChargeTransaction, clearHistory } from '@/lib/chargeHistory';
import { getRewardState } from '@/lib/dailyRewards';
import { trpc } from '@/lib/trpc';

export default function MyPage() {
  const [, navigate] = useLocation();
  const [history, setHistory] = useState<ChargeTransaction[]>([]);
  const [consecutiveDays, setConsecutiveDays] = useState(0);

  useEffect(() => {
    setHistory(getRecentHistory(50));
    setConsecutiveDays(getRewardState().consecutiveDays);
  }, []);

  const handleDownload = () => {
    const csv = [
      ['날짜', '유형', '수량', '사유'].join(','),
      ...history.map((t) => [
        new Date(t.timestamp).toLocaleString('ko-KR'),
        getTypeLabel(t.type),
        t.type === 'deduct' ? `-${t.amount}` : `+${t.amount}`,
        t.reason,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `충전별_내역_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleClearHistory = () => {
    if (confirm('정말 모든 내역을 삭제하시겠습니까?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deduct: '사용',
      charge: '구매',
      daily_reward: '일일 보상',
      login_reward: '로그인 보상',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deduct':
        return 'oklch(0.60 0.20 0)';
      case 'charge':
        return 'oklch(0.78 0.15 85)';
      case 'daily_reward':
      case 'login_reward':
        return 'oklch(0.78 0.25 85)';
      default:
        return 'oklch(0.70 0.02 290)';
    }
  };

  const totalDeducted = history
    .filter((t) => t.type === 'deduct')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalCharged = history
    .filter((t) => t.type !== 'deduct')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.14 0.05 270)' }}>
      {/* 헤더 */}
      <div
        className="sticky top-0 z-40 p-4 flex items-center gap-3 border-b"
        style={{
          background: 'oklch(0.18 0.08 290)',
          borderColor: 'oklch(0.78 0.15 85 / 20%)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.85 0.015 90)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
          마이페이지
        </h1>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 연속 로그인 */}
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290 / 20%), oklch(0.50 0.28 85 / 10%))',
              border: '2px solid oklch(0.78 0.15 85)',
            }}
          >
            <p style={{ color: 'oklch(0.70 0.02 290)', fontSize: '0.875rem' }}>연속 로그인</p>
            <p className="text-2xl font-bold" style={{ color: 'oklch(0.78 0.15 85)' }}>
              {consecutiveDays}일
            </p>
          </div>

          {/* 사용한 별 */}
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, oklch(0.60 0.20 0 / 20%), oklch(0.50 0.28 270 / 10%))',
              border: '2px solid oklch(0.60 0.20 0)',
            }}
          >
            <p style={{ color: 'oklch(0.70 0.02 290)', fontSize: '0.875rem' }}>사용한 별</p>
            <p className="text-2xl font-bold" style={{ color: 'oklch(0.60 0.20 0)' }}>
              -{totalDeducted}개
            </p>
          </div>

          {/* 충전한 별 */}
          <div
            className="p-4 rounded-xl col-span-2"
            style={{
              background: 'linear-gradient(135deg, oklch(0.78 0.25 85 / 20%), oklch(0.50 0.28 85 / 10%))',
              border: '2px solid oklch(0.78 0.25 85)',
            }}
          >
            <p style={{ color: 'oklch(0.70 0.02 290)', fontSize: '0.875rem' }}>충전한 별</p>
            <p className="text-2xl font-bold" style={{ color: 'oklch(0.78 0.25 85)' }}>
              +{totalCharged}개
            </p>
          </div>
        </div>

        {/* 상담 내역 섹션 */}
        <ConsultationHistorySection />

        {/* 내역 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
            충전별 내역
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.78 0.15 85)' }}
              title="CSV 다운로드"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.60 0.20 0)' }}
              title="내역 삭제"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* 내역 리스트 */}
        <div className="space-y-2">
          {history.length === 0 ? (
            <div
              className="p-8 text-center rounded-xl"
              style={{
                background: 'oklch(0.20 0.05 270)',
                color: 'oklch(0.70 0.02 290)',
              }}
            >
              <p>내역이 없습니다</p>
            </div>
          ) : (
            history.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 rounded-lg flex items-center justify-between"
                style={{
                  background: 'oklch(0.20 0.05 270)',
                  borderLeft: `4px solid ${getTypeColor(transaction.type)}`,
                }}
              >
                <div className="flex-1">
                  <p style={{ color: 'oklch(0.94 0.015 90)', fontWeight: '500' }}>
                    {transaction.reason}
                  </p>
                  <p style={{ color: 'oklch(0.70 0.02 290)', fontSize: '0.875rem' }}>
                    {new Date(transaction.timestamp).toLocaleString('ko-KR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {transaction.type === 'deduct' ? (
                    <TrendingDown size={18} style={{ color: 'oklch(0.60 0.20 0)' }} />
                  ) : (
                    <TrendingUp size={18} style={{ color: getTypeColor(transaction.type) }} />
                  )}
                  <span
                    className="font-bold text-lg"
                    style={{
                      color: getTypeColor(transaction.type),
                    }}
                  >
                    {transaction.type === 'deduct' ? '-' : '+'}
                    {transaction.amount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ConsultationHistorySection() {
  const [, navigate] = useLocation();
  const { data: sessions } = trpc.consultation.getUserSessions.useQuery();

  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4" style={{ color: 'oklch(0.94 0.015 90)' }}>
        루나벨 1:1 상담 내역
      </h2>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-lg cursor-pointer transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290 / 20%), oklch(0.50 0.28 85 / 10%))',
              border: '2px solid oklch(0.78 0.15 85)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  {session.duration}분 상담
                </p>
                <div className="flex items-center gap-2 mt-2" style={{ color: 'oklch(0.70 0.02 290)' }}>
                  <Calendar size={14} />
                  <span className="text-sm">
                    {new Date(session.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p style={{ color: 'oklch(0.78 0.15 85)', fontWeight: 'bold' }}>
                  {session.status === 'completed' ? '완료' : '예약 중'}
                </p>
                {session.status === 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/advice-card/${session.id}`);
                    }}
                    className="mt-2 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all hover:scale-110"
                    style={{
                      background: 'oklch(0.78 0.15 85)',
                      color: 'oklch(0.14 0.05 270)',
                    }}
                  >
                    <Sparkles size={14} />
                    조언 카드
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
