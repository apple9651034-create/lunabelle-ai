/**
 * 부적 상세 설명 모달 컴포넌트
 * 클릭 시 부적의 상세 정보를 표시
 */
import React from 'react';
import { X } from 'lucide-react';
import { TalismanDetail } from '@/lib/talismanDetails';

interface TalismanDetailModalProps {
  talisman: TalismanDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TalismanDetailModal({
  talisman,
  isOpen,
  onClose,
}: TalismanDetailModalProps) {
  if (!isOpen || !talisman) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      {/* 모달 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div
        className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          border: '2px solid oklch(0.70 0.18 60)',
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors hover:bg-white/10"
        >
          <X size={24} style={{ color: 'oklch(0.94 0.015 90)' }} />
        </button>

        {/* 헤더 */}
        <div
          className="p-8 text-center border-b"
          style={{
            background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
            borderColor: 'oklch(0.70 0.18 60)',
          }}
        >
          <div className="text-5xl mb-4">{talisman.symbol}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'oklch(1 0 0)' }}>
            {talisman.name}
          </h2>
          <p className="text-lg" style={{ color: 'oklch(0.94 0.015 90)' }}>
            {talisman.meaning}
          </p>
        </div>

        {/* 컨텐츠 */}
        <div className="p-8 space-y-6">
          {/* 효능 */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'oklch(0.70 0.18 60)' }}>
              ✨ 효능
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.94 0.015 90)' }}>
              {talisman.benefit}
            </p>
          </div>

          {/* 상세 설명 */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'oklch(0.70 0.18 60)' }}>
              📖 부적의 의미
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'oklch(0.78 0.15 85)' }}>
              {talisman.description}
            </p>
          </div>

          {/* 사용 방법 */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'oklch(0.70 0.18 60)' }}>
              🎯 사용 방법
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'oklch(0.78 0.15 85)' }}>
              {talisman.usage}
            </p>
          </div>

          {/* 역사 */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'oklch(0.70 0.18 60)' }}>
              🏛️ 역사
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.78 0.15 85)' }}>
              {talisman.history}
            </p>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              color: 'oklch(1 0 0)',
              boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
