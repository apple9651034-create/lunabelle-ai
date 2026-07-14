import React from 'react';
import { useLocation, useRoute } from 'wouter';
import { CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConsultationPaymentSuccess() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/consultation/success/:sessionId');
  const sessionId = params?.sessionId;
  const duration = new URLSearchParams(window.location.search).get('duration') || '20';
  const phoneNumber = import.meta.env.VITE_LUNABELLE_PHONE || '010-1234-5678';

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-400" />
          </div>
          <h1 className="text-4xl font-light text-purple-200 mb-4">
            결제가 확인되었습니다.
          </h1>
          <p className="text-gray-300 font-light text-lg">
            {duration}분 상담 예약이 완료되었습니다.
          </p>
        </div>

        {/* Session Info Card */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-400 font-light text-sm mb-2">상담 시간</p>
              <p className="text-2xl font-light text-purple-200">{duration}분</p>
            </div>
            <div>
              <p className="text-gray-400 font-light text-sm mb-2">상담 금액</p>
              <p className="text-2xl font-light text-purple-200">
                {duration === '20' ? '22,000원' : '55,000원'}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-gray-300 font-light mb-4">
              루나벨이 곧 연락드릴 예정입니다.
            </p>
            <p className="text-sm text-gray-400 font-light">
              아래 버튼을 클릭하여 바로 전화를 받으실 수 있습니다.
            </p>
          </div>
        </div>

        {/* Call Button */}
        <button
          onClick={handleCall}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-3 mb-6"
        >
          <Phone className="w-5 h-5" />
          📞 루나벨에게 전화하기
        </button>

        {/* Additional Info */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h3 className="text-purple-300 font-light mb-3">상담 후 특별한 선물</h3>
          <p className="text-gray-300 font-light text-sm mb-3">
            상담이 종료된 후 앱에 접속하면
          </p>
          <p className="text-purple-200 font-light">
            "오늘의 조언 카드가 도착했습니다."
          </p>
          <p className="text-gray-400 font-light text-sm mt-3">
            루나벨이 당신의 상담 내용을 바탕으로 생성한 특별한 조언 카드를 받아보세요.
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full px-8 py-3 border border-purple-400/50 text-purple-300 rounded-full font-light hover:bg-purple-400/10 transition-all duration-300"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
