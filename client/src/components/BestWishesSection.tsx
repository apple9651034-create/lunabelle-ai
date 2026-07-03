/**
 * 베스트 소원 섹션 컴포넌트
 * 공감 + 복비가 가장 많은 상위 3개 소원을 돋보이게 표시
 */
import React from 'react';
import { Heart, Flame, Crown } from 'lucide-react';

interface Wish {
  id: number;
  content: string;
  category: string;
  blessings: number;
  likes?: number; // 공감 수
  date?: string;
  timestamp?: Date;
}

interface BestWishesSectionProps {
  wishes: Wish[];
  className?: string;
}

export default function BestWishesSection({ wishes, className = '' }: BestWishesSectionProps) {
  // 공감 + 복비 합계로 상위 3개 선택
  const bestWishes = wishes
    .map((wish) => ({
      ...wish,
      score: (wish.likes || 0) + wish.blessings,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (bestWishes.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 섹션 제목 */}
      <div className="flex items-center gap-2 mb-4">
        <Crown size={20} style={{ color: 'oklch(0.70 0.18 60)' }} />
        <h3 className="font-bold text-lg" style={{ color: 'oklch(0.94 0.015 90)' }}>
          ✨ 베스트 소원
        </h3>
      </div>

      {/* 베스트 소원 카드들 */}
      <div className="space-y-3">
        {bestWishes.map((wish, index) => (
          <div
            key={wish.id}
            className="relative overflow-hidden rounded-lg p-4 border-2 transition-all hover:shadow-lg"
            style={{
              background: 'oklch(0.18 0.08 290)',
              borderColor:
                index === 0
                  ? 'oklch(0.70 0.18 60)' // 금색
                  : index === 1
                    ? 'oklch(0.65 0.10 280)' // 은색
                    : 'oklch(0.60 0.08 30)', // 동색
            }}
          >
            {/* 순위 배지 */}
            <div
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background:
                  index === 0
                    ? 'oklch(0.70 0.18 60)'
                    : index === 1
                      ? 'oklch(0.65 0.10 280)'
                      : 'oklch(0.60 0.08 30)',
                color: 'oklch(0.12 0.03 270)',
              }}
            >
              {index + 1}
            </div>

            {/* 소원 내용 */}
            <p className="text-sm mb-3 pr-8" style={{ color: 'oklch(0.94 0.015 90)' }}>
              {wish.content}
            </p>

            {/* 카테고리 & 통계 */}
            <div className="flex items-center justify-between text-xs">
              <span
                className="px-2 py-1 rounded"
                style={{
                  background: 'oklch(0.50 0.28 290)',
                  color: 'oklch(1 0 0)',
                }}
              >
                {wish.category}
              </span>

              <div className="flex items-center gap-3">
                {/* 공감 수 */}
                <div className="flex items-center gap-1">
                  <Heart size={14} style={{ color: 'oklch(0.70 0.18 60)' }} />
                  <span style={{ color: 'oklch(0.70 0.02 290)' }}>{wish.likes || 0}</span>
                </div>

                {/* 복비 수 */}
                <div className="flex items-center gap-1">
                  <Flame size={14} style={{ color: 'oklch(0.70 0.18 60)' }} />
                  <span style={{ color: 'oklch(0.70 0.02 290)' }}>
                    {wish.blessings.toLocaleString()}원
                  </span>
                </div>

                {/* 합계 스코어 */}
                <div
                  className="px-2 py-1 rounded font-bold"
                  style={{
                    background: 'oklch(0.50 0.28 290)',
                    color: 'oklch(1 0 0)',
                  }}
                >
                  {(wish.likes || 0) + wish.blessings}
                </div>
              </div>
            </div>

            {/* 날짜 */}
            <p
              className="text-xs mt-2"
              style={{ color: 'oklch(0.70 0.02 290)' }}
            >
              {wish.date || (wish.timestamp ? wish.timestamp.toLocaleDateString('ko-KR') : '')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
