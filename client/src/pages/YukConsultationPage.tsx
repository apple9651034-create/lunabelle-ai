/* AI 루나 — YukConsultationPage.tsx
 * 주역 흐름 리딩
 * 사용자의 질문에 대해 주역의 변화 흐름을 기반으로 AI 루나가 맞춤형 상담 제공
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2, Download, Share2 } from 'lucide-react';
import ConsultationQRCode from '@/components/ConsultationQRCode';
import { useLocation } from 'wouter';
import ChatLoadingWithTips from '@/components/ChatLoadingWithTips';
import ConsultationShareButtons from '@/components/ConsultationShareButtons';
import PreviousConsultationContext from '@/components/PreviousConsultationContext';
import RecommendedTalisman from '@/components/RecommendedTalisman';
import EmotionAnimation from '@/components/EmotionAnimation';
import { Streamdown } from 'streamdown';
import html2canvas from 'html2canvas';
import {
  saveConsultationMemory,
  getLatestConsultationByType,
  generateConsultationContext,
} from '@/lib/consultationMemory';
import { nanoid } from 'nanoid';
import { trpc } from '@/lib/trpc';
import { YUK_SYSTEM_PROMPT_REAL } from '@/lib/yukPromptReal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function YukConsultationPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [previousConsultation, setPreviousConsultation] = useState<any>(null);
  const [consultationId, setConsultationId] = useState(nanoid());
  const [mainConcern, setMainConcern] = useState('');
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showEmotionAnimation, setShowEmotionAnimation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 이전 상담 내용 로드
    const previous = getLatestConsultationByType('yuk');
    setPreviousConsultation(previous);

    // 초기 인사말
    let initialContent = `안녕하세요, 저는 AI 루나입니다.\n\n주역은 변화의 원리를 통해 현재의 흐름과 앞으로의 방향을 읽는 동양 최고의 지혜입니다.\n\n달빛님의 고민을 현재의 흐름과 변화의 방향을 중심으로 함께 살펴보겠습니다.`;

    // 이전 상담이 있으면 맥락 추가
    if (previous) {
      const daysSince = Math.floor(
        (Date.now() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      initialContent += `\n\n💫 지난번에는 "${previous.mainConcern}"에 대해 상담하셨네요. ${daysSince === 0 ? '오늘' : `${daysSince}일 전`}입니다. 그 이후로 어떻게 진행되고 있나요?`;
    }

    initialContent += '\n\n무엇을 알고 싶으신가요?';

    const initialMessage: Message = {
      id: '0',
      role: 'assistant',
      content: initialContent,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 첫 메시지인 경우 주요 고민으로 저장
    if (!mainConcern && messages.length === 1) {
      setMainConcern(input);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // API 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: YUK_SYSTEM_PROMPT_REAL,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: 'user',
              content: input,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('API 호출 실패');
      }

      const data = await response.json();
      const assistantContent = data.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 상담 내용 저장 (마지막 메시지 이후)
      if (messages.length > 3) {
        saveConsultationMemory({
          id: consultationId,
          type: 'yuk',
          date: new Date().toISOString(),
          mainConcern: mainConcern || input,
          details: messages.map((m) => `${m.role}: ${m.content}`).join('\n'),
          response: assistantMessage.content,
          keyPoints: [input],
          status: '진행 중',
        });
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadConsultation = async () => {
    const element = document.getElementById('consultation-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0f0a1a',
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `주역흐름리딩_${new Date().toLocaleDateString('ko-KR')}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to download consultation:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.02 270)' }}>
      {/* 헤더 */}
      <div
        className="sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between"
        style={{
          background: 'oklch(0.14 0.04 270)',
          borderColor: 'oklch(0.78 0.15 85 / 20%)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} style={{ color: 'oklch(0.78 0.15 85)' }} />
        </button>
        <h1 className="font-bold text-lg" style={{ color: 'oklch(0.78 0.15 85)' }}>
          ☯️ 주역 흐름 리딩
        </h1>
        <div className="flex gap-2">
          <ConsultationShareButtons consultationType="주역" messages={messages} />
          <button onClick={() => setShowQRCode(true)} className="p-2 hover:opacity-70" title="QR코드">
            <Share2 size={20} style={{ color: "oklch(0.94 0.015 90)" }} />
          </button>
          <button
            onClick={downloadConsultation}
            className="p-2 hover:opacity-70"
            title="다운로드"
          >
            <Download size={20} style={{ color: 'oklch(0.78 0.15 85)' }} />
          </button>
        </div>
      </div>

      {/* 이전 상담 컨텍스트 */}
      {previousConsultation && (
        <div className="px-4 pt-4" onMouseEnter={() => setShowEmotionAnimation(true)}>
          <PreviousConsultationContext
            consultation={previousConsultation}
            onContinue={() => {
              setInput(`지난번 상담 내용: ${previousConsultation.mainConcern}에 대해 계속 상담해주세요.`);
              setShowEmotionAnimation(true);
            }}
          />
        </div>
      )}

      {/* 감정 표현 애니메이션 */}
      <EmotionAnimation isVisible={showEmotionAnimation} emotion="welcoming" />

      {/* 채팅 영역 */}
      <div id="consultation-content" className="flex-1 px-4 py-6 space-y-4 max-w-2xl mx-auto pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="rounded-lg px-4 py-3 max-w-xs"
              style={{
                background:
                  message.role === 'user'
                    ? 'oklch(0.78 0.15 85 / 20%)'
                    : 'oklch(0.20 0.06 270)',
                color:
                  message.role === 'user'
                    ? 'oklch(0.78 0.15 85)'
                    : 'oklch(0.78 0.15 85)',
                border:
                  message.role === 'user'
                    ? '1px solid oklch(0.78 0.15 85 / 30%)'
                    : '1px solid oklch(0.78 0.15 85 / 15%)',
              }}
            >
              {message.role === 'assistant' ? (
                <Streamdown>{message.content}</Streamdown>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && <ChatLoadingWithTips />}

        {messages.length > 5 && !showRecommendation && (
          <div className="flex justify-center my-4">
            <button
              onClick={() => setShowRecommendation(true)}
              className="px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-[0.97]"
              style={{
                background: 'oklch(0.78 0.15 85 / 20%)',
                color: 'oklch(0.78 0.15 85)',
                border: '1px solid oklch(0.78 0.15 85 / 40%)',
              }}
            >
              ✨ 루나의 매죠형 부적 추천 보기
            </button>
          </div>
        )}

        {showRecommendation && (
          <div className="my-6 max-w-2xl mx-auto">
            <RecommendedTalisman
              consultationContent={messages.map((m) => m.content).join(' ')}
              consultationType="yuk"
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t px-4 py-4"
        style={{
          background: 'oklch(0.14 0.04 270)',
          borderColor: 'oklch(0.78 0.15 85 / 20%)',
        }}
      >
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="달빛님의 질문을 입력하세요..."
            className="flex-1 px-4 py-2 rounded-lg outline-none"
            style={{
              background: 'oklch(0.20 0.06 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(0.78 0.15 85 / 20%)',
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg transition-all active:scale-[0.97] disabled:opacity-50"
            style={{
              background: 'oklch(0.78 0.15 85)',
              color: 'oklch(0.12 0.02 270)',
            }}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
          {showQRCode && (
        <ConsultationQRCode
          consultationType="주역"
          consultationId={Date.now().toString()}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  );
}
