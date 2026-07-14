import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function AdviceCardPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/advice-card/:sessionId');
  const sessionId = params?.sessionId ? parseInt(params.sessionId) : 0;
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // sessionId로 상담 세션 조회
  const { data: session, isLoading: sessionLoading } = trpc.consultation.getSession.useQuery(
    { sessionId },
    { enabled: sessionId > 0 }
  );

  // sessionId로 해당 조언 카드 조회 (session.id 기준)
  const { data: cards, isLoading: cardsLoading } = trpc.consultation.getUserAdviceCards.useQuery(
    undefined,
    { enabled: !!session }
  );

  // 현재 세션의 조언 카드 찾기
  const card = cards?.find(c => c.consultationSessionId === sessionId);

  const revealMutation = trpc.consultation.revealCard.useMutation({
    onSuccess: () => {
      setIsFlipped(true);
    },
  });

  const handleFlip = async () => {
    if (isAnimating || isFlipped || !card) return;
    
    setIsAnimating(true);
    
    // 카드 뒤집기 애니메이션
    setTimeout(() => {
      if (!card.isRevealed) {
        revealMutation.mutate({ cardId: card.id });
      } else {
        setIsFlipped(true);
      }
      setIsAnimating(false);
    }, 300);
  };

  const isLoading = sessionLoading || cardsLoading;

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

  if (!card || !session) {
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
        <div className="flex flex-col items-center gap-8">
          {/* Flipping Card */}
          <div
            onClick={handleFlip}
            className="w-full max-w-sm h-96 cursor-pointer perspective"
            style={{
              perspective: '1000px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: isAnimating ? 'transform 0.6s ease-in-out' : 'none',
              }}
            >
              {/* Card Back */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  backfaceVisibility: 'hidden',
                  display: isFlipped ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.50 0.28 85))',
                  borderRadius: '1.5rem',
                  border: '2px solid oklch(0.78 0.15 85)',
                  padding: '2rem',
                }}
              >
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-purple-200 mx-auto mb-4" />
                  <p className="text-purple-200 font-light text-lg">
                    카드를 클릭하여 뒤집어보세요
                  </p>
                </div>
              </div>

              {/* Card Front */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: isFlipped ? 'flex' : 'none',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, oklch(0.60 0.25 290), oklch(0.55 0.20 85))',
                  borderRadius: '1.5rem',
                  border: '2px solid oklch(0.78 0.15 85)',
                  padding: '2rem',
                }}
              >
                <div className="text-center">
                  {card.cardImage && (
                    <img
                      src={card.cardImage}
                      alt={card.cardName}
                      className="w-24 h-24 mb-4 rounded-lg object-cover"
                    />
                  )}
                  <h2 className="text-2xl font-light text-purple-100 mb-4">
                    {card.cardName}
                  </h2>
                  <p className="text-purple-200 font-light text-sm leading-relaxed">
                    {card.cardReading}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 font-light text-sm mb-1">상담 시간</p>
                <p className="text-purple-200 font-light">{session.duration}분</p>
              </div>
              <div>
                <p className="text-gray-400 font-light text-sm mb-1">상담 날짜</p>
                <p className="text-purple-200 font-light">
                  {new Date(session.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/my')}
            className="w-full px-8 py-3 border border-purple-400/50 text-purple-300 rounded-full font-light hover:bg-purple-400/10 transition-all"
          >
            마이페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
