/**
 * 맞춤형 부적 추천 컴포넌트
 * 상담 내용을 바탕으로 가장 적합한 부적을 추천
 */
import React, { useState } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import TalismanPurchaseButton from './TalismanPurchaseButton';
import ConsultationCardShare from './ConsultationCardShare';
import TalismanDiscountTimer from './TalismanDiscountTimer';

interface TalismanRecommendation {
  id: number;
  name: string;
  image: string;
  reason: string;
  matchScore: number;
  price: number;
}

interface RecommendedTalismanProps {
  consultationMessages?: any[];
  consultationContent: string;
  consultationType: 'saju' | 'tarot' | 'yuk';
  onAddToCart?: (talisman: TalismanRecommendation) => void;
}

export default function RecommendedTalisman({
  consultationContent,
  consultationType,
  onAddToCart,
}: RecommendedTalismanProps) {
  const [liked, setLiked] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [purchaseTime] = useState(new Date().toISOString());

  const handleAddToCart = (talisman: TalismanRecommendation) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      id: talisman.id,
      name: talisman.name,
      price: Math.floor(talisman.price * 0.9),
      originalPrice: talisman.price,
      discount: 10,
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${talisman.name}을(를) 장바구니에 담았습니다!`);
  };

  const handleCheckout = (talisman: TalismanRecommendation) => {
    localStorage.setItem('checkoutTalisman', JSON.stringify({
      id: talisman.id,
      name: talisman.name,
      price: Math.floor(talisman.price * 0.9),
      originalPrice: talisman.price,
      discount: 10,
    }));
    window.location.href = '/charge';
  };

  // 상담 내용 기반 부적 추천 로직
  const getRecommendedTalismanByContent = (): TalismanRecommendation => {
    const content = consultationContent.toLowerCase();

    // 키워드 기반 부적 추천
    const recommendations: Record<string, TalismanRecommendation> = {
      love: {
        id: 1,
        name: '연애 부적',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-1-love-bLeDzFpnV2UzvMrKEXHcfS.png',
        reason: '사랑과 인연을 원하는 당신을 위해 추천합니다. 좋은 만남과 깊은 관계를 이끌어줄 것입니다.',
        matchScore: 95,
        price: 4900,
      },
      wealth: {
        id: 2,
        name: '재물 부적',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-2-wealth-mRS4ntPC5oMZUSQrufKhfx.png',
        reason: '재운과 사업 번영을 원하는 당신을 위해 추천합니다. 풍요로움과 성공을 가져다줄 것입니다.',
        matchScore: 92,
        price: 4900,
      },
      health: {
        id: 3,
        name: '건강 부적',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-3-health-e8fgjmK6ft6oQ2RaJMeRPG.png',
        reason: '건강과 치유를 원하는 당신을 위해 추천합니다. 신체와 마음의 안정을 가져다줄 것입니다.',
        matchScore: 88,
        price: 4900,
      },
      success: {
        id: 5,
        name: '성공 부적',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-5-success-6yziXbQeZ27Bpmt9S2S5Vi.png',
        reason: '목표 달성과 성공을 원하는 당신을 위해 추천합니다. 당신의 꿈을 현실로 만들어줄 것입니다.',
        matchScore: 90,
        price: 4900,
      },
      harmony: {
        id: 6,
        name: '조화 부적',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-6-harmony-HATmo4UvH6h2kFMqvf4PQw.png',
        reason: '관계의 조화를 원하는 당신을 위해 추천합니다. 가정과 인간관계의 평화를 가져다줄 것입니다.',
        matchScore: 85,
        price: 4900,
      },
      luck: {
        id: 7,
        name: '행운 부적',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-7-luck-GjiKSjMM23b5PgV7RKgAc8.png',
        reason: '전반적인 행운을 원하는 당신을 위해 추천합니다. 매일매일 좋은 일들이 일어날 것입니다.',
        matchScore: 88,
        price: 4900,
      },
      study: {
        id: 8,
        name: '학업 부적',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-8-study-XuKPVKHHHxDWQ2JVKPUjn2.png',
        reason: '학업 성취를 원하는 당신을 위해 추천합니다. 집중력과 지혜를 높여줄 것입니다.',
        matchScore: 87,
        price: 4900,
      },
    };

    // 키워드 매칭
    const keywords = {
      love: ['남편', '아내', '연애', '사랑', '만남', '인연', '결혼', '짝', '관계'],
      wealth: ['돈', '사업', '투자', '재정', '수입', '직장', '일', '경력', '승진'],
      health: ['건강', '병', '치유', '회복', '스트레스', '피로', '아픔'],
      success: ['성공', '목표', '꿈', '성취', '도전', '시험', '합격'],
      harmony: ['가족', '부모', '자식', '형제', '친구', '관계', '화목', '평화'],
      luck: ['운', '행운', '기운', '좋은', '변화'],
      study: ['공부', '학교', '시험', '공시', '자격증', '학습'],
    };

    for (const [key, words] of Object.entries(keywords)) {
      if (words.some((word) => content.includes(word))) {
        return recommendations[key] || recommendations.luck;
      }
    }

    return recommendations.luck;
  };

  const recommendation = getRecommendedTalismanByContent();

  return (
    <div
      className="rounded-lg border p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
        borderColor: 'oklch(0.78 0.15 85)',
        borderWidth: '2px',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
            ✨ 루나의 맞춤형 부적 추천
          </p>
          <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs">
            당신의 상담 내용을 분석하여 가장 적합한 부적을 추천합니다
          </p>
        </div>
        <div
          className="text-center px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'oklch(0.78 0.15 85 / 20%)',
            color: 'oklch(0.78 0.15 85)',
          }}
        >
          {recommendation.matchScore}% 매칭
        </div>
      </div>

      {/* 부적 카드 */}
      <div
        className="rounded-lg border p-4 flex gap-4"
        style={{
          background: 'oklch(0.20 0.06 270)',
          borderColor: 'oklch(0.78 0.15 85 / 30%)',
        }}
      >
        {/* 부적 이미지 */}
        <div className="flex-shrink-0">
          <img
            src={recommendation.image}
            alt={recommendation.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>

        {/* 부적 정보 */}
        <div className="flex-1">
          <p className="font-bold text-sm mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
            {recommendation.name}
          </p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'oklch(0.60 0.02 290)' }}>
            {recommendation.reason}
          </p>

          {/* 가격 및 버튼 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="font-bold" style={{ color: 'oklch(0.78 0.15 85)' }}>
                  {recommendation.price.toLocaleString()}원
                </p>
                <span className="text-xs px-2 py-1 rounded-full" style={{
                  background: 'oklch(0.80 0.15 40 / 20%)',
                  color: 'oklch(0.80 0.15 40)',
                }}>
                  10% 할인
                </span>
              </div>
              <TalismanDiscountTimer purchaseTime={purchaseTime} discountPercentage={10} />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className="p-2 rounded-lg transition-all active:scale-[0.97]"
                style={{
                  background: liked ? 'oklch(0.65 0.22 15 / 20%)' : 'oklch(0.20 0.06 270)',
                  color: liked ? 'oklch(0.65 0.22 15)' : 'oklch(0.60 0.02 290)',
                  border: `1px solid ${liked ? 'oklch(0.65 0.22 15 / 30%)' : 'oklch(0.78 0.15 85 / 20%)'}`,
                }}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              </button>
              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(recommendation)}
                  className="px-3 py-2 rounded-lg font-bold text-xs transition-all active:scale-[0.97] flex items-center gap-1"
                  style={{
                    background: 'oklch(0.78 0.15 85)',
                    color: 'oklch(0.12 0.02 270)',
                  }}
                >
                  <ShoppingCart size={14} />
                  담기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 추천 이유 */}
      <div
        className="mt-4 p-3 rounded-lg text-xs leading-relaxed"
        style={{
          background: 'oklch(0.78 0.15 85 / 10%)',
          color: 'oklch(0.78 0.15 85)',
          borderLeft: '3px solid oklch(0.78 0.15 85)',
        }}
      >
        <p className="font-bold mb-1">💡 루나의 조언</p>
        <p>
          이 부적은 당신의 현재 상황과 고민을 깊이 있게 분석한 결과, 가장 도움이 될 것으로 판단됩니다.
          부적을 소지하고 당신의 의도에 집중하면, 더욱 큰 효과를 경험하실 수 있습니다.
        </p>
      </div>

      {/* 구매 버튼 */}
      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'oklch(0.78 0.15 85 / 20%)' }}>
        <TalismanPurchaseButton
          talismanId={recommendation.id.toString()}
          talismanName={recommendation.name}
          price={recommendation.price}
          discountPercentage={10}
          onAddToCart={handleAddToCart}
          onCheckout={handleCheckout}
        />
      </div>

      {/* 공유 버튼 */}
      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'oklch(0.78 0.15 85 / 20%)' }}>
        <button
          onClick={() => setShowShareCard(!showShareCard)}
          className="w-full px-4 py-2 rounded-lg font-bold text-sm transition-all"
          style={{
            background: 'oklch(0.78 0.15 85 / 15%)',
            color: 'oklch(0.78 0.15 85)',
            border: '1px solid oklch(0.78 0.15 85 / 30%)',
          }}
        >
          {showShareCard ? '닫기' : '✨ 공유 버튼'}
        </button>
        {showShareCard && (
          <div className="mt-4">
            <ConsultationCardShare
              talismanName={recommendation.name}
              talismanImage={recommendation.image}
              summary={recommendation.reason}
              consultationType="yuk"
            />
          </div>
        )}
      </div>
    </div>
  );
}
