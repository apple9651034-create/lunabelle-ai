/**
 * 상담일지 컴포넌트
 * 이전 상담 내용과 루나의 요약 코멘트를 한눈에 볼 수 있음
 */
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Calendar, Sparkles } from 'lucide-react';
import { ConsultationMemory, getConsultationMemories } from '@/lib/consultationMemory';
import ConsultationFilter from './ConsultationFilter';

export default function ConsultationDiary() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    sortBy: 'recent' as 'recent' | 'oldest' | 'longest',
  });
  const memories = getConsultationMemories();

  const filteredAndSortedMemories = useMemo(() => {
    let filtered = [...memories];

    if (filters.searchTerm) {
      filtered = filtered.filter((m) =>
        m.mainConcern.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        m.details.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter((m) => m.type === filters.category);
    }

    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (filters.sortBy === 'longest') {
      filtered.sort((a, b) => b.details.length - a.details.length);
    }

    return filtered;
  }, [memories, filters]);

  if (memories.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center" style={{
        background: 'oklch(0.17 0.04 270)',
        borderColor: 'oklch(0.78 0.15 85 / 20%)',
      }}>
        <Sparkles size={32} className="mx-auto mb-3" style={{ color: 'oklch(0.78 0.15 85)' }} />
        <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-sm">
          아직 상담 기록이 없습니다. 루나와 상담을 시작해보세요!
        </p>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      saju: '🌟 사주',
      tarot: '🔮 타로',
      yuk: '🎯 육효',
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
    <div className="space-y-4">
      <ConsultationFilter onFilter={setFilters} />
      {filteredAndSortedMemories.length === 0 ? (
        <div className="rounded-lg border p-6 text-center" style={{
          background: 'oklch(0.17 0.04 270)',
          borderColor: 'oklch(0.78 0.15 85 / 20%)',
        }}>
          <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-sm">
            검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedMemories.map((memory) => (
        <div
          key={memory.id}
          className="rounded-lg border overflow-hidden transition-all"
          style={{
            background: 'oklch(0.17 0.04 270)',
            borderColor: getTypeColor(memory.type),
            borderWidth: '1px',
          }}
        >
          {/* 헤더 */}
          <button
            onClick={() => setExpandedId(expandedId === memory.id ? null : memory.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 text-left flex-1">
              <Calendar size={18} style={{ color: getTypeColor(memory.type) }} />
              <div>
                <p className="font-bold text-sm" style={{ color: getTypeColor(memory.type) }}>
                  {getTypeLabel(memory.type)}
                </p>
                <p className="text-xs mt-1" style={{ color: 'oklch(0.60 0.02 290)' }}>
                  {new Date(memory.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold mb-1" style={{ color: getTypeColor(memory.type) }}>
                {memory.mainConcern.substring(0, 20)}...
              </p>
              {expandedId === memory.id ? (
                <ChevronUp size={18} style={{ color: getTypeColor(memory.type) }} />
              ) : (
                <ChevronDown size={18} style={{ color: getTypeColor(memory.type) }} />
              )}
            </div>
          </button>

          {/* 상세 내용 */}
          {expandedId === memory.id && (
            <div
              className="border-t p-4 space-y-4"
              style={{
                borderColor: getTypeColor(memory.type) + '40',
              }}
            >
              {/* 주요 고민 */}
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: getTypeColor(memory.type) }}>
                  💭 주요 고민
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.78 0.15 85)' }}>
                  {memory.mainConcern}
                </p>
              </div>

              {/* 상담 내용 */}
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: getTypeColor(memory.type) }}>
                  📝 상담 내용
                </p>
                <p
                  className="text-sm leading-relaxed p-3 rounded-lg"
                  style={{
                    background: 'oklch(0.20 0.06 270)',
                    color: 'oklch(0.60 0.02 290)',
                  }}
                >
                  {memory.details.substring(0, 300)}
                  {memory.details.length > 300 ? '...' : ''}
                </p>
              </div>

              {/* 루나의 요약 코멘트 */}
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: getTypeColor(memory.type) }}>
                  ✨ 루나의 요약 코멘트
                </p>
                <div
                  className="text-sm leading-relaxed p-3 rounded-lg border-l-4"
                  style={{
                    background: `${getTypeColor(memory.type)}15`,
                    borderColor: getTypeColor(memory.type),
                    color: 'oklch(0.78 0.15 85)',
                  }}
                >
                  <p className="mb-2">
                    당신의 고민을 깊이 있게 살펴본 결과, 다음과 같은 조언을 드립니다:
                  </p>
                  <p>
                    {memory.response.substring(0, 200)}
                    {memory.response.length > 200 ? '...' : ''}
                  </p>
                </div>
              </div>

              {/* 현재 상황 */}
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: getTypeColor(memory.type) }}>
                  🌈 현재 진행 상황
                </p>
                <div
                  className="text-sm px-3 py-2 rounded-lg"
                  style={{
                    background: 'oklch(0.70 0.18 60 / 15%)',
                    color: 'oklch(0.70 0.18 60)',
                  }}
                >
                  {memory.status}
                </div>
              </div>

              {/* 핵심 포인트 */}
              {memory.keyPoints && memory.keyPoints.length > 0 && (
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: getTypeColor(memory.type) }}>
                    🔑 핵심 포인트
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {memory.keyPoints.map((point, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: getTypeColor(memory.type) + '25',
                          color: getTypeColor(memory.type),
                        }}
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
        </div>
      )}
    </div>
  );
}
