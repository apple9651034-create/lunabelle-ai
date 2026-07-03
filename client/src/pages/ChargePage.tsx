/*
 * ChargePage.tsx
 * 포트원 결제를 통한 크레딧 충전 페이지
 */
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Zap, Check, AlertCircle, Loader2 } from 'lucide-react';
import { usePortonePayment } from '@/lib/usePortonePayment';
import { trpc } from '@/lib/trpc';
import PaymentSuccessAnimation from '@/components/PaymentSuccessAnimation';

const CHARGE_PACKAGES = [
  {
    id: 'basic',
    credits: 10,
    price: 5000,
    discount: 0,
    popular: false,
    description: '기본 패키지',
  },
  {
    id: 'standard',
    credits: 30,
    price: 14000,
    discount: 7,
    popular: true,
    description: '인기 패키지',
  },
  {
    id: 'premium',
    credits: 60,
    price: 27000,
    discount: 10,
    popular: false,
    description: '프리미엄 패키지',
  },
  {
    id: 'vip',
    credits: 150,
    price: 65000,
    discount: 13,
    popular: false,
    description: 'VIP 패키지',
  },
];

export default function ChargePage() {
  const [, navigate] = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const { requestPayment, isReady } = usePortonePayment();
  const chargeFromPortOne = trpc.credit.chargeFromPortOne.useMutation();

  const selectedPkg = CHARGE_PACKAGES.find(pkg => pkg.id === selectedPackage);

  const handlePayment = async () => {
    if (!selectedPkg || !isReady) {
      setError('결제 시스템이 준비되지 않았습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const merchantUid = `charge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    requestPayment(
      {
        merchantUid,
        name: `AI 루나 크레딧 충전 - ${selectedPkg.credits}개`,
        amount: selectedPkg.price,
        buyerName: '루나 사용자',
      },
      async (impUid, uid, amount) => {
        try {
          // 서버에 결제 검증 요청
          const result = await chargeFromPortOne.mutateAsync({
            paymentId: impUid,
            amount: selectedPkg.price,
            merchantUid: merchantUid,
            credits: selectedPkg.credits,
          });

          if (result.success) {
            // 성공 애니메이션 표시
            setShowSuccessAnimation(true);
            // 3초 후 홈으로 이동
            setTimeout(() => {
              navigate('/');
            }, 3000);
          } else {
            setError('결제 처리에 실패했습니다.');
          }
        } catch (err) {
          setError('크레딧 추가에 실패했습니다. 관리자에게 문의하세요.');
          console.error('Credit addition error:', err);
        }
        setIsLoading(false);
      },
      (errorMsg) => {
        setError(errorMsg);
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <PaymentSuccessAnimation
        isVisible={showSuccessAnimation}
        chargeAmount={selectedPkg?.credits || 0}
        onComplete={() => setShowSuccessAnimation(false)}
      />
      <div className="min-h-screen" style={{ background: 'oklch(0.10 0.02 270)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b" style={{
        background: 'oklch(0.12 0.03 270 / 80%)',
        borderColor: 'oklch(1 0 0 / 8%)',
      }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} style={{ color: 'oklch(0.94 0.015 90)' }} />
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            크레딧 충전
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Info Section */}
        <div className="mb-12 p-6 rounded-2xl border" style={{
          background: 'oklch(0.15 0.05 270)',
          borderColor: 'oklch(0.78 0.15 85 / 20%)',
        }}>
          <div className="flex gap-4">
            <AlertCircle size={24} style={{ color: 'oklch(0.70 0.18 60)', flexShrink: 0 }} />
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                크레딧 충전 안내
              </h3>
              <p className="text-sm" style={{ color: 'oklch(0.78 0.15 85)' }}>
                크레딧은 사주, 타로, 육효 상담 시 사용됩니다. 충전 후 즉시 사용 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {CHARGE_PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className="p-6 rounded-2xl border-2 transition-all relative"
              style={{
                background: selectedPackage === pkg.id ? 'oklch(0.20 0.08 270)' : 'oklch(0.15 0.05 270)',
                borderColor: selectedPackage === pkg.id ? 'oklch(0.70 0.18 60)' : 'oklch(0.78 0.15 85 / 20%)',
              }}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold" style={{
                  background: 'oklch(0.70 0.18 60)',
                  color: 'oklch(0.10 0.02 270)',
                }}>
                  인기
                </div>
              )}
              
              <div className="text-left">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  {pkg.credits}개 크레딧
                </h3>
                <p className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.70 0.18 60)' }}>
                  ₩{pkg.price.toLocaleString()}
                </p>
                {pkg.discount > 0 && (
                  <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>
                    {pkg.discount}% 할인
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{
            background: 'oklch(0.20 0.15 30 / 20%)',
            borderLeft: '4px solid oklch(0.60 0.20 30)',
            color: 'oklch(0.60 0.20 30)',
          }}>
            {error}
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading || !selectedPkg}
          className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'oklch(0.70 0.18 60)',
            color: 'oklch(0.10 0.02 270)',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              <Zap size={20} />
              {selectedPkg?.price.toLocaleString()}원 결제
            </>
          )}
        </button>

        {/* Summary */}
        {selectedPkg && (
          <div className="mt-8 p-6 rounded-xl border" style={{
            background: 'oklch(0.15 0.05 270)',
            borderColor: 'oklch(0.78 0.15 85 / 20%)',
          }}>
            <h3 className="font-semibold mb-4" style={{ color: 'oklch(0.94 0.015 90)' }}>
              결제 요약
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'oklch(0.78 0.15 85)' }}>패키지</span>
                <span style={{ color: 'oklch(0.94 0.015 90)' }}>{selectedPkg.description}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'oklch(0.78 0.15 85)' }}>크레딧</span>
                <span style={{ color: 'oklch(0.94 0.015 90)' }}>{selectedPkg.credits}개</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'oklch(0.78 0.15 85)' }}>가격</span>
                <span style={{ color: 'oklch(0.94 0.015 90)' }}>₩{selectedPkg.price.toLocaleString()}</span>
              </div>
              {selectedPkg.discount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'oklch(0.78 0.15 85)' }}>할인</span>
                  <span style={{ color: 'oklch(0.70 0.18 60)' }}>-{selectedPkg.discount}%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
