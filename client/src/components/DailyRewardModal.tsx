/* 일일 보상 팝업 컴포넌트
 * 자정마다 충전별 3개 자동 지급 + 14일 로그인 보상
 */

import React, { useEffect, useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { claimDailyReward, getConsecutiveDays, getNextMilestone } from '@/lib/dailyRewards';
import { addCharges } from '@/lib/chargeSystem';
import { addTransaction } from '@/lib/chargeHistory';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyRewardModal({ isOpen, onClose }: DailyRewardModalProps) {
  const [reward, setReward] = useState<{ amount: number; loginReward?: number } | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const result = claimDailyReward();
      if (result.amount > 0) {
        setReward(result);
        setShowAnimation(true);

        // 충전별 추가
        addCharges(result.amount);
        addTransaction('daily_reward', result.amount, '일일 보상');

        if (result.loginReward) {
          addCharges(result.loginReward);
          addTransaction('login_reward', result.loginReward, `${getConsecutiveDays()}일 연속 로그인 보상`);
        }

        // 3초 후 자동 닫기
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    }
  }, [isOpen]);

  if (!isOpen || !reward) return null;

  const consecutiveDays = getConsecutiveDays();
  const nextMilestone = getNextMilestone();
  const totalReward = (reward.amount || 0) + (reward.loginReward || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 50%)' }}>
      <div
        className={`rounded-2xl p-8 max-w-md w-full text-center transition-all transform ${
          showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          border: '2px solid oklch(0.78 0.15 85)',
          boxShadow: '0 0 60px oklch(0.78 0.15 85 / 40%)',
          transitionDuration: '500ms',
        }}
      >
        {/* 아이콘 애니메이션 */}
        <div
          className="flex justify-center mb-4 animate-bounce"
          style={{
            animationDuration: '0.6s',
          }}
        >
          <Gift size={48} style={{ color: 'oklch(0.78 0.15 85)' }} />
        </div>

        {/* 제목 */}
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
          일일 보상!
        </h2>

        {/* 일일 보상 */}
        <div
          className="p-4 rounded-xl mb-4"
          style={{
            background: 'oklch(0.50 0.28 290 / 20%)',
            border: '2px solid oklch(0.78 0.15 85)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={24} style={{ color: 'oklch(0.78 0.15 85)' }} />
            <span className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
              +{reward.amount}개
            </span>
          </div>
          <p style={{ color: 'oklch(0.70 0.02 290)' }}>자정 보상</p>
        </div>

        {/* 연속 로그인 보상 */}
        {reward.loginReward && (
          <div
            className="p-4 rounded-xl mb-4 ring-2"
            style={{
              background: 'oklch(0.50 0.28 85 / 20%)',
              borderColor: 'oklch(0.78 0.25 85)',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={24} style={{ color: 'oklch(0.78 0.25 85)' }} />
              <span className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                +{reward.loginReward}개
              </span>
            </div>
            <p style={{ color: 'oklch(0.70 0.02 290)' }}>
              {consecutiveDays}일 연속 로그인 보상 🎉
            </p>
          </div>
        )}

        {/* 진행도 */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span style={{ color: 'oklch(0.70 0.02 290)' }}>다음 보상까지</span>
            <span style={{ color: 'oklch(0.78 0.15 85)' }}>
              {consecutiveDays} / {nextMilestone}일
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: 'oklch(0.20 0.05 270)' }}
          >
            <div
              className="h-full transition-all"
              style={{
                width: `${(consecutiveDays / nextMilestone) * 100}%`,
                background: 'linear-gradient(90deg, oklch(0.78 0.15 85), oklch(0.78 0.25 85))',
              }}
            />
          </div>
        </div>

        {/* 합계 */}
        <div
          className="p-3 rounded-lg text-center"
          style={{
            background: 'oklch(0.20 0.05 270)',
            border: '1px solid oklch(0.78 0.15 85 / 50%)',
          }}
        >
          <p style={{ color: 'oklch(0.70 0.02 290)', fontSize: '0.875rem' }}>총 획득</p>
          <p className="text-2xl font-bold" style={{ color: 'oklch(0.78 0.15 85)' }}>
            ⭐ {totalReward}개
          </p>
        </div>
      </div>
    </div>
  );
}
