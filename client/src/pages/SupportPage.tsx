import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'support';
  content: string;
  timestamp: string;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'support',
      content: '안녕하세요! 🌙 AI 루나 고객 지원팀입니다. 무엇을 도와드릴까요?',
      timestamp: '14:30',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isOnline] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: messages.length + 2,
        type: 'support',
        content: '좋은 질문입니다! 더 자세히 설명해주시겠어요?',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, supportMessage]);
    }, 1000);
  };

  const faqs = [
    {
      question: '부적은 어떻게 사용하나요?',
      answer: '부적은 깨끗한 곳에 보관하시고, 매일 아침 감사의 마음으로 바라보세요.',
    },
    {
      question: '상담 기록은 어디서 확인할 수 있나요?',
      answer: '마이페이지에서 모든 상담 기록을 확인하실 수 있습니다.',
    },
    {
      question: '환불은 가능한가요?',
      answer: '구매 후 7일 이내 환불이 가능합니다. 고객 지원팀에 문의해주세요.',
    },
    {
      question: 'AI 루나의 예측이 정확한가요?',
      answer: 'AI 루나는 전통 지식을 바탕으로 분석하지만, 미래는 변할 수 있습니다.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">💬 고객 지원</h1>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-300' : 'bg-gray-400'}`} />
            <span className="text-sm">{isOnline ? '온라인' : '오프라인'}</span>
          </div>
        </div>
        <p className="text-green-100">AI 루나 지원팀이 도와드립니다</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
        {/* Chat Messages */}
        <div className="max-w-2xl mx-auto mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">실시간 채팅</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-4 h-64 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'support' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-lg">
                    💬
                  </div>
                )}
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full px-6"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-4">자주 묻는 질문</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <summary className="font-semibold text-slate-900 flex items-center gap-2">
                  <MessageCircle size={18} className="text-green-600" />
                  {faq.question}
                </summary>
                <p className="text-slate-600 mt-3 ml-7">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">연락처</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-green-600" />
              <div>
                <p className="text-sm text-slate-600">채팅 지원</p>
                <p className="font-semibold text-slate-900">24시간 이용 가능</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-green-600" />
              <div>
                <p className="text-sm text-slate-600">응답 시간</p>
                <p className="font-semibold text-slate-900">평균 5분 이내</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" />
              <div>
                <p className="text-sm text-slate-600">만족도</p>
                <p className="font-semibold text-slate-900">4.9/5.0 ⭐</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
