/* AI 루나 — SupportPage
 * Design: Mystic Dark Luxury
 */
import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';

interface SupportMessage {
  id: number;
  type: 'user' | 'support';
  content: string;
}

const faqs = [
  { q: 'AI 루나는 어떻게 운세를 분석하나요?', a: '타로, 사주, 육효의 전통적인 점술 방식을 AI로 분석하여 현대적인 해석을 제공합니다.' },
  { q: '상담 결과는 얼마나 정확한가요?', a: '점술은 참고용으로 활용하시기 바랍니다. 중요한 결정은 전문가와 상담하세요.' },
  { q: '부적은 어떻게 사용하나요?', a: '구매 후 이미지를 다운로드하여 핸드폰 배경화면이나 인쇄하여 사용하실 수 있습니다.' },
  { q: '개인정보는 안전한가요?', a: '모든 상담 내용은 암호화되어 안전하게 보관되며 제3자에게 제공되지 않습니다.' },
];

export default function SupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([
    { id: 1, type: 'support', content: '안녕하세요! AI 루나 고객지원입니다. 무엇을 도와드릴까요? 🌙' },
  ]);
  const [input, setInput] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: SupportMessage = { id: Date.now(), type: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const reply: SupportMessage = {
        id: Date.now() + 1,
        type: 'support',
        content: '문의해 주셔서 감사합니다. 담당자가 확인 후 빠르게 답변드리겠습니다. 평균 응답 시간은 24시간 이내입니다.',
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌟</span>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              고객 지원
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>무엇이든 도와드립니다</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Chat */}
        <div className="p-4 space-y-3" style={cardStyle}>
          <h3 className="text-xs font-bold tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>1:1 문의</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                  style={
                    msg.type === 'user'
                      ? { background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))', color: 'oklch(0.97 0.005 90)' }
                      : { background: 'oklch(0.20 0.05 270)', color: 'oklch(0.85 0.015 90)', border: '1px solid oklch(1 0 0 / 10%)' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="문의 내용을 입력하세요..."
              className="flex-1 px-3 py-2.5 rounded-xl text-xs focus:outline-none"
              style={{
                background: 'oklch(0.20 0.05 270)',
                color: 'oklch(0.94 0.015 90)',
                border: '1px solid oklch(1 0 0 / 15%)',
              }}
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))' }}
            >
              <Send size={14} color="oklch(0.97 0.005 90)" />
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="overflow-hidden" style={cardStyle}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 8%)' }}>
            <h3 className="text-xs font-bold tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>자주 묻는 질문</h3>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid oklch(1 0 0 / 8%)' : 'none' }}>
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-medium pr-3" style={{ color: 'oklch(0.90 0.015 90)' }}>{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp size={16} style={{ color: 'oklch(0.78 0.15 85)', flexShrink: 0 }} />
                  : <ChevronDown size={16} style={{ color: 'oklch(0.55 0.02 290)', flexShrink: 0 }} />
                }
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.65 0.02 290)' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="p-5 text-center" style={cardStyle}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>이메일 문의</p>
          <p className="text-sm" style={{ color: 'oklch(0.94 0.015 90)' }}>support@ai-luna.com</p>
          <p className="text-xs mt-2" style={{ color: 'oklch(0.50 0.02 290)' }}>평일 09:00 – 18:00 운영</p>
        </div>
      </div>
    </div>
  );
}
