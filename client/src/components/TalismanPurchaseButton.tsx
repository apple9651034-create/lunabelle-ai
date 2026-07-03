import React, { useState } from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

interface TalismanPurchaseButtonProps {
  talismanId: string;
  talismanName: string;
  price: number;
  discountPercentage?: number;
  onAddToCart?: (talisman: any) => void;
  onCheckout?: (talisman: any) => void;
}

export default function TalismanPurchaseButton({
  talismanId,
  talismanName,
  price,
  discountPercentage = 10,
  onAddToCart,
  onCheckout,
}: TalismanPurchaseButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const discountedPrice = Math.floor(price * (1 - discountPercentage / 100));
  const savings = price - discountedPrice;

  return (
    <div className="space-y-2">
      {/* 할인 뱃지 */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 rounded-full text-xs font-bold" style={{
          background: 'linear-gradient(135deg, oklch(0.70 0.18 60) 0%, oklch(0.65 0.20 50) 100%)',
          color: 'oklch(0.10 0.02 270)',
        }}>
          ⚡ {discountPercentage}% 할인
        </span>
        <span className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>
          {savings.toLocaleString()}원 절약
        </span>
      </div>

      {/* 가격 정보 */}
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold" style={{ color: 'oklch(0.70 0.18 60)' }}>
          {discountedPrice.toLocaleString()}원
        </span>
        <span className="text-sm line-through" style={{ color: 'oklch(0.60 0.02 290)' }}>
          {price.toLocaleString()}원
        </span>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-2">
        {/* 장바구니 추가 버튼 */}
        <button
          onClick={() => onAddToCart?.({
            id: talismanId,
            name: talismanName,
            price: discountedPrice,
            originalPrice: price,
            discount: discountPercentage,
          })}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-all active:scale-[0.97]"
          style={{
            background: isHovered ? 'oklch(0.78 0.15 85 / 30%)' : 'oklch(0.78 0.15 85 / 15%)',
            color: 'oklch(0.78 0.15 85)',
            border: '1px solid oklch(0.78 0.15 85 / 40%)',
          }}
        >
          <ShoppingCart size={16} />
          장바구니
        </button>

        {/* 바로 구매 버튼 */}
        <button
          onClick={() => onCheckout?.({
            id: talismanId,
            name: talismanName,
            price: discountedPrice,
            originalPrice: price,
            discount: discountPercentage,
          })}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-all active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, oklch(0.70 0.18 60) 0%, oklch(0.65 0.20 50) 100%)',
            color: 'oklch(0.10 0.02 270)',
          }}
        >
          <Zap size={16} />
          바로 구매
        </button>
      </div>

      {/* 추천 텍스트 */}
      <p className="text-xs text-center" style={{ color: 'oklch(0.70 0.18 60)' }}>
        ✨ 상담 추천 부적 전용 할인가
      </p>
    </div>
  );
}
