/*
 * SajuConsultationPage.tsx
 * 실시간 운세 상담 채팅
 * 사주 명식을 기반으로 AI 루나가 맞춤형 상담 제공
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2, Download } from 'lucide-react';
import { useLocation } from 'wouter';
import ChatLoadingWithTips from '@/components/ChatLoadingWithTips';
import ConsultationShareButtons from '@/components/ConsultationShareButtons';
import { getUserSajuProfile, getSajuContext, getSajuMingshik } from '@/lib/userSajuProfile';
import { Streamdown } from 'streamdown';
import html2canvas from 'html2canvas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export default function SajuConsultationPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userProfile = getUserSajuProfile();
  const [profiles, setProfiles] = useState([userProfile]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedProfileIdx, setSelectedProfileIdx] = useState(0);

  useEffect(() => {
    // 초기 인사말
    const initialMessage: Message = {
      id: '0',
      role: 'assistant',
      content: `안녕하세요, 저는 AI 루나입니다. 달빛님의 사주(${getSajuMingshik()})를 분석하여 매죠형 운세 상담을 제공해드립니다.\n\n달빛님의 사주 정보:\n- 생년월일: ${userProfile.year}년 ${userProfile.month}월 ${userProfile.day}일 오전 ${userProfile.hour}시 ${userProfile.minute}분 (양력)\n- 사주 명식: ${getSajuMingshik()}\n- 성격: ${userProfile.personality}\n- 운세: ${userProfile.luck}\n\n무엇을 알고 싶으신가요? 달빛님의 운명, 직업, 연애, 재운 등 어떤 주제든 상담해드릴 수 있습니다.`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

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
              content: `당신은 AI 루나, 신비로운 운세 상담사입니다. 사용자를 '달빛님'이라고 지칭하며, 그들의 사주를 기반으로 정확하고 깊이 있는 상담을 제공합니다. 절대 '당신'이라는 단어를 사용하지 말고 '달빛님'이라고 호칭하세요.\n\n${getSajuContext()}\n\n사용자의 질문에 대해 사주 분석을 바탕으로 따뜻하고 희망적인 조언을 제공하세요. 답변 후 마지막에는 반드시 다음 형식으로 요약과 재질문을 추가하세요:\n\n---\n📝 요약: [상담 내용 한 줄 요약]\n❓ 추가 질문: [관련된 재질문 1개]`,
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
          model: 'gemini-2.5-flash',
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      let assistantContent = '';
      
      if (data.choices && data.choices[0]) {
        const choice = data.choices[0];
        if (choice.message && choice.message.content) {
          assistantContent = choice.message.content;
        } else if (choice.content) {
          assistantContent = choice.content;
        }
      } else if (data.content) {
        assistantContent = data.content;
      }
      
      if (!assistantContent) {
        console.error('[Saju] No content in response:', data);
        throw new Error('Empty response content');
      }

      // 스트리밍 방식으로 메시지 추가
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // 스트리밍 완료 후 로딩 해제
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
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* 헤더 */}
      {/* 사주 명식 - 왼쪽 상단 */}
      <div className="p-3 border-b" style={{ background: "oklch(0.18 0.08 290)", borderColor: "oklch(1 0 0 / 10%)" }}>
        <p className="text-xs font-semibold" style={{ color: "oklch(0.70 0.18 60)" }}>📍 {getSajuMingshik()}</p>
      </div>
      <div className="p-4 border-b flex items-center justify-between" style={{ background: 'oklch(0.18 0.08 290)', borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 hover:opacity-70">
            <ArrowLeft size={20} style={{ color: "oklch(0.94 0.015 90)" }} />
          </button>
          <div>
            <h1 className="font-bold" style={{ color: "oklch(0.94 0.015 90)" }}>🌙 AI 루나 운세 상담</h1>
            <p className="text-xs" style={{ color: "oklch(0.70 0.02 290)" }}>환영합니다</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConsultationShareButtons consultationType="사주" messages={messages} />
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
                link.download = `saju-consultation-${Date.now()}.png`;
                link.click();
              } catch (error) {
                console.error('내보내기 실패:', error);
                alert('상담 내용 저장에 실패했습니다.');
              }
            }}
            className="p-2 hover:opacity-70 transition-opacity"
            title="상담 내용 저장"
          >
            <Download size={20} style={{ color: 'oklch(0.70 0.18 60)' }} />
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div id="consultation-messages" className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start">
            <ChatLoadingWithTips category="saju" />
          </div>
        )}
        
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
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 결제 충전소 */}
      <div className="p-4 border-t" style={{ background: 'oklch(0.18 0.08 290)', borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'oklch(0.94 0.015 90)' }}>💳 크레딧 충전 ✨ (20% 추가 이벤트)</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-3 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80" style={{ background: 'oklch(0.50 0.28 290)', color: 'oklch(1 0 0)' }}>
              10,000원 → 12,000원
            </button>
            <button className="p-3 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80" style={{ background: 'oklch(0.50 0.28 290)', color: 'oklch(1 0 0)' }}>
              30,000원 → 36,000원
            </button>
            <button className="p-3 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80" style={{ background: 'oklch(0.50 0.28 290)', color: 'oklch(1 0 0)' }}>
              50,000원 → 60,000원
            </button>
            <button className="p-3 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80" style={{ background: 'oklch(0.50 0.28 290)', color: 'oklch(1 0 0)' }}>
              100,000원 → 120,000원
            </button>
          </div>
        </div>
        <div className="mb-4 pb-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 10%)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'oklch(0.94 0.015 90)' }}>✨ 서비스 안내</h3>
          <div className="space-y-2 text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
            <p>🌙 <span style={{ color: 'oklch(0.94 0.015 90)' }}>AI 루나 운세 상담</span> - 사주, 타로, 육효 실시간 상담</p>
            <p>💝 <span style={{ color: 'oklch(0.94 0.015 90)' }}>소원 게시판</span> - 소원을 나누고 응원받기</p>
            <p>🎴 <span style={{ color: 'oklch(0.94 0.015 90)' }}>부적 상담소</span> - 맞춤형 부적 추천 및 구매</p>
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t" style={{ background: 'oklch(0.18 0.08 290)', borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="궁금한 점을 물어보세요..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg outline-none"
            style={{
              background: 'oklch(0.12 0.03 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(1 0 0 / 10%)',
            }}
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
