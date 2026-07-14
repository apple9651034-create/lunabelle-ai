import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { ChevronLeft, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function ConsultationBooking() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/consultation/:duration');
  const duration = (params?.duration as '20' | '50') || '20';
  const { user } = useAuth();
  
  const [consultationTopic, setConsultationTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [portOneLoaded, setPortOneLoaded] = useState(false);

  // tRPC mutation을 컴포넌트 최상단에서 선언 (hooks 규칙 준수)
  const createSessionMutation = trpc.consultation.createSession.useMutation();

  const price = duration === '20' ? 22000 : 55000;
  const priceText = duration === '20' ? '22,000원' : '55,000원';

  // PortOne 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.portone.io/v2/browser-sdk.js';
    script.async = true;
    script.onload = () => {
      setPortOneLoaded(true);
    };
    script.onerror = () => {
      console.error('PortOne SDK 로드 실패');
      setError('결제 시스템을 불러올 수 없습니다.');
    };
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handlePayment = useCallback(async () => {
    if (!user) {
      navigate('/');
      return;
    }

    if (!consultationTopic.trim()) {
      setError('상담 주제를 입력해주세요.');
      return;
    }

    if (!portOneLoaded) {
      setError('결제 시스템을 불러올 수 없습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const storeId = import.meta.env.VITE_PORTONE_STORE_ID;
      const channelKey = import.meta.env.VITE_PORTONE_CHANNEL_KEY;

      if (!storeId || !channelKey) {
        setError('결제 설정이 완료되지 않았습니다.');
        setIsLoading(false);
        return;
      }

      // PortOne V2 SDK 사용
      const IMP = (window as any).PortOne;
      if (!IMP) {
        setError('결제 시스템을 불러올 수 없습니다.');
        setIsLoading(false);
        return;
      }

      const merchantUid = `consultation_${Date.now()}`;

      // PortOne V2 결제 요청
      const response = await IMP.requestPayment({
        storeId: storeId,
        channelKey: channelKey,
        paymentId: merchantUid,
        orderName: `루나벨 ${duration}분 상담`,
        totalAmount: price,
        currency: 'KRW',
        payMethod: 'CARD',
        customer: {
          customerId: String(user.id),
          email: user.email || 'user@example.com',
          name: user.name || '사용자',
        },
      });

      if (response.code === 'Success') {
        // 결제 성공 - 서버에서 검증
        try {
          const result = await createSessionMutation.mutateAsync({
            duration: duration as '20' | '50',
            paymentId: response.paymentId,
            paymentMethod: 'CARD',
            consultationTopic,
          });

          if (result && result.id) {
            navigate(`/consultation/success/${result.id}?duration=${duration}`);
          } else {
            setError('상담 예약 중 오류가 발생했습니다.');
          }
        } catch (err) {
          console.error('세션 생성 오류:', err);
          setError('상담 예약 중 오류가 발생했습니다.');
        }
      } else {
        setError(`결제 실패: ${response.message || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error('결제 처리 오류:', err);
      setError('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [user, consultationTopic, duration, price, navigate, portOneLoaded, createSessionMutation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-purple-300" />
          </button>
          <h1 className="text-3xl font-light text-purple-200">루나벨 상담 예약</h1>
        </div>

        {/* Consultation Info Card */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-400 font-light text-sm mb-2">상담 시간</p>
              <p className="text-3xl font-light text-purple-200">{duration}분</p>
            </div>
            <div>
              <p className="text-gray-400 font-light text-sm mb-2">상담 금액</p>
              <p className="text-3xl font-light text-purple-200">{priceText}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-gray-300 font-light">
              {duration === '20'
                ? '20분 동안 루나벨과 1:1 전화 상담을 진행합니다.'
                : '50분 동안 루나벨과 깊이 있는 1:1 전화 상담을 진행합니다.'}
            </p>
          </div>
        </div>

        {/* Consultation Topic Input */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <label className="block mb-4">
            <p className="text-purple-300 font-light mb-3">상담 주제</p>
            <textarea
              value={consultationTopic}
              onChange={(e) => setConsultationTopic(e.target.value)}
              placeholder="상담받고 싶은 주제나 고민을 자유롭게 적어주세요..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 font-light focus:outline-none focus:border-purple-400 transition-all"
              rows={5}
            />
          </label>
          <p className="text-sm text-gray-400 font-light">
            루나벨이 당신의 상담 내용을 바탕으로 더 깊이 있는 조언을 드릴 수 있습니다.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="backdrop-blur-md bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-8">
            <p className="text-red-300 font-light">{error}</p>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading || !portOneLoaded}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              결제 진행 중...
            </>
          ) : !portOneLoaded ? (
            '결제 시스템 로드 중...'
          ) : (
            `${priceText}로 상담 예약하기`
          )}
        </button>

        {/* Info Box */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-6 mt-8">
          <h3 className="text-purple-300 font-light mb-3">상담 진행 방식</h3>
          <ul className="space-y-2 text-gray-300 font-light text-sm">
            <li>✓ 결제 후 루나벨이 곧 전화로 연락드립니다.</li>
            <li>✓ 편한 시간에 전화를 받으실 수 있습니다.</li>
            <li>✓ 상담 종료 후 특별한 조언 카드를 받으실 수 있습니다.</li>
            <li>✓ 모든 상담 내용은 마이페이지에서 다시 확인할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
