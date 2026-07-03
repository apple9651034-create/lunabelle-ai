/* AI 루나 — ChatInterface
 * Design: Mystic Dark Luxury — dark chat bubbles, gold AI avatar, purple user bubbles
 * 사주 분석 결과 기반 AI 상담 연동
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface SajuResult {
  fourPillars: any;
  personality: string;
  luck: string;
  solarDate: string;
  lunarDate: string;
}

interface ConversationContext {
  topic: string | null;
  birthDate: string | null;
  gender: string | null;
  question: string | null;
  sajuResult: SajuResult | null;
}

export default function ChatInterface() {
  // sessionStorage에서 사주 결과 로드
  const [sajuResult, setSajuResult] = useState<SajuResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('sajuResult');
    if (stored) {
      try {
        const result = JSON.parse(stored);
        setSajuResult(result);
        sessionStorage.removeItem('sajuResult');
      } catch (e) {
        console.error('사주 결과 로드 실패:', e);
      }
    }
  }, []);

  const initialMessages: Message[] = sajuResult
    ? [
        {
          id: 1,
          type: 'ai',
          content: '안녕하세요! 저는 AI 루나입니다. 🌙',
          timestamp: new Date(),
        },
        {
          id: 2,
          type: 'ai',
          content: `당신의 사주를 분석했습니다.\n\n📅 ${sajuResult.solarDate}\n${sajuResult.lunarDate}\n\n🔮 명식: ${sajuResult.fourPillars.yearString} ${sajuResult.fourPillars.monthString} ${sajuResult.fourPillars.dayString}${sajuResult.fourPillars.hourString ? ' ' + sajuResult.fourPillars.hourString : ''}\n\n이제 더 자세한 상담을 시작하겠습니다. 어떤 부분이 궁금하신가요?`,
          timestamp: new Date(),
        },
      ]
    : [
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
      ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topic: null,
    birthDate: null,
    gender: null,
    question: null,
    sajuResult: sajuResult,
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

    // 사주 결과가 있으면 사주 기반 상담
    if (context.sajuResult) {
      if (lowerMessage.includes('성격') || lowerMessage.includes('나')) {
        return [
          '당신의 사주를 보니 다음과 같은 특징이 있습니다:',
          context.sajuResult.personality,
          '이러한 성향을 잘 이해하고 활용하면 더 나은 삶을 살 수 있을 것 같습니다.',
        ];
      } else if (lowerMessage.includes('운세') || lowerMessage.includes('올해')) {
        return [
          '올해 당신의 운세를 살펴보니:',
          context.sajuResult.luck,
          '이 시기를 잘 활용하여 긍정적인 변화를 만들어보세요!',
        ];
      } else if (lowerMessage.includes('연애') || lowerMessage.includes('사랑')) {
        return [
          '당신의 사주에서 보이는 연애운:',
          '현재 당신의 오행 구성상 인간관계가 활발한 시기입니다.',
          '진심 있는 마음으로 상대방을 대하면 좋은 인연을 만날 수 있을 것 같습니다.',
        ];
      } else if (lowerMessage.includes('재물') || lowerMessage.includes('돈')) {
        return [
          '당신의 사주에서 보이는 재운:',
          '현재 안정적인 재운이 흐르고 있습니다.',
          '신중한 투자와 계획적인 저축으로 재물을 모을 수 있는 시기입니다.',
        ];
      } else if (lowerMessage.includes('건강')) {
        return [
          '당신의 사주에서 보이는 건강운:',
          '전반적으로 건강한 기운이 흐르고 있습니다.',
          '규칙적인 생활과 적절한 휴식으로 건강을 유지하세요.',
        ];
      } else if (lowerMessage.includes('학업') || lowerMessage.includes('시험')) {
        return [
          '당신의 사주에서 보이는 학업운:',
          '현재 학습에 집중할 수 있는 좋은 시기입니다.',
          '꾸준한 노력과 자신감으로 목표를 달성할 수 있을 것 같습니다.',
        ];
      } else {
        return [
          '네, 알겠습니다.',
          '당신의 사주를 바탕으로 더 깊이 있는 상담을 드리겠습니다.',
          userMessage + '에 대해 더 자세히 말씀해주시겠어요?',
        ];
      }
    }

    // 사주 결과가 없으면 기존 로직
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
        return ['성별을 알려주실 수 있나요? (남성/여성)'];
      }
    }

    return ['네, 알겠습니다. ' + userMessage, '더 자세히 말씀해주시겠어요?'];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponses = generateAIResponse(inputValue);
      const newMessages = aiResponses.map((response, index) => ({
        id: messages.length + 2 + index,
        type: 'ai' as const,
        content: response,
        timestamp: new Date(),
      }));

      setMessages((prev) => [...prev, ...newMessages]);
      setIsLoading(false);
    }, 800);
  };

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌙</span>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              AI 루나 채팅
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>실시간 점술 상담</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed"
              style={
                message.type === 'user'
                  ? {
                      background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                      color: 'oklch(0.97 0.005 90)',
                    }
                  : {
                      background: 'oklch(0.20 0.05 270)',
                      color: 'oklch(0.85 0.015 90)',
                      border: '1px solid oklch(0.55 0.25 290 / 20%)',
                    }
              }
            >
              {message.content.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-2xl"
              style={{
                background: 'oklch(0.20 0.05 270)',
                border: '1px solid oklch(0.55 0.25 290 / 20%)',
              }}
            >
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'oklch(0.78 0.15 85)', animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'oklch(0.78 0.15 85)', animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'oklch(0.78 0.15 85)', animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-4 border-t"
        style={{
          background: 'oklch(0.17 0.04 270)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 rounded-2xl text-sm focus:outline-none"
            style={{
              background: 'oklch(0.20 0.05 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="p-3 rounded-2xl transition-all active:scale-[0.95] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
            }}
          >
            <Send size={20} color="oklch(0.97 0.005 90)" />
          </button>
        </div>
      </div>
    </div>
  );
}
