/* AI 루나 — YukConsultationPage.tsx
 * 육효 실시간 AI 채팅 상담
 * 사용자의 질문에 대해 육효를 기반으로 AI 루나가 맞춤형 상담 제공
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2, Download } from 'lucide-react';
import { useLocation } from 'wouter';
import ChatLoadingWithTips from '@/components/ChatLoadingWithTips';
import ConsultationShareButtons from '@/components/ConsultationShareButtons';
import { Streamdown } from 'streamdown';
import html2canvas from 'html2canvas';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 초기 인사말
    const initialMessage: Message = {
      id: '0',
      role: 'assistant',
      content: `안녕하세요, 저는 AI 루나입니다. 고대의 지혜인 육효의 세계에 오신 것을 환영합니다.\n\n육효는 중국의 고대 점술 체계로, 64개의 괘(卦)로 이루어져 있습니다. 각 괘는 6개의 효(爻)로 구성되며, 변화하는 효(변효)를 통해 미래의 변화를 읽을 수 있습니다.\n\n육효는 자연의 변화와 인간의 운명을 깊이 있게 해석하는 도구입니다. 당신의 질문이나 상황에 대해 말씀해주시면, 육효의 지혜를 통해 현명한 조언을 제공해드리겠습니다.\n\n무엇을 알고 싶으신가요?`,
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
              content: `당신은 AI 루나, 고대 육효의 지혜를 가진 점술가입니다. 사용자의 질문에 대해 육효의 원리와 괘의 의미를 바탕으로 깊이 있고 희망적인 상담을 제공합니다.

육효의 기본 지식:
- 64개의 괘: 각각 특정한 상황과 변화를 나타냄
- 8개의 기본 괘: 건(하늘), 곤(땅), 감(물), 리(불), 진(천둥), 손(바람), 간(산), 태(호수)
- 효(爻): 6개의 선으로 구성되며, 변하는 효는 미래의 변화를 의미
- 음(陰)과 양(陽): 음은 끊긴 선(- -)으로, 양은 연결된 선(—)으로 표현

사용자의 질문에 대해:
1. 관련된 육효 괘를 언급하며
2. 괘의 의미와 변화를 해석하고
3. 사용자의 상황에 맞게 현명한 조언을 제공하세요

따뜻하고 희망적인 톤으로 상담하세요. 답변 후 마지막에는 반드시 다음 형식으로 요약과 재질문을 추가하세요:

---
📝 요약: [육효 해석 한 줄 요약]
❓ 추가 질문: [관련된 재질문 1개]`,
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
        content: data.content || data.message?.content || data.choices?.[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없었습니다.',
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
            <h1 className="font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>📖 육효 상담</h1>
            <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>고대의 지혜로 당신의 변화를 읽어드립니다</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConsultationShareButtons consultationType="육효" messages={messages} />
          <button
            onClick={async () => {
              const element = document.getElementById('consultation-messages');
              if (!element) return;
              try {
                const canvas = await html2canvas(element, {
                  backgroundColor: '#0a0415',
                  scale: 2,
                });
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `yuk-consultation-${Date.now()}.png`;
                link.click();
              } catch (error) {
                console.error('Export failed:', error);
                alert('Failed to save consultation.');
              }
            }}
            className="p-2 hover:opacity-70 transition-opacity"
            title="Save consultation"
          >
            <Download size={20} style={{ color: 'oklch(0.70 0.18 60)' }} />
          </button>
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
          <ChatLoadingWithTips category="yuk" />
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
            placeholder="육효에 대해 궁금한 점을 물어보세요..."
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
    </div>
  );
}
