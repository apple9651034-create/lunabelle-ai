import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

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

    // 주제 파악
    if (!context.topic) {
      if (
        lowerMessage.includes('연애') ||
        lowerMessage.includes('사랑') ||
        lowerMessage.includes('인연')
      ) {
        setConversationContext({ ...context, topic: 'love' });
        return [
          '아, 연애운이군요! 💕',
          '그럼 먼저 타로로 현재의 연애 상황을 봐드릴게요.',
        ];
      } else if (
        lowerMessage.includes('재물') ||
        lowerMessage.includes('돈') ||
        lowerMessage.includes('사업')
      ) {
        setConversationContext({ ...context, topic: 'wealth' });
        return [
          '재물운에 관심이 있으시군요! 💰',
          '타로로 현재의 재운을 살펴보겠습니다.',
        ];
      } else if (
        lowerMessage.includes('건강') ||
        lowerMessage.includes('병') ||
        lowerMessage.includes('활력')
      ) {
        setConversationContext({ ...context, topic: 'health' });
        return [
          '건강이 가장 중요하죠! 🏥',
          '당신의 건강 상태를 타로로 진단해보겠습니다.',
        ];
      } else if (
        lowerMessage.includes('학업') ||
        lowerMessage.includes('시험') ||
        lowerMessage.includes('공부')
      ) {
        setConversationContext({ ...context, topic: 'study' });
        return [
          '학업 운을 보고 싶으시군요! 📚',
          '타로로 학업 운을 분석해드리겠습니다.',
        ];
      } else {
        setConversationContext({ ...context, topic: 'general' });
        return [
          '네, 알겠습니다! ' + userMessage,
          '그럼 타로로 당신의 현재 상황을 살펴보겠습니다.',
        ];
      }
    }

    // 생년월일 요청
    if (!context.birthDate && context.topic) {
      if (/\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/.test(userMessage)) {
        setConversationContext({ ...context, birthDate: userMessage });
        return [
          '감사합니다! ' + userMessage + '이군요.',
          '이제 사주로도 더 깊이 분석해드리겠습니다.',
          '혹시 태어난 시간을 알고 계신가요? (선택사항)',
        ];
      } else if (context.birthDate === null) {
        return [
          '혹시 태어난 날짜를 알려주실 수 있나요?',
          '(예: 1990-05-15 또는 1990/05/15)',
        ];
      }
    }

    // 성별 요청
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
        return [
          '성별을 알려주실 수 있나요?',
          '(남성 또는 여성)',
        ];
      }
    }

    // 최종 해석
    if (context.gender) {
      return [
        '종합 분석 결과입니다:',
        `당신의 ${context.topic === 'love' ? '연애' : context.topic === 'wealth' ? '재물' : context.topic === 'health' ? '건강' : '전반적인'} 운은 매우 긍정적입니다.`,
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

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // AI 응답 생성
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-6 shadow-lg">
        <h1 className="text-2xl font-bold">🌙 AI 루나</h1>
        <p className="text-purple-100 text-sm mt-1">당신의 운명을 예측해 보세요</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-lg">
                🌙
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-none'
                  : 'bg-white text-slate-900 shadow-md rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-lg">
              🌙
            </div>
            <div className="bg-white text-slate-900 shadow-md px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-200 bg-white px-6 py-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : '전송'}
          </Button>
        </form>
      </div>
    </div>
  );
}
