import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface ConsultationFilterProps {
  onFilter: (filters: {
    searchTerm: string;
    category: string;
    sortBy: 'recent' | 'oldest' | 'longest';
  }) => void;
}

export default function ConsultationFilter({ onFilter }: ConsultationFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'longest'>('recent');
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { id: 'all', label: '전체', icon: '📋' },
    { id: 'saju', label: '사주', icon: '🌟' },
    { id: 'tarot', label: '타로', icon: '🔮' },
    { id: 'yuk', label: '육효', icon: '🎲' },
    { id: 'love', label: '연애', icon: '💕' },
    { id: 'wealth', label: '재운', icon: '💰' },
    { id: 'career', label: '직업', icon: '💼' },
    { id: 'health', label: '건강', icon: '🏥' },
  ];

  const handleFilter = () => {
    onFilter({
      searchTerm,
      category,
      sortBy,
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('all');
    setSortBy('recent');
    onFilter({
      searchTerm: '',
      category: 'all',
      sortBy: 'recent',
    });
  };

  return (
    <div className="mb-6 space-y-3">
      {/* 검색 바 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'oklch(0.78 0.15 85)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilter();
            }}
            placeholder="상담 내용 검색..."
            className="w-full pl-9 pr-4 py-2 rounded-lg outline-none text-sm"
            style={{
              background: 'oklch(0.15 0.05 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(0.78 0.15 85 / 20%)',
            }}
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 rounded-lg transition-all"
          style={{
            background: isExpanded ? 'oklch(0.78 0.15 85 / 20%)' : 'oklch(0.15 0.05 270)',
            color: 'oklch(0.78 0.15 85)',
            border: '1px solid oklch(0.78 0.15 85 / 20%)',
          }}
        >
          <Filter size={16} />
        </button>
      </div>

      {/* 필터 패널 */}
      {isExpanded && (
        <div className="p-4 rounded-lg space-y-4" style={{
          background: 'oklch(0.15 0.05 270)',
          border: '1px solid oklch(0.78 0.15 85 / 20%)',
        }}>
          {/* 카테고리 필터 */}
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
              📂 상담 유형
            </p>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    onFilter({
                      searchTerm,
                      category: cat.id,
                      sortBy,
                    });
                  }}
                  className="px-2 py-2 rounded-lg text-xs font-bold transition-all text-center"
                  style={{
                    background: category === cat.id ? 'oklch(0.78 0.15 85 / 30%)' : 'oklch(0.20 0.06 270)',
                    color: category === cat.id ? 'oklch(0.78 0.15 85)' : 'oklch(0.60 0.02 290)',
                    border: category === cat.id ? '1px solid oklch(0.78 0.15 85)' : '1px solid oklch(0.78 0.15 85 / 10%)',
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 필터 */}
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
              🔄 정렬
            </p>
            <div className="flex gap-2">
              {[
                { value: 'recent' as const, label: '최신순' },
                { value: 'oldest' as const, label: '오래된순' },
                { value: 'longest' as const, label: '길이순' },
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => {
                    setSortBy(sort.value);
                    onFilter({
                      searchTerm,
                      category,
                      sortBy: sort.value,
                    });
                  }}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: sortBy === sort.value ? 'oklch(0.78 0.15 85 / 30%)' : 'oklch(0.20 0.06 270)',
                    color: sortBy === sort.value ? 'oklch(0.78 0.15 85)' : 'oklch(0.60 0.02 290)',
                    border: sortBy === sort.value ? '1px solid oklch(0.78 0.15 85)' : '1px solid oklch(0.78 0.15 85 / 10%)',
                  }}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* 리셋 버튼 */}
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            style={{
              background: 'oklch(0.65 0.22 15 / 20%)',
              color: 'oklch(0.65 0.22 15)',
              border: '1px solid oklch(0.65 0.22 15 / 30%)',
            }}
          >
            <X size={14} />
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
