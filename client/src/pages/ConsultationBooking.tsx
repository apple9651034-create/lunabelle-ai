import React, { useState } from 'react';
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

  const price = duration === '20' ? 22000 : 55000;
  const priceText = duration === '20' ? '22,000원' : '55,000원';

  const handlePayment = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    if (!consultationTopic.trim()) {
      setError('상담 주제를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // PortOne 결제 초기화
      if (typeof window !== 'undefined' && (window as any).IMP) {
        const IMP = (window as any).IMP;
        IMP.init('imp12345678'); // 실제 PortOne 가맹점 ID로 변경

        IMP.request_pay(
          {
            pg: 'kcp',
            pay_method: 'card',
            merchant_uid: `consultation_${Date.now()}`,
            name: `루나벨 ${duration}분 상담`,
            amount: price,
            buyer_email: user.email || 'user@example.com',
            buyer_name: user.name || '사용자',
            buyer_tel: '010-0000-0000',
          },
          async (rsp: any) => {
            if (rsp.success) {
              try {
                // 결제 검증 및 세션 생성
                const result = await trpc.consultation.createSession.useMutation({
                  onSuccess: (data) => {
                    if (data.success) {
                      navigate(`/consultation/success/${data.sessionId}?duration=${duration}`);
                    }
                  },
                  onError: () => {
                    setError('상담 예약 중 오류가 발생했습니다.');
                    setIsLoading(false);
                  },
                }).mutateAsync({
                  duration,
                  paymentId: rsp.imp_uid,
                  paymentMethod: rsp.pay_method,
                  consultationTopic,
                });

                if (result?.success) {
                  navigate(`/consultation/success/${result.sessionId}?duration=${duration}`);
                }


              } catch (err) {
                setError('상담 예약 중 오류가 발생했습니다.');
              }
            } else {
              setError('결제가 취소되었습니다.');
            }
            setIsLoading(false);
          }
        );
      } else {
        setError('결제 시스템을 불러올 수 없습니다.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('결제 처리 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

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
          disabled={isLoading}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              결제 진행 중...
            </>
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
