import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function AdviceCardPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/advice-card/:cardId');
  const cardId = params?.cardId ? parseInt(params.cardId) : 0;
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: card, isLoading } = trpc.consultation.getAdviceCard.useQuery(
    { cardId },
    { enabled: cardId > 0 }
  );

  const revealMutation = trpc.consultation.revealCard.useMutation({
    onSuccess: () => {
      setIsFlipped(true);
    },
  });

  const handleFlip = async () => {
    if (isAnimating || isFlipped) return;
    
    setIsAnimating(true);
    
    // 카드 뒤집기 애니메이션
    setTimeout(() => {
      if (!card?.isRevealed) {
        revealMutation.mutate({ cardId });
      } else {
        setIsFlipped(true);
      }
      setIsAnimating(false);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-purple-300 font-light">카드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-purple-300 font-light mb-4">카드를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/my')}
            className="px-6 py-2 border border-purple-400/50 text-purple-300 rounded-full font-light hover:bg-purple-400/10 transition-all"
          >
            마이페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate('/my')}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-purple-300" />
          </button>
          <h1 className="text-3xl font-light text-purple-200">오늘의 조언 카드</h1>
        </div>

        {/* Card Container */}
        <div className="flex justify-center mb-12">
          <div
            onClick={handleFlip}
            className={`relative w-64 h-96 cursor-pointer transition-transform duration-300 ${
              isAnimating ? 'scale-95' : 'hover:scale-105'
            }`}
            style={{
              perspective: '1000px',
            }}
          >
            {/* Card Flip Animation */}
            <div
              className={`relative w-full h-full transition-transform duration-300`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Back of Card */}
              <div
                className="absolute w-full h-full backdrop-blur-md bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-2 border-purple-400/50 rounded-2xl p-8 flex flex-col items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Sparkles className="w-16 h-16 text-purple-300 mb-4" />
                <p className="text-center text-purple-200 font-light text-lg">
                  카드 뒤집기
                </p>
              </div>

              {/* Front of Card */}
              <div
                className="absolute w-full h-full backdrop-blur-md bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-300/30 rounded-2xl p-8 flex flex-col items-center justify-center overflow-y-auto"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                {card.cardImage && (
                  <img
                    src={card.cardImage}
                    alt={card.cardName}
                    className="w-32 h-32 mb-4 rounded-lg object-cover"
                  />
                )}
                <h2 className="text-2xl font-light text-purple-200 mb-4 text-center">
                  {card.cardName}
                </h2>
                <p className="text-sm text-gray-300 font-light text-center">
                  {card.cardReading}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h3 className="text-purple-300 font-light mb-4">카드 정보</h3>
          <div className="space-y-3 text-gray-300 font-light text-sm">
            <div className="flex justify-between">
              <span>카드명</span>
              <span className="text-purple-200">{card.cardName}</span>
            </div>
            <div className="flex justify-between">
              <span>카드 타입</span>
              <span className="text-purple-200 capitalize">{card.cardType}</span>
            </div>
            <div className="flex justify-between">
              <span>생성 날짜</span>
              <span className="text-purple-200">
                {new Date(card.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>상태</span>
              <span className="text-purple-200">
                {card.isRevealed ? '공개됨' : '미공개'}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {!isFlipped && (
          <div className="backdrop-blur-md bg-purple-600/10 border border-purple-400/30 rounded-lg p-6 text-center">
            <p className="text-purple-300 font-light">
              카드를 클릭하여 루나벨의 조언을 확인하세요.
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/my')}
          className="w-full mt-8 px-8 py-3 border border-purple-400/50 text-purple-300 rounded-full font-light hover:bg-purple-400/10 transition-all"
        >
          마이페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
