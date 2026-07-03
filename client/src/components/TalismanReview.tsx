/**
 * 부적 리뷰 컴포넌트
 * 구매한 부적의 효과/후기를 작성하고 관리
 */
import React, { useState } from 'react';
import { Star, MessageCircle, X, Send } from 'lucide-react';

export interface TalismanReviewData {
  id: string;
  talismanId: number;
  talismanName: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

interface TalismanReviewProps {
  talismanId: number;
  talismanName: string;
  reviews: TalismanReviewData[];
  onAddReview: (review: TalismanReviewData) => void;
  onDeleteReview: (reviewId: string) => void;
}

export default function TalismanReview({
  talismanId,
  talismanName,
  reviews,
  onAddReview,
  onDeleteReview,
}: TalismanReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const existingReview = reviews.find((r) => r.talismanId === talismanId);

  const handleSubmit = () => {
    if (!reviewText.trim()) {
      alert('후기를 입력해주세요.');
      return;
    }

    const newReview: TalismanReviewData = {
      id: `review_${Date.now()}`,
      talismanId,
      talismanName,
      rating,
      review: reviewText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddReview(newReview);
    setReviewText('');
    setRating(5);
    setIsOpen(false);
  };

  return (
    <div>
      {/* 리뷰 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
        style={{
          background: existingReview
            ? 'oklch(0.70 0.18 60 / 15%)'
            : 'oklch(0.50 0.28 290 / 15%)',
          color: existingReview ? 'oklch(0.70 0.18 60)' : 'oklch(0.50 0.28 290)',
          border: `1px solid ${
            existingReview
              ? 'oklch(0.70 0.18 60 / 30%)'
              : 'oklch(0.50 0.28 290 / 30%)'
          }`,
        }}
      >
        <MessageCircle size={12} />
        {existingReview ? '후기 수정' : '후기 작성'}
      </button>

      {/* 리뷰 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div
            className="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
              border: '2px solid oklch(0.70 0.18 60)',
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors hover:bg-white/10"
            >
              <X size={20} style={{ color: 'oklch(0.94 0.015 90)' }} />
            </button>

            {/* 헤더 */}
            <div
              className="p-6 text-center border-b"
              style={{
                background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                borderColor: 'oklch(0.70 0.18 60)',
              }}
            >
              <h2 className="text-2xl font-bold" style={{ color: 'oklch(1 0 0)' }}>
                {talismanName} 후기
              </h2>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.94 0.015 90)' }}>
                부적의 효과를 공유해주세요
              </p>
            </div>

            {/* 컨텐츠 */}
            <div className="p-6 space-y-4">
              {/* 별점 */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  만족도
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        style={{
                          color:
                            star <= (hoveredRating || rating)
                              ? 'oklch(0.78 0.15 85)'
                              : 'oklch(0.50 0.02 290)',
                          fill:
                            star <= (hoveredRating || rating)
                              ? 'oklch(0.78 0.15 85)'
                              : 'none',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 후기 텍스트 */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  후기 작성
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="부적의 효과나 경험을 자유롭게 작성해주세요..."
                  className="w-full p-3 rounded-lg text-sm resize-none focus:outline-none"
                  rows={4}
                  style={{
                    background: 'oklch(0.12 0.03 270)',
                    color: 'oklch(0.94 0.015 90)',
                    border: '1px solid oklch(0.70 0.18 60 / 30%)',
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'oklch(0.60 0.02 290)' }}>
                  {reviewText.length}/200자
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 rounded-lg font-bold transition-all active:scale-[0.97]"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    color: 'oklch(0.78 0.15 85)',
                    border: '1px solid oklch(0.70 0.18 60 / 30%)',
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                    color: 'oklch(1 0 0)',
                    boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
                  }}
                >
                  <Send size={14} />
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 기존 리뷰 표시 */}
      {existingReview && (
        <div
          className="mt-3 p-3 rounded-lg"
          style={{
            background: 'oklch(0.15 0.05 270)',
            border: '1px solid oklch(0.70 0.18 60 / 20%)',
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  style={{
                    color: i < existingReview.rating ? 'oklch(0.78 0.15 85)' : 'oklch(0.50 0.02 290)',
                    fill: i < existingReview.rating ? 'oklch(0.78 0.15 85)' : 'none',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => onDeleteReview(existingReview.id)}
              className="p-1 rounded transition-colors hover:bg-white/10"
            >
              <X size={12} style={{ color: 'oklch(0.60 0.02 290)' }} />
            </button>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.78 0.15 85)' }}>
            {existingReview.review}
          </p>
          <p className="text-[10px] mt-2" style={{ color: 'oklch(0.50 0.02 290)' }}>
            {new Date(existingReview.updatedAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      )}
    </div>
  );
}
