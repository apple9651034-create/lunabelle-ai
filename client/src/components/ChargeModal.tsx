/* 충전 팝업 컴포넌트
 * 충전별이 부족할 때 표시되는 모달
 */

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { addCharges } from '@/lib/chargeSystem';
import { addTransaction } from '@/lib/chargeHistory';
import PaymentSuccessAnimation from './PaymentSuccessAnimation';

interface ChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChargeModal({ isOpen, onClose }: ChargeModalProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedCharges, setSelectedCharges] = useState(0);

  if (!isOpen) return null;

  const chargePackages = [
    { id: 1, charges: 5, price: '₩2,900', popular: false },
    { id: 2, charges: 10, price: '₩4,900', popular: true },
    { id: 3, charges: 20, price: '₩8,900', popular: false },
  ];

  const handlePurchase = (charges: number) => {
    setSelectedCharges(charges);
    setShowAnimation(true);
    addCharges(charges);
    addTransaction('charge', charges, '충전별 구매');
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    onClose();
  };

  return (
    <>
      <PaymentSuccessAnimation
        isVisible={showAnimation}
        chargeAmount={selectedCharges}
        onComplete={handleAnimationComplete}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 50%)' }}>
        <div
          className="rounded-2xl p-6 max-w-md w-full relative"
          style={{
            background: 'linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
            border: '2px solid oklch(0.78 0.15 85)',
            boxShadow: '0 0 40px oklch(0.55 0.25 290 / 30%)',
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:scale-110"
            style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.85 0.015 90)' }}
          >
            <X size={20} />
          </button>

          {/* 헤더 */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Sparkles size={32} style={{ color: 'oklch(0.78 0.15 85)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
              충전별이 부족합니다
            </h2>
            <p style={{ color: 'oklch(0.70 0.02 290)' }}>
              더 많은 상담을 받으려면 충전별을 구매하세요
            </p>
          </div>

          {/* 충전 패키지 */}
          <div className="space-y-3 mb-6">
            {chargePackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${pkg.popular ? "ring-2" : ""}`}
                style={{
                  background: pkg.popular ? 'oklch(0.50 0.28 290 / 20%)' : 'oklch(0.17 0.04 270)',
                  borderColor: pkg.popular ? 'oklch(0.78 0.15 85)' : 'oklch(1 0 0 / 10%)',
                }}
                onClick={() => handlePurchase(pkg.charges)}
              >
                {pkg.popular && (
                  <div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'oklch(0.78 0.15 85)', color: 'oklch(0.14 0.05 270)' }}
                  >
                    인기
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                      ⭐ {pkg.charges}개
                    </div>
                    <div className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                      충전별 패키지
                    </div>
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'oklch(0.78 0.15 85)' }}>
                    {pkg.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 안내 문구 */}
          <div
            className="p-3 rounded-lg text-xs text-center mb-4"
            style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.70 0.02 290)' }}
          >
            💡 각 상담/점술마다 충전별 1개씩 소비됩니다
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold transition-all active:scale-[0.97]"
            style={{
              background: 'oklch(0.20 0.05 270)',
              color: 'oklch(0.78 0.15 85)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
          >
            나중에 충전하기
          </button>
        </div>
      </div>
    </>
  );
}
