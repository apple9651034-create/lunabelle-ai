/**
 * MyPage.tsx
 * 사용자 정보 및 충전별 내역 관리
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Download, Trash2, TrendingDown, TrendingUp, Calendar, Sparkles, Bell, Check } from 'lucide-react';
import { getRecentHistory, ChargeTransaction, clearHistory } from '@/lib/chargeHistory';
import { getRewardState } from '@/lib/dailyRewards';
import { trpc } from '@/lib/trpc';

export default function MyPage() {
  const [, navigate] = useLocation();
  const [history, setHistory] = useState<ChargeTransaction[]>([]);
  const [consecutiveDays, setConsecutiveDays] = useState(0);

  // 알림 조회
  const { data: notifications } = trpc.consultation.getNotifications.useQuery();
  const markNotificationReadMutation = trpc.consultation.markNotificationRead.useMutation();

  useEffect(() => {
    setHistory(getRecentHistory(50));
    setConsecutiveDays(getRewardState().consecutiveDays);
  }, []);

  const handleNotificationClick = async (notification: any) => {
    // 알림 읽음 처리
    await markNotificationReadMutation.mutateAsync({
      notificationId: notification.id,
    });
    // 조언 카드 페이지로 이동
    if (notification.relatedId) {
      navigate(`/advice-card/${notification.relatedId}`);
    }
  };

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

  const unreadNotifications = notifications?.filter((n: any) => !n.isRead) || [];

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
      <div className="p-4 space-y-6">
        {/* 알림 섹션 */}
        {unreadNotifications && unreadNotifications.length > 0 && (
          <div
            className="rounded-lg p-4 border"
            style={{
              background: 'oklch(0.25 0.08 270)',
              borderColor: 'oklch(0.78 0.15 85 / 30%)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Bell size={18} style={{ color: 'oklch(0.78 0.15 85)' }} />
              <h2 className="font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                새로운 알림 ({unreadNotifications.length})
              </h2>
            </div>
            <div className="space-y-2">
              {unreadNotifications.map((notification: any) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full text-left p-3 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    borderLeft: `3px solid oklch(0.78 0.15 85)`,
                  }}
                >
                  <p style={{ color: 'oklch(0.78 0.15 85)' }} className="font-light text-sm">
                    {notification.title}
                  </p>
                  <p style={{ color: 'oklch(0.70 0.02 290)' }} className="font-light text-xs mt-1">
                    {notification.message}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 상담 내역 섹션 */}
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'oklch(0.94 0.015 90)' }}>
            루나벨 1:1 상담 내역
          </h2>
          <ConsultationHistorySection navigate={navigate} />
        </div>

        {/* 충전별 내역 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-4">
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

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              className="rounded-lg p-3 border"
              style={{
                background: 'oklch(0.20 0.05 270)',
                borderColor: 'oklch(0.60 0.20 0 / 30%)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={16} style={{ color: 'oklch(0.60 0.20 0)' }} />
                <span style={{ color: 'oklch(0.70 0.02 290)' }} className="text-xs">
                  총 사용
                </span>
              </div>
              <p style={{ color: 'oklch(0.60 0.20 0)' }} className="font-bold text-lg">
                -{totalDeducted.toLocaleString()}
              </p>
            </div>
            <div
              className="rounded-lg p-3 border"
              style={{
                background: 'oklch(0.20 0.05 270)',
                borderColor: 'oklch(0.78 0.15 85 / 30%)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} style={{ color: 'oklch(0.78 0.15 85)' }} />
                <span style={{ color: 'oklch(0.70 0.02 290)' }} className="text-xs">
                  총 충전
                </span>
              </div>
              <p style={{ color: 'oklch(0.78 0.15 85)' }} className="font-bold text-lg">
                +{totalCharged.toLocaleString()}
              </p>
            </div>
          </div>

          {/* 일일 보상 */}
          {consecutiveDays > 0 && (
            <div
              className="rounded-lg p-3 mb-4 border"
              style={{
                background: 'oklch(0.25 0.08 270)',
                borderColor: 'oklch(0.78 0.25 85 / 30%)',
              }}
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: 'oklch(0.78 0.25 85)' }} />
                <span style={{ color: 'oklch(0.78 0.25 85)' }} className="font-light">
                  {consecutiveDays}일 연속 로그인 중
                </span>
              </div>
            </div>
          )}

          {/* 내역 목록 */}
          <div className="space-y-2">
            {history.length > 0 ? (
              history.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: 'oklch(0.18 0.08 290)',
                    borderLeft: `3px solid ${getTypeColor(transaction.type)}`,
                  }}
                >
                  <div className="flex-1">
                    <p style={{ color: 'oklch(0.94 0.015 90)' }} className="font-light">
                      {transaction.reason}
                    </p>
                    <p style={{ color: 'oklch(0.70 0.02 290)' }} className="text-xs font-light">
                      {new Date(transaction.timestamp).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <p
                    style={{ color: getTypeColor(transaction.type) }}
                    className="font-bold text-right"
                  >
                    {transaction.type === 'deduct' ? '-' : '+'}
                    {transaction.amount.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: 'oklch(0.70 0.02 290)' }} className="text-center py-8 font-light">
                내역이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultationHistorySection({ navigate }: { navigate: any }) {
  const { data: sessions } = trpc.consultation.getUserSessions.useQuery();

  if (!sessions || sessions.length === 0) {
    return (
      <div
        className="rounded-lg p-6 text-center border"
        style={{
          background: 'oklch(0.18 0.08 290)',
          borderColor: 'oklch(0.78 0.15 85 / 20%)',
        }}
      >
        <p style={{ color: 'oklch(0.70 0.02 290)' }} className="font-light">
          아직 상담 내역이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session: any) => (
        <div
          key={session.id}
          onClick={() => {
            if (session.status === 'completed') {
              navigate(`/advice-card/${session.id}`);
            }
          }}
          className="rounded-lg p-4 border cursor-pointer transition-all hover:scale-105"
          style={{
            background: 'oklch(0.18 0.08 290)',
            borderColor: 'oklch(0.78 0.15 85 / 20%)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p style={{ color: 'oklch(0.94 0.015 90)' }} className="font-light mb-1">
                {session.duration}분 상담
              </p>
              <p style={{ color: 'oklch(0.70 0.02 290)' }} className="text-xs font-light">
                {new Date(session.createdAt).toLocaleDateString('ko-KR')}
              </p>
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
  );
}
