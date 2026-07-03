/**
 * 실시간 운세 상담 채팅
 * 사주 명식을 기반으로 AI 루나가 맞춤형 상담 제공
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { getUserSajuProfile, getSajuContext, getSajuMingshik } from '@/lib/userSajuProfile';
import { Streamdown } from 'streamdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SajuConsultationPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userProfile = getUserSajuProfile();

  useEffect(() => {
    // 초기 인사말
    const initialMessage: Message = {
      id: '0',
      role: 'assistant',
      content: `안녕하세요, 저는 AI 루나입니다. 당신의 사주(${getSajuMingshik()})를 분석하여 맞춤형 운세 상담을 제공해드립니다.\n\n당신의 사주 정보:\n- 생년월일: ${userProfile.year}년 ${userProfile.month}월 ${userProfile.day}일 오전 ${userProfile.hour}시 ${userProfile.minute}분 (양력)\n- 사주 명식: ${getSajuMingshik()}\n- 성격: ${userProfile.personality}\n- 운세: ${userProfile.luck}\n\n무엇을 알고 싶으신가요? 당신의 운명, 직업, 연애, 재운 등 어떤 주제든 상담해드릴 수 있습니다.`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `당신은 AI 루나, 신비로운 운세 상담사입니다. 사용자의 사주를 기반으로 정확하고 깊이 있는 상담을 제공합니다.\n\n${getSajuContext()}\n\n사용자의 질문에 대해 사주 분석을 바탕으로 따뜻하고 희망적인 조언을 제공하세요.`,
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
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || '죄송합니다. 응답을 생성할 수 없었습니다.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('채팅 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 현재 상담이 불가능합니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* 헤더 */}
      <div className="p-4 border-b flex items-center justify-between" style={{ background: 'oklch(0.18 0.08 290)', borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:opacity-70">
            <ArrowLeft size={20} style={{ color: 'oklch(0.94 0.015 90)' }} />
          </button>
          <div>
            <h1 className="font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>🌙 AI 루나 운세 상담</h1>
            <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>사주 명식: {getSajuMingshik()}</p>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg"
              style={{
                background: msg.role === 'user' ? 'oklch(0.50 0.28 290)' : 'oklch(0.20 0.05 270)',
                color: msg.role === 'user' ? 'oklch(1 0 0)' : 'oklch(0.94 0.015 90)',
                border: msg.role === 'assistant' ? '1px solid oklch(1 0 0 / 10%)' : 'none',
              }}
            >
              {msg.role === 'assistant' ? (
                <Streamdown>{msg.content}</Streamdown>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              <p className="text-xs mt-2" style={{ color: msg.role === 'user' ? 'oklch(1 0 0 / 70%)' : 'oklch(0.70 0.02 290)' }}>
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-lg" style={{ background: 'oklch(0.20 0.05 270)' }}>
              <Loader2 size={20} className="animate-spin" style={{ color: 'oklch(0.78 0.15 85)' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t" style={{ background: 'oklch(0.18 0.08 290)', borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="운세에 대해 궁금한 점을 물어보세요..."
            className="flex-1 px-4 py-2 rounded-lg outline-none"
            style={{
              background: 'oklch(0.25 0.05 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(1 0 0 / 10%)',
            }}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: 'oklch(0.50 0.28 290)',
              color: 'oklch(1 0 0)',
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
