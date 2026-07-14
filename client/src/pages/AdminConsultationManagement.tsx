import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function AdminConsultationManagement() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardReading, setCardReading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 관리자 확인
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 font-light mb-4">관리자만 접근 가능합니다.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-purple-400/50 text-purple-300 rounded-full font-light hover:bg-purple-400/10 transition-all"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const completeMutation = trpc.consultation.completeSession.useMutation({
    onSuccess: () => {
      setMessage('상담이 완료되었습니다.');
      setConsultationNotes('');
      setSelectedSessionId(null);
    },
    onError: (error) => {
      setMessage(`오류: ${error.message}`);
    },
  });

  const createCardMutation = trpc.consultation.createAdviceCard.useMutation({
    onSuccess: () => {
      setMessage('조언 카드가 생성되었습니다.');
      setCardName('');
      setCardReading('');
    },
    onError: (error) => {
      setMessage(`오류: ${error.message}`);
    },
  });

  const handleCompleteConsultation = async () => {
    if (!selectedSessionId) return;

    setIsLoading(true);
    try {
      await completeMutation.mutateAsync({
        sessionId: selectedSessionId,
        consultationNotes,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdviceCard = async () => {
    if (!selectedSessionId || !cardName || !cardReading) {
      setMessage('모든 필드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await createCardMutation.mutateAsync({
        sessionId: selectedSessionId,
        cardName,
        cardReading,
        cardType: 'tarot',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-purple-200 mb-2">상담 관리</h1>
          <p className="text-gray-300 font-light">루나벨 1:1 상담 세션을 관리합니다.</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`backdrop-blur-md ${
            message.includes('오류') 
              ? 'bg-red-500/10 border-red-400/30' 
              : 'bg-green-500/10 border-green-400/30'
          } border rounded-lg p-4 mb-8`}>
            <p className={`${
              message.includes('오류') ? 'text-red-300' : 'text-green-300'
            } font-light`}>
              {message}
            </p>
          </div>
        )}

        {/* Session Selection */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-light text-purple-300 mb-4">상담 세션 선택</h2>
          <div className="space-y-3">
            <label className="block">
              <p className="text-gray-300 font-light text-sm mb-2">세션 ID</p>
              <input
                type="number"
                value={selectedSessionId || ''}
                onChange={(e) => setSelectedSessionId(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="세션 ID를 입력하세요"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 font-light focus:outline-none focus:border-purple-400 transition-all"
              />
            </label>
          </div>
        </div>

        {selectedSessionId && (
          <>
            {/* Complete Consultation */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-light text-purple-300 mb-4">상담 완료</h2>
              <div className="space-y-4">
                <label className="block">
                  <p className="text-gray-300 font-light text-sm mb-2">상담 내용 메모</p>
                  <textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="상담 내용을 요약해주세요..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 font-light focus:outline-none focus:border-purple-400 transition-all"
                    rows={4}
                  />
                </label>
                <button
                  onClick={handleCompleteConsultation}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      상담 완료 처리
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Create Advice Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-light text-purple-300 mb-4">조언 카드 생성</h2>
              <div className="space-y-4">
                <label className="block">
                  <p className="text-gray-300 font-light text-sm mb-2">카드명</p>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="예: 새로운 시작의 카드"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 font-light focus:outline-none focus:border-purple-400 transition-all"
                  />
                </label>
                <label className="block">
                  <p className="text-gray-300 font-light text-sm mb-2">카드 조언</p>
                  <textarea
                    value={cardReading}
                    onChange={(e) => setCardReading(e.target.value)}
                    placeholder="루나벨의 조언을 입력하세요..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 font-light focus:outline-none focus:border-purple-400 transition-all"
                    rows={5}
                  />
                </label>
                <button
                  onClick={handleCreateAdviceCard}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    '조언 카드 생성'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
