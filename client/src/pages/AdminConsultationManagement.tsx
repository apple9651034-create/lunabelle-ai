import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, Loader, AlertCircle, ChevronLeft, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function AdminConsultationManagement() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [processedCard, setProcessedCard] = useState<{ name: string; reading: string } | null>(null);

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

  // 결제 완료된 상담 목록 조회
  const { data: sessions, isLoading: sessionsLoading, refetch } = trpc.consultation.getAdminPendingSessions.useQuery();

  // 상담 완료 및 자동 카드 생성
  const completeSessionMutation = trpc.consultation.completeSessionWithAutoCard.useMutation({
    onSuccess: (data) => {
      setMessage('상담이 완료되었습니다. 조언 카드가 생성되었습니다.');
      setProcessedCard(data.card);
      setIsProcessing(false);
      // 목록 새로고침
      refetch();
      // 5초 후 메시지 초기화
      setTimeout(() => {
        setMessage('');
        setProcessedCard(null);
        setSelectedSessionId(null);
      }, 5000);
    },
    onError: (error) => {
      setMessage(`오류: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const handleCompleteSession = async () => {
    if (!selectedSessionId) return;

    setIsProcessing(true);
    setMessage('');
    setProcessedCard(null);

    try {
      await completeSessionMutation.mutateAsync({
        sessionId: selectedSessionId,
      });
    } catch (err) {
      console.error('상담 완료 오류:', err);
    }
  };

  if (sessionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
          <p className="text-purple-300 font-light">상담 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-purple-300" />
          </button>
          <div>
            <h1 className="text-3xl font-light text-purple-200">상담 관리</h1>
            <p className="text-gray-300 font-light">루나벨 1:1 상담 세션을 관리합니다.</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`backdrop-blur-md ${
              message.includes('오류')
                ? 'bg-red-500/10 border-red-400/30'
                : 'bg-green-500/10 border-green-400/30'
            } border rounded-lg p-4 mb-8`}
          >
            <p
              className={`${
                message.includes('오류') ? 'text-red-300' : 'text-green-300'
              } font-light`}
            >
              {message}
            </p>
          </div>
        )}

        {/* Processed Card Preview */}
        {processedCard && (
          <div className="backdrop-blur-md bg-purple-500/10 border border-purple-400/30 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-purple-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-purple-200 font-light mb-2">생성된 조언 카드</h3>
                <p className="text-purple-300 font-light mb-2">
                  <strong>{processedCard.name}</strong>
                </p>
                <p className="text-gray-300 font-light text-sm">{processedCard.reading}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sessions List */}
        {sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-light text-purple-300 mb-4">
              결제 완료된 상담 ({sessions.length}건)
            </h2>

            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setMessage('');
                  setProcessedCard(null);
                }}
                className={`backdrop-blur-md border rounded-2xl p-6 cursor-pointer transition-all ${
                  selectedSessionId === session.id
                    ? 'bg-purple-500/20 border-purple-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 font-light text-sm mb-1">사용자</p>
                    <p className="text-purple-200 font-light">{session.userName}</p>
                    <p className="text-gray-400 font-light text-xs">{session.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-light text-sm mb-1">상담 정보</p>
                    <p className="text-purple-200 font-light">
                      {session.duration}분 상담 · {(session.price / 1000).toLocaleString()}원
                    </p>
                    <p className="text-gray-400 font-light text-xs">
                      {new Date(session.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>

                {session.consultationTopic && (
                  <div className="mb-4">
                    <p className="text-gray-400 font-light text-sm mb-1">상담 주제</p>
                    <p className="text-gray-300 font-light text-sm">{session.consultationTopic}</p>
                  </div>
                )}

                {selectedSessionId === session.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteSession();
                    }}
                    disabled={isProcessing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isProcessing ? (
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
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 font-light">완료할 상담이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
