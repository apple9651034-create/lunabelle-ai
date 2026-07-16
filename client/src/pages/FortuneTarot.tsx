import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, RotateCcw, Share2 } from 'lucide-react';
import tarotCards from '@/data/tarot-db.json';

interface TarotCard {
  id: string;
  name: string;
  koreanName: string;
  upright: {
    keywords: string[];
    core: string;
    today: string;
    love: string;
    money: string;
    work: string;
    advice: string;
    warning: string;
    yesno: string;
  };
  reversed: {
    keywords: string[];
    core: string;
    today: string;
    love: string;
    money: string;
    work: string;
    advice: string;
    warning: string;
    yesno: string;
  };
  lucky: {
    color: string;
    number: number;
    time: string;
  };
  closing: string;
}

export default function FortuneTarot() {
  const [, navigate] = useLocation();
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // 랜덤 카드 선택
  const drawCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * tarotCards.length);
      setSelectedCard(tarotCards[randomIndex] as TarotCard);
      setIsReversed(Math.random() > 0.5);
      setIsFlipping(false);
    }, 600);
  };

  // 초기 카드 선택
  useEffect(() => {
    drawCard();
  }, []);

  if (!selectedCard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full"></div>
          </div>
          <p className="text-gray-300">카드를 선택 중입니다...</p>
        </div>
      </div>
    );
  }

  const cardData = isReversed ? selectedCard.reversed : selectedCard.upright;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/fortune')}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            돌아가기
          </button>
          <h1 className="text-2xl font-light text-purple-300">타로 무료 운세</h1>
          <div className="w-20"></div>
        </div>

        {/* Card Display */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Card */}
          <div className="lg:w-1/3 flex flex-col items-center">
            <div
              className={`relative w-48 h-72 mb-6 cursor-pointer transition-transform duration-300 ${
                isFlipping ? 'scale-95' : 'scale-100'
              }`}
              onClick={drawCard}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-2xl flex items-center justify-center text-6xl transition-all duration-600 ${
                  isFlipping ? 'opacity-100 rotate-y-180' : 'opacity-100'
                }`}
              >
                🔮
              </div>
            </div>

            {/* Card Info */}
            <div className="text-center">
              <h2 className="text-2xl font-light text-white mb-1">
                {selectedCard.koreanName}
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                {selectedCard.name}
              </p>
              <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                <p className="text-sm text-purple-300">
                  {isReversed ? '역방향 🔄' : '정방향 ✨'}
                </p>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 justify-center">
                {cardData.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div className="lg:w-2/3 space-y-6">
            {/* Core Message */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-light text-purple-300 mb-3">💫 핵심 메시지</h3>
              <p className="text-gray-200 font-light leading-relaxed">
                {cardData.core}
              </p>
            </div>

            {/* Today's Fortune */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-light text-purple-300 mb-3">🌟 오늘의 운세</h3>
              <p className="text-gray-200 font-light leading-relaxed">
                {cardData.today}
              </p>
            </div>

            {/* Advice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-light text-green-300 mb-3">💚 조언</h3>
                <p className="text-gray-200 font-light text-sm leading-relaxed">
                  {cardData.advice}
                </p>
              </div>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-light text-red-300 mb-3">⚠️ 주의사항</h3>
                <p className="text-gray-200 font-light text-sm leading-relaxed">
                  {cardData.warning}
                </p>
              </div>
            </div>

            {/* Life Areas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-sm font-light text-pink-300 mb-2">💕 연애</h4>
                <p className="text-gray-300 font-light text-xs leading-relaxed">
                  {cardData.love}
                </p>
              </div>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-sm font-light text-amber-300 mb-2">💰 금전</h4>
                <p className="text-gray-300 font-light text-xs leading-relaxed">
                  {cardData.money}
                </p>
              </div>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-sm font-light text-blue-300 mb-2">💼 직장</h4>
                <p className="text-gray-300 font-light text-xs leading-relaxed">
                  {cardData.work}
                </p>
              </div>
            </div>

            {/* Lucky Elements */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-light text-yellow-300 mb-4">✨ 행운의 요소</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">색상</p>
                  <p className="text-white font-light">{selectedCard.lucky.color}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">숫자</p>
                  <p className="text-white font-light">{selectedCard.lucky.number}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">시간</p>
                  <p className="text-white font-light">{selectedCard.lucky.time}</p>
                </div>
              </div>
            </div>

            {/* Closing Message */}
            <div className="backdrop-blur-md bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
              <p className="text-gray-200 font-light italic text-center">
                "{selectedCard.closing}"
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={drawCard}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
            다시 뽑기
          </button>

          <button
            onClick={() => {
              const text = `루나벨 타로 운세: ${selectedCard.koreanName} (${isReversed ? '역' : '정'}방향)\n\n${cardData.core}`;
              navigator.share?.({ title: '루나벨 타로 운세', text }) ||
                navigator.clipboard.writeText(text);
            }}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-light hover:bg-white/20 transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
            공유하기
          </button>
        </div>

        {/* Consultation CTA */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-gray-300 font-light mb-4">
            더 깊은 상담이 필요하신가요?
          </p>
          <button
            onClick={() => navigate('/consultation')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            루나벨과 1:1 상담 받기
          </button>
        </div>
      </div>
    </div>
  );
}
