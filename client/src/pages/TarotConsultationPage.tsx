/* AI 루나 — TarotConsultationPage.tsx
 * 타로 실시간 AI 채팅 상담
 * 사용자의 질문에 대해 타로 카드를 기반으로 AI 루나가 맞춤형 상담 제공
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import MysticalLoadingAnimation from '@/components/MysticalLoadingAnimation';
import TypingEffect from '@/components/TypingEffect';
import ChatLoadingWithTips from '@/components/ChatLoadingWithTips';
import { Streamdown } from 'streamdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function TarotConsultationPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'analyzing' | 'divining' | 'interpreting' | 'completing'>('analyzing');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 초기 인사말
    const initialMessage: Message = {
      id: '0',
      role: 'assistant',
      content: `안녕하세요, 저는 AI 루나입니다. 신비로운 타로의 세계에 오신 것을 환영합니다.\n\n타로는 78장의 카드로 이루어져 있으며, 각 카드는 깊은 의미와 상징을 담고 있습니다. 대아르카나 22장은 인생의 큰 여정을, 소아르카나 56장은 일상의 세부 사항을 나타냅니다.\n\n당신의 질문이나 상황에 대해 말씀해주시면, 타로 카드의 지혜를 통해 깊이 있는 상담을 제공해드리겠습니다.\n\n무엇을 알고 싶으신가요?`,
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
    setLoadingStage('analyzing');

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
              content: `당신은 AI 루나, 신비로운 타로 점술가입니다. 사용자의 질문에 대해 타로 카드의 상징과 의미를 바탕으로 깊이 있고 희망적인 상담을 제공합니다.

타로 카드의 기본 지식:
- 대아르카나(22장): 인생의 큰 변화와 영적 여정을 나타냄 (바보, 마술사, 여사제, 황제, 황후, 교황, 연인, 전차, 강인함, 은둔자, 운명의 바퀴, 정의, 매달린 자, 죽음, 절제, 악마, 탑, 별, 달, 태양, 심판, 세계)
- 소아르카나(56장): 완드(창의성/열정), 펜타클(물질/안정), 검(지성/갈등), 컵(감정/관계)

사용자의 질문에 대해:
1. 관련된 타로 카드를 언급하며
2. 카드의 의미를 해석하고
3. 사용자의 상황에 맞게 조언을 제공하세요

따뜻하고 희망적인 톤으로 상담하세요.`,
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

      setLoadingStage('divining');
      const data = await response.json();
      setLoadingStage('interpreting');
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || '죄송합니다. 응답을 생성할 수 없었습니다.',
        timestamp: new Date(),
      };

      setLoadingStage('completing');
      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        setLoadingStage('analyzing');
      }, 800);
    } catch (error) {
      console.error('채팅 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 현재 상담이 불가능합니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      setLoadingStage('analyzing');
    }
  };

  if (isLoading) {
    return <MysticalLoadingAnimation isLoading={isLoading} stage={loadingStage} category="tarot" />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* 헤더 */}
      <div className="p-4 border-b flex items-center justify-between" style={{ background: 'oklch(0.18 0.08 290)', borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:opacity-70">
            <ArrowLeft size={20} style={{ color: 'oklch(0.94 0.015 90)' }} />
          </button>
          <div>
            <h1 className="font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>🃏 타로 상담</h1>
            <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>타로 카드의 지혜로 당신의 길을 밝혀드립니다</p>
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
                <TypingEffect text={msg.content} speed={20} />
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
          <div className="flex justify-center w-full">
            <ChatLoadingWithTips category="tarot" />
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
            placeholder="타로에 대해 궁금한 점을 물어보세요..."
            className="flex-1 px-4 py-2 rounded-lg outline-none"
            style={{
              background: 'oklch(0.25 0.05 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'oklch(0.55 0.25 290 / 60%)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'oklch(1 0 0 / 15%)'; }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              color: 'oklch(1 0 0)',
              boxShadow: '0 4px 15px oklch(0.55 0.25 290 / 30%)',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
