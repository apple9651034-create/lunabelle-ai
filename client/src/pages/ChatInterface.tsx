/* AI 루나 — ChatInterface
 * Design: Mystic Dark Luxury — dark chat bubbles, gold AI avatar, purple user bubbles
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ConversationContext {
  topic: string | null;
  birthDate: string | null;
  gender: string | null;
  question: string | null;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: '안녕하세요! 저는 AI 루나입니다. 🌙',
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'ai',
      content: '당신의 운명을 알아보기 위해 몇 가지 질문을 드리겠습니다. 오늘 어떤 일로 고민이 있으신가요?',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topic: null,
    birthDate: null,
    gender: null,
    question: null,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string[] => {
    const lowerMessage = userMessage.toLowerCase();
    const context = conversationContext;

    if (!context.topic) {
      if (lowerMessage.includes('연애') || lowerMessage.includes('사랑') || lowerMessage.includes('인연')) {
        setConversationContext({ ...context, topic: 'love' });
        return ['아, 연애운이군요! 💕', '그럼 먼저 타로로 현재의 연애 상황을 봐드릴게요.'];
      } else if (lowerMessage.includes('재물') || lowerMessage.includes('돈') || lowerMessage.includes('사업')) {
        setConversationContext({ ...context, topic: 'wealth' });
        return ['재물운에 관심이 있으시군요! 💰', '타로로 현재의 재운을 살펴보겠습니다.'];
      } else if (lowerMessage.includes('건강') || lowerMessage.includes('병') || lowerMessage.includes('활력')) {
        setConversationContext({ ...context, topic: 'health' });
        return ['건강이 가장 중요하죠! 🏥', '당신의 건강 상태를 타로로 진단해보겠습니다.'];
      } else if (lowerMessage.includes('학업') || lowerMessage.includes('시험') || lowerMessage.includes('공부')) {
        setConversationContext({ ...context, topic: 'study' });
        return ['학업 운을 보고 싶으시군요! 📚', '타로로 학업 운을 분석해드리겠습니다.'];
      } else {
        setConversationContext({ ...context, topic: 'general' });
        return ['네, 알겠습니다! ' + userMessage, '그럼 타로로 당신의 현재 상황을 살펴보겠습니다.'];
      }
    }

    if (!context.birthDate && context.topic) {
      if (/\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/.test(userMessage)) {
        setConversationContext({ ...context, birthDate: userMessage });
        return [
          '감사합니다! ' + userMessage + '이군요.',
          '이제 사주로도 더 깊이 분석해드리겠습니다.',
          '혹시 태어난 시간을 알고 계신가요? (선택사항)',
        ];
      } else if (context.birthDate === null) {
        return ['혹시 태어난 날짜를 알려주실 수 있나요?', '(예: 1990-05-15 또는 1990/05/15)'];
      }
    }

    if (!context.gender && context.birthDate) {
      if (lowerMessage.includes('남') || lowerMessage.includes('여')) {
        setConversationContext({
          ...context,
          gender: lowerMessage.includes('남') ? 'male' : 'female',
        });
        return [
          '감사합니다!',
          '이제 모든 정보를 수집했습니다.',
          '타로, 사주, 육효를 종합적으로 분석해드리겠습니다. ✨',
        ];
      } else {
        return ['성별을 알려주실 수 있나요?', '(남성 또는 여성)'];
      }
    }

    if (context.gender) {
      const topicLabel =
        context.topic === 'love' ? '연애' :
        context.topic === 'wealth' ? '재물' :
        context.topic === 'health' ? '건강' : '전반적인';
      return [
        '종합 분석 결과입니다:',
        `당신의 ${topicLabel} 운은 매우 긍정적입니다.`,
        '타로 카드는 변화와 성장을 의미하고 있으며,',
        '사주상으로도 좋은 기운이 흐르고 있습니다.',
        '육효의 결과도 긍정적인 변화를 나타내고 있습니다.',
        '계속해서 긍정적인 마음을 유지하세요! 🌟',
      ];
    }

    return ['네, 알겠습니다. 계속 진행하겠습니다.'];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = generateAIResponse(inputValue);
      responses.forEach((response, index) => {
        setTimeout(() => {
          const aiMessage: Message = {
            id: messages.length + 2 + index,
            type: 'ai',
            content: response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          if (index === responses.length - 1) {
            setIsLoading(false);
          }
        }, index * 800);
      });
    }, 500);
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'oklch(0.12 0.03 270)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3 border-b"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'oklch(0.55 0.25 290 / 30%)', border: '1px solid oklch(0.78 0.15 85 / 40%)' }}
        >
          🌙
        </div>
        <div>
          <h1
            className="text-lg font-bold leading-tight"
            style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}
          >
            AI 루나
          </h1>
          <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>
            당신의 운명을 예측해 보세요
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm mt-1"
                style={{
                  background: 'oklch(0.55 0.25 290 / 25%)',
                  border: '1px solid oklch(0.78 0.15 85 / 30%)',
                }}
              >
                🌙
              </div>
            )}
            <div
              className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={
                message.type === 'user'
                  ? {
                      background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                      color: 'oklch(0.97 0.005 90)',
                      borderBottomRightRadius: '4px',
                    }
                  : {
                      background: 'oklch(0.19 0.05 270)',
                      color: 'oklch(0.90 0.015 90)',
                      border: '1px solid oklch(1 0 0 / 10%)',
                      borderBottomLeftRadius: '4px',
                    }
              }
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm mt-1"
              style={{
                background: 'oklch(0.55 0.25 290 / 25%)',
                border: '1px solid oklch(0.78 0.15 85 / 30%)',
              }}
            >
              🌙
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{
                background: 'oklch(0.19 0.05 270)',
                border: '1px solid oklch(1 0 0 / 10%)',
                borderBottomLeftRadius: '4px',
              }}
            >
              <div className="flex gap-1 items-center">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      background: 'oklch(0.78 0.15 85)',
                      animationDelay: `${delay}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="border-t px-4 py-3"
        style={{
          background: 'oklch(0.14 0.04 270)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-full text-sm focus:outline-none transition-all"
            style={{
              background: 'oklch(0.20 0.05 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'oklch(0.55 0.25 290 / 60%)';
              e.currentTarget.style.boxShadow = '0 0 0 3px oklch(0.55 0.25 290 / 15%)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'oklch(1 0 0 / 15%)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 active:scale-95 disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              boxShadow: '0 2px 10px oklch(0.55 0.25 290 / 40%)',
            }}
          >
            <Send size={16} color="oklch(0.97 0.005 90)" />
          </button>
        </form>
      </div>
    </div>
  );
}
