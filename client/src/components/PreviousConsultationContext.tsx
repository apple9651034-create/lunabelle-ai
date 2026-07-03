/**
 * 이전 상담 내용 표시 컴포넌트
 * 상담 시작 전에 이전 상담 내용을 요약해서 표시
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { ConsultationMemory } from '@/lib/consultationMemory';

interface PreviousConsultationContextProps {
  consultation: ConsultationMemory;
  onContinue?: () => void;
}

export default function PreviousConsultationContext({
  consultation,
  onContinue,
}: PreviousConsultationContextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const daysSince = Math.floor(
    (Date.now() - new Date(consultation.date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      saju: '사주',
      tarot: '타로',
      yuk: '육효',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      saju: 'oklch(0.70 0.18 60)',
      tarot: 'oklch(0.50 0.28 290)',
      yuk: 'oklch(0.78 0.15 85)',
    };
    return colors[type] || 'oklch(0.70 0.18 60)';
  };

  return (
    <div
      className="rounded-lg overflow-hidden border mb-6"
      style={{
        background: 'linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
        borderColor: getTypeColor(consultation.type),
        borderWidth: '2px',
      }}
    >
      {/* 헤더 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 text-left flex-1">
          <Clock size={20} style={{ color: getTypeColor(consultation.type) }} />
          <div>
            <p className="font-bold text-sm" style={{ color: 'oklch(0.94 0.015 90)' }}>
              💫 지난번 {getTypeLabel(consultation.type)} 상담을 기억하고 있어요
            </p>
            <p className="text-xs mt-1" style={{ color: 'oklch(0.60 0.02 290)' }}>
              {daysSince === 0 ? '오늘' : `${daysSince}일 전`} • {consultation.mainConcern}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} style={{ color: getTypeColor(consultation.type) }} />
        ) : (
          <ChevronDown size={20} style={{ color: getTypeColor(consultation.type) }} />
        )}
      </button>

      {/* 상세 내용 */}
      {isExpanded && (
        <div
          className="border-t p-4 space-y-3"
          style={{
            borderColor: getTypeColor(consultation.type) + '40',
          }}
        >
          {/* 주요 고민 */}
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
              🎯 주요 고민
            </p>
            <p className="text-sm" style={{ color: 'oklch(0.78 0.15 85)' }}>
              {consultation.mainConcern}
            </p>
          </div>

          {/* 당시 상황 */}
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
              📝 당시 상황
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.60 0.02 290)' }}>
              {consultation.details.substring(0, 200)}
              {consultation.details.length > 200 ? '...' : ''}
            </p>
          </div>

          {/* 현재 진행 상황 */}
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
              ✨ 현재 진행 상황
            </p>
            <p className="text-sm" style={{ color: 'oklch(0.70 0.18 60)' }}>
              {consultation.status}
            </p>
          </div>

          {/* 후속 조치 */}
          {consultation.followUp && (
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
                🔮 당시 조언
              </p>
              <p className="text-sm" style={{ color: 'oklch(0.60 0.02 290)' }}>
                {consultation.followUp}
              </p>
            </div>
          )}

          {/* 계속 상담하기 버튼 */}
          {onContinue && (
            <button
              onClick={onContinue}
              className="w-full py-2 rounded-lg font-bold text-sm transition-all active:scale-[0.97] mt-4"
              style={{
                background: `linear-gradient(135deg, ${getTypeColor(consultation.type)}, ${getTypeColor(
                  consultation.type
                )}dd)`,
                color: 'oklch(1 0 0)',
                boxShadow: `0 4px 15px ${getTypeColor(consultation.type)}40`,
              }}
            >
              이어서 상담하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
