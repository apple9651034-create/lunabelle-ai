/* AI 루나 — TarotPage
 * Design: Mystic Dark Luxury
 * 78장 완전 덱 + 질문 유형별 자동 스프레드
 */
import React, { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { fullTarotDeck, detectQuestionType, selectSpread, drawCards, TarotCard } from '@/lib/tarotCards';
import { saveConsultation } from '@/lib/consultationHistory';
import MysticalLoader from '@/components/MysticalLoader';
import MysticalLoadingAnimation from '@/components/MysticalLoadingAnimation';

interface TarotReading {
  question: string;
  spreadName: string;
  cards: TarotCard[];
  reversed: boolean[];
  interpretation: string;
}

export default function TarotPage() {
  const [, setLocation] = useLocation();

  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'analyzing' | 'divining' | 'interpreting' | 'completing'>('analyzing');

  if (isLoading) {
    return <MysticalLoadingAnimation isLoading={isLoading} stage={loadingStage} category="tarot" />;
  }

  const handleDrawTarot = () => {
    if (!question.trim()) {
      alert('질문을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setLoadingStage('analyzing');
    setTimeout(() => {
      setLoadingStage('divining');
      // 질문 유형 감지
      const questionType = detectQuestionType(question);
      
      // 스프레드 선택
      const spread = selectSpread(questionType);
      setLoadingStage('interpreting');
      
      // 카드 뛰기
      const { cards, reversed } = drawCards(spread.positions.length);
      
      // 해석 생성
      const interpretation = spread.interpretation(cards, reversed);

      const newReading: TarotReading = {
        question,
        spreadName: spread.name,
        cards,
        reversed,
        interpretation,
      };

      setLoadingStage('completing');
      setReading(newReading);

      // 상담내역 저장
      saveConsultation({
        type: 'tarot',
        question,
        result: newReading,
      });

      setTimeout(() => {
        setIsLoading(false);
        setLoadingStage('analyzing');
      }, 800);
    }, 2000);
  };

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  const getTarotCardColor = (card: TarotCard): string => {
    if (card.arcana === 'major') return 'oklch(0.78 0.15 85)'; // 금색
    if (card.suit === 'wands') return 'oklch(0.70 0.20 30)'; // 주황
    if (card.suit === 'cups') return 'oklch(0.65 0.20 0)'; // 빨강
    if (card.suit === 'swords') return 'oklch(0.70 0.15 250)'; // 파랑
    return 'oklch(0.70 0.15 120)'; // 초록 (펜타클)
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center gap-3"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <button
          onClick={() => setLocation('/')}
          className="p-2 rounded-lg transition-all hover:bg-white/10"
          style={{ color: 'oklch(0.78 0.15 85)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            타로 점술
          </h1>
          <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>78장 완전 덱으로 당신의 운명을 읽습니다</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <div className="p-5 space-y-4" style={cardStyle}>
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              질문을 입력하세요
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="예: 앞으로의 사랑은 어떻게 될까요?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
              style={{
                background: 'oklch(0.20 0.05 270)',
                color: 'oklch(0.94 0.015 90)',
                border: '1px solid oklch(1 0 0 / 15%)',
              }}
            />
          </div>

          <button
            onClick={handleDrawTarot}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              color: 'oklch(0.97 0.005 90)',
              boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
              fontFamily: "'Noto Serif KR', serif",
            }}
          >
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> 타로 카드 뽑는 중...</> : '🃏 타로 카드 뽑기'}
          </button>
        </div>

        {/* Results */}
        {reading && (
          <div className="space-y-3">
            {/* 스프레드 정보 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                스프레드 방식
              </h3>
              <p style={{ color: 'oklch(0.85 0.015 90)' }} className="text-sm">
                {reading.spreadName}
              </p>
            </div>

            {/* 카드 시각화 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase text-center" style={{ color: 'oklch(0.78 0.15 85)' }}>
                뽑힌 카드
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {reading.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg text-center transition-all hover:scale-105"
                    style={{
                      background: 'oklch(0.20 0.05 270)',
                      border: `2px solid ${getTarotCardColor(card)}`,
                    }}
                  >
                    {/* 카드 이미지 */}
                    {card.image && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs font-semibold mb-1" style={{ color: getTarotCardColor(card) }}>
                      {reading.spreadName.includes('켈틱') ? ['현재', '도전', '목표', '근처', '태도', '외부', '희망', '의견', '결과', '조언'][idx] : ['과거', '현재', '미래', '신체', '정신', '영혼', '현재', '도전', '조언', '결과'][idx]}
                    </p>
                    <p className="text-xs mb-1" style={{ color: 'oklch(0.94 0.015 90)' }}>
                      {card.name}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.60 0.02 290)' }}>
                      {reading.reversed[idx] ? '🔄 역방향' : '정방향'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 카드별 해석 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                카드별 의미
              </h3>
              <div className="space-y-2">
                {reading.cards.map((card, idx) => (
                  <div key={idx} className="p-3 rounded-lg" style={{ background: 'oklch(0.20 0.05 270)', border: '1px solid oklch(1 0 0 / 10%)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: getTarotCardColor(card) }}>
                      {card.name} {reading.reversed[idx] ? '(역방향)' : '(정방향)'}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.85 0.015 90)' }}>
                      {reading.reversed[idx] ? card.reversed : card.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 종합 해석 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                종합 해석
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'oklch(0.85 0.015 90)' }}>
                {reading.interpretation}
              </p>
            </div>

            {/* AI 상담 버튼 */}
            <button
              onClick={() => {
                sessionStorage.setItem('tarotResult', JSON.stringify(reading));
                setLocation('/chat');
              }}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                color: 'oklch(0.97 0.005 90)',
                boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
                fontFamily: "'Noto Serif KR', serif",
              }}
            >
              🤖 AI 루나와 상담하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
