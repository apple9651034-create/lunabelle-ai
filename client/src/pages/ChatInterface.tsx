/* AI 루나 — ChatInterface
 * Design: Mystic Dark Luxury — dark chat bubbles, gold AI avatar, purple user bubbles
 * Manus LLM 기반 실시간 AI 상담 + 상담내역 저장
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Save, History, Download, FileText, Image as ImageIcon, Lightbulb } from "lucide-react";
import { saveConsultation, getAllConsultations, getConsultationById, formatDate } from '@/lib/consultationHistory';
import { downloadChatAsText, downloadChatAsImage, downloadChatAsJSON } from '@/lib/downloadChat';
import { generateSajuQuestions, SuggestedQuestion } from "@/lib/suggestedQuestions";

import { generateTarotReadingForQuestion } from "@/lib/tarotInterpretation";
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
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [savedConsultations, setSavedConsultations] = useState<any[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('sajuResult');
    if (stored) {
      try {
        const result = JSON.parse(stored);
        setSajuResult(result);
        setSuggestedQuestions(generateSajuQuestions(result));
        sessionStorage.removeItem('sajuResult');
      } catch (e) {
        console.error('사주 결과 로드 실패:', e);
      }
    }

    // 저장된 상담내역 로드
    setSavedConsultations(getAllConsultations());
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
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
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

  // Manus LLM API 호출
  const callManuLLM = async (userMessage: string): Promise<string> => {
    try {
      const systemPrompt = `당신은 AI 루나, 한국의 신비로운 점술 상담사입니다. 
따뜻하고 신비로운 톤으로 사주, 육효, 타로를 통해 사용자의 운명과 미래를 상담해주세요.
${sajuResult ? `사용자의 사주: ${sajuResult.fourPillars.yearString} ${sajuResult.fourPillars.monthString} ${sajuResult.fourPillars.dayString}${sajuResult.fourPillars.hourString ? ' ' + sajuResult.fourPillars.hourString : ''}` : ''}
한국어로 응답하며, 이모지를 적절히 사용하세요.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            { role: 'user', content: userMessage },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('API 호출 실패');
      }

      const data = await response.json();
      return data.choices[0].message.content || '죄송합니다. 다시 시도해주세요.';
    } catch (error) {
      console.error('LLM API 오류:', error);
      return '죄송합니다. 현재 상담이 불가능합니다. 잠시 후 다시 시도해주세요.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // AI 응답 생성
      const aiResponse = await callManuLLM(inputValue);

      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // 상담내역 자동 저장 (10개 메시지마다)
      if ((messages.length + 2) % 10 === 0) {
        if (!consultationId) {
          const newId = saveConsultation({
            type: 'saju',
            question: conversationContext.question || inputValue,
            result: sajuResult,
            messages: [...messages, userMessage, aiMessage].map(m => ({
              role: m.type === 'ai' ? 'assistant' : 'user',
              content: m.content,
            })),
          });
          setConsultationId(newId);
        } else {
          // 기존 상담내역 업데이트
          const allMessages = [...messages, userMessage, aiMessage];
          const consultationRecord = getConsultationById(consultationId);
          if (consultationRecord) {
            saveConsultation({
              type: consultationRecord.type,
              question: consultationRecord.question,
              result: consultationRecord.result,
              messages: allMessages.map(m => ({
                role: m.type === 'ai' ? 'assistant' : 'user',
                content: m.content,
              })),
            });
          }
        }
      }
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConsultation = () => {
    if (!consultationId) {
      const newId = saveConsultation({
        type: 'saju',
        question: conversationContext.question || '일반 상담',
        result: sajuResult,
        messages: messages.map(m => ({
          role: m.type === 'ai' ? 'assistant' : 'user',
          content: m.content,
        })),
      });
      setConsultationId(newId);
      alert('상담내역이 저장되었습니다.');
    }
  };

  const handleLoadConsultation = (id: string) => {
    const record = getConsultationById(id);
    if (record && record.messages) {
      const loadedMessages: Message[] = record.messages.map((msg, idx) => ({
        id: idx + 1,
        type: msg.role as 'user' | 'ai',
        content: msg.content,
        timestamp: new Date(),
      }));
      setMessages(loadedMessages);
      setSajuResult(record.result);
      setConsultationId(id);
      setShowHistory(false);
    }
  };

  const handleDownloadChat = (format: string) => {
    const chatMessages = messages.map(m => ({
      role: m.type === 'ai' ? 'assistant' : 'user',
      content: m.content,
      timestamp: m.timestamp,
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    if (format === 'text') {
      downloadChatAsText(chatMessages as any, `AI루나_상담기록_${timestamp}.txt`);
    } else if (format === 'image') {
      downloadChatAsImage(chatMessages as any, `AI루나_상담기록_${timestamp}.png`);
    } else if (format === 'json') {
      downloadChatAsJSON(chatMessages as any, `AI루나_상담기록_${timestamp}.json`);
    }
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
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              AI 루나 채팅
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>실시간 운명 상담</p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-lg transition-all hover:bg-white/10"
          style={{ color: 'oklch(0.78 0.15 85)' }}
        >
          <History size={20} />
        </button>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div
          className="absolute left-0 top-16 w-64 h-[calc(100vh-64px)] p-4 overflow-y-auto z-50 border-r"
          style={{
            background: 'oklch(0.14 0.04 270)',
            borderColor: 'oklch(1 0 0 / 10%)',
          }}
        >
          <h3 className="font-bold mb-3" style={{ color: 'oklch(0.78 0.15 85)' }}>
            상담 내역
          </h3>
          <div className="space-y-2">
            {savedConsultations.map(record => (
              <button
                key={record.id}
                onClick={() => handleLoadConsultation(record.id)}
                className="w-full p-3 rounded-lg text-left text-xs transition-all hover:bg-white/10"
                style={cardStyle}
              >
                <p style={{ color: 'oklch(0.94 0.015 90)' }} className="font-semibold truncate">
                  {record.question}
                </p>
                <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs">
                  {formatDate(record.date)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl"
              style={{
                background: message.type === 'user' ? 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))' : 'oklch(0.17 0.04 270)',
                color: 'oklch(0.94 0.015 90)',
                border: message.type === 'ai' ? '1px solid oklch(1 0 0 / 10%)' : 'none',
              }}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className="text-xs mt-2" style={{ color: 'oklch(0.60 0.02 290)' }}>
                {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-xl" style={{ background: 'oklch(0.17 0.04 270)' }}>
              <Loader2 size={20} className="animate-spin" style={{ color: 'oklch(0.78 0.15 85)' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="flex gap-3 mb-3">
          <button
            onClick={handleSaveConsultation}
            className="flex-1 py-2 rounded-lg font-semibold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2"
            style={{
              background: 'oklch(0.17 0.04 270)',
              color: 'oklch(0.78 0.15 85)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
          >
            <Save size={16} /> 상담 저장
          </button>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => handleDownloadChat('text')}
            className="flex-1 py-2 rounded-lg font-semibold text-xs transition-all active:scale-[0.97] flex items-center justify-center gap-1"
            style={{
              background: 'oklch(0.17 0.04 270)',
              color: 'oklch(0.78 0.15 85)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
          >
            <FileText size={14} /> 텍스트
          </button>
          <button
            onClick={() => handleDownloadChat('image')}
            className="flex-1 py-2 rounded-lg font-semibold text-xs transition-all active:scale-[0.97] flex items-center justify-center gap-1"
            style={{
              background: 'oklch(0.17 0.04 270)',
              color: 'oklch(0.78 0.15 85)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
          >
            <ImageIcon size={14} /> 이미지
          </button>
          <button
            onClick={() => handleDownloadChat('json')}
            className="flex-1 py-2 rounded-lg font-semibold text-xs transition-all active:scale-[0.97] flex items-center justify-center gap-1"
            style={{
              background: 'oklch(0.17 0.04 270)',
              color: 'oklch(0.78 0.15 85)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
          >
            <Download size={14} /> JSON
          </button>
        </div>
        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && messages.length <= 3 && (
          <div className="mb-3 p-3 rounded-lg" style={{ background: "oklch(0.17 0.04 270)", border: "1px solid oklch(0.78 0.15 85 / 20%)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={14} style={{ color: "oklch(0.78 0.15 85)" }} />
              <p className="text-xs font-semibold" style={{ color: "oklch(0.78 0.15 85)" }}>추천 질문</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.slice(0, 4).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => { setInputValue(q.text); }}
                  className="text-left p-2 rounded-lg text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "oklch(0.20 0.05 270)",
                    color: "oklch(0.85 0.015 90)",
                    border: "1px solid oklch(0.55 0.25 290 / 20%)"
                  }}
                >
                  <span className="mr-1">{q.emoji}</span>
                  <span className="line-clamp-2">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none transition-all disabled:opacity-50"
            style={{
              background: 'oklch(0.20 0.05 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-3 rounded-xl font-bold transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              color: 'oklch(0.97 0.005 90)',
              boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
