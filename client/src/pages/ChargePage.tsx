/**
 * ChargePage.tsx
 * 포트원 결제를 통한 크레딧 충전 페이지
 */
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Zap, Check, AlertCircle, Loader2 } from 'lucide-react';
import { usePortonePayment } from '@/lib/usePortonePayment';

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
  const { requestPayment, isReady } = usePortonePayment();

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
          // 결제 성공 후 크레딧 추가 (로컬스토리지)
          const currentCharges = parseInt(localStorage.getItem('luna_charges') || '10');
          localStorage.setItem('luna_charges', String(currentCharges + selectedPkg.credits));
          
          // 성공 메시지
          alert(`✅ ${selectedPkg.credits}개의 크레딧이 충전되었습니다!`);
          navigate('/');
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
          <div className="flex gap-3 mb-3">
            <Zap size={24} style={{ color: 'oklch(0.78 0.15 85)' }} />
            <div>
              <h2 className="font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                크레딧이란?
              </h2>
              <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
                크레딧은 AI 루나의 모든 상담 서비스를 이용하기 위한 통화입니다.
                사주 분석(3개), 타로 검속(1개), 육효 점술(2개), AI 채팅(메시지당 1개) 등에 사용됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold mb-6 tracking-widest uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
            💎 충전 패키지 선택
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {CHARGE_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className="relative p-4 rounded-2xl border transition-all duration-300"
                style={{
                  background: selectedPackage === pkg.id ? 'oklch(0.20 0.08 290)' : 'oklch(0.15 0.04 270)',
                  borderColor: selectedPackage === pkg.id ? 'oklch(0.78 0.15 85)' : 'oklch(1 0 0 / 8%)',
                  boxShadow: selectedPackage === pkg.id ? '0 0 20px oklch(0.55 0.25 290 / 20%)' : 'none',
                  transform: selectedPackage === pkg.id ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{
                    background: 'oklch(0.78 0.15 85)',
                    color: 'oklch(0.10 0.02 270)',
                  }}>
                    인기
                  </div>
                )}

                <div className="text-center">
                  <p className="text-xs mb-2" style={{ color: 'oklch(0.60 0.02 290)' }}>
                    {pkg.description}
                  </p>
                  <div className="mb-3">
                    <p className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                      {pkg.credits}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.60 0.02 290)' }}>
                      크레딧
                    </p>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg font-bold" style={{ color: 'oklch(0.78 0.15 85)' }}>
                      ₩{pkg.price.toLocaleString()}
                    </span>
                    {pkg.discount > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full" style={{
                        background: 'oklch(0.70 0.18 60)',
                        color: 'oklch(0.10 0.02 270)',
                      }}>
                        {pkg.discount}% 할인
                      </span>
                    )}
                  </div>
                </div>

                {selectedPackage === pkg.id && (
                  <div className="absolute top-2 right-2 p-1 rounded-full" style={{ background: 'oklch(0.78 0.15 85)' }}>
                    <Check size={16} style={{ color: 'oklch(0.10 0.02 270)' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedPkg && (
          <div className="mb-12 p-6 rounded-2xl border" style={{
            background: 'oklch(0.18 0.08 290)',
            borderColor: 'oklch(0.78 0.15 85 / 30%)',
          }}>
            <h3 className="font-bold mb-4" style={{ color: 'oklch(0.94 0.015 90)' }}>
              결제 요약
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'oklch(0.60 0.02 290)' }}>상품명</span>
                <span style={{ color: 'oklch(0.94 0.015 90)' }}>
                  {selectedPkg.credits}개 크레딧 ({selectedPkg.description})
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'oklch(0.60 0.02 290)' }}>가격</span>
                <span style={{ color: 'oklch(0.94 0.015 90)' }}>
                  ₩{selectedPkg.price.toLocaleString()}
                </span>
              </div>
              {selectedPkg.discount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'oklch(0.60 0.02 290)' }}>할인</span>
                  <span style={{ color: 'oklch(0.70 0.18 60)' }}>
                    -₩{Math.floor(selectedPkg.price * selectedPkg.discount / 100).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold" style={{
                borderColor: 'oklch(1 0 0 / 8%)',
              }}>
                <span style={{ color: 'oklch(0.60 0.02 290)' }}>최종 가격</span>
                <span style={{ color: 'oklch(0.78 0.15 85)' }}>
                  ₩{selectedPkg.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border flex gap-3" style={{
            background: 'oklch(0.20 0.08 0)',
            borderColor: 'oklch(0.70 0.18 60)',
          }}>
            <AlertCircle size={20} style={{ color: 'oklch(0.70 0.18 60)', flexShrink: 0 }} />
            <p style={{ color: 'oklch(0.70 0.18 60)' }}>{error}</p>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading || !isReady}
          className="w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          style={{
            background: isLoading || !isReady ? 'oklch(0.40 0.15 290)' : 'oklch(0.50 0.28 290)',
            color: 'oklch(1 0 0)',
            opacity: isLoading || !isReady ? 0.6 : 1,
            cursor: isLoading || !isReady ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              결제 진행 중...
            </>
          ) : (
            <>
              <Zap size={20} />
              {selectedPkg?.price.toLocaleString()}원 결제하기
            </>
          )}
        </button>

        {!isReady && (
          <p className="text-center text-sm mt-4" style={{ color: 'oklch(0.70 0.18 60)' }}>
            ⚠️ 결제 시스템이 준비 중입니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 rounded-2xl border" style={{
          background: 'oklch(0.15 0.05 270)',
          borderColor: 'oklch(1 0 0 / 8%)',
        }}>
          <h3 className="font-bold mb-4" style={{ color: 'oklch(0.94 0.015 90)' }}>
            ℹ️ 안내사항
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
            <li>• 결제 후 크레딧은 즉시 충전됩니다.</li>
            <li>• 충전된 크레딧은 환불되지 않습니다.</li>
            <li>• 모든 결제는 포트원을 통해 안전하게 처리됩니다.</li>
            <li>• 결제 문제가 발생하면 고객 지원팀에 문의하세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
