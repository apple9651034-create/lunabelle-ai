/* AI 루나 — TarotConsultationPage.tsx
 * 타로 실시간 AI 채팅 상담
 * 사용자의 질문에 대해 타로 카드를 기반으로 AI 루나가 맞춤형 상담 제공
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2, Download, Share2 } from 'lucide-react';
import ConsultationQRCode from '@/components/ConsultationQRCode';
import RecommendedTalisman from '@/components/RecommendedTalisman';
import { useLocation } from 'wouter';
import ChatLoadingWithTips from '@/components/ChatLoadingWithTips';
import ConsultationShareButtons from '@/components/ConsultationShareButtons';
import { Streamdown } from 'streamdown';
import html2canvas from 'html2canvas';
import { trpc } from '@/lib/trpc';
import { TAROT_SYSTEM_PROMPT_ENHANCED } from '@/lib/tarotPromptEnhanced';

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
  const [showQRCode, setShowQRCode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 초기 인사말
    const initialMessage: Message = {
      id: '0',
      role: 'assistant',
      content: `안녕하세요, 저는 AI 루나입니다. 신비로운 타로의 세계에 오신 것을 환영합니다.\n\n타로는 78장의 카드로 이루어져 있으며, 각 카드는 깊은 의미와 상징을 담고 있습니다. 대아르카나 22장은 인생의 큰 여정을, 소아르카나 56장은 일상의 세부 사항을 나타냅니다.\n\n달빛님의 질문이나 상황에 대해 말씀해주시면, 타로 카드의 지혜를 통해 깊이 있는 상담을 제공해드리겠습니다.\n\n무엇을 알고 싶으신가요?`,
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
              content: TAROT_SYSTEM_PROMPT_ENHANCED
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
      let content = '';
      
      if (data.choices && data.choices[0]) {
        const choice = data.choices[0];
        if (choice.message && choice.message.content) {
          content = choice.message.content;
        } else if (choice.content) {
          content = choice.content;
        }
      } else if (data.content) {
        content = data.content;
      }
      
      if (!content) {
        console.error('[Tarot] No content in response:', data);
        throw new Error('Empty response content');
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
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
    }
  };

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
            <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>타로 카드의 지혜로 달빛님의 길을 밝혀드립니다</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConsultationShareButtons consultationType="타로" messages={messages} />
        </div>
      </div>

      {/* 메시지 영역 */}
      <div id="consultation-messages" className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <div className="text-sm leading-relaxed">
                  <Streamdown>{msg.content}</Streamdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              <p className="text-xs mt-2" style={{ color: msg.role === 'user' ? 'oklch(1 0 0 / 70%)' : 'oklch(0.70 0.02 290)' }}>
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <ChatLoadingWithTips category="tarot" />
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
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg transition-colors disabled:opacity-50"
            style={{
              background: 'oklch(0.70 0.18 60)',
              color: 'oklch(0.10 0.02 270)',
            }}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
          {showQRCode && (
        <ConsultationQRCode
          consultationType="타로"
          consultationId={Date.now().toString()}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  );
}
