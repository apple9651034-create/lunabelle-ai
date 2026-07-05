/**
 * 부적 상세 설명 모달 컴포넌트
 * 클릭 시 부적의 상세 정보를 표시
 * 이미지 확대 및 저장 기능 포함
 */
import React, { useState } from 'react';
import { X, ZoomIn, Download } from 'lucide-react';
import { TalismanDetail } from '@/lib/talismanDetails';

interface TalismanDetailModalProps {
  talisman: TalismanDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isPurchased?: boolean; // 결제 여부
}

export default function TalismanDetailModal({
  talisman,
  isOpen,
  onClose,
  isPurchased = false,
}: TalismanDetailModalProps) {
  const [showImageZoom, setShowImageZoom] = useState(false);

  if (!isOpen || !talisman) return null;

  const handleImageDownload = async () => {
    if (!isPurchased) {
      alert('결제 후에만 이미지를 저장할 수 있습니다.');
      return;
    }

    try {
      const response = await fetch(talisman.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${talisman.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했습니다.');
    }
  };

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

        {/* 헤더 - 이미지 표시 */}
        <div
          className="p-8 text-center border-b relative"
          style={{
            background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
            borderColor: 'oklch(0.70 0.18 60)',
          }}
        >
          {/* 부적 이미지 */}
          <div className="relative inline-block mb-4">
            <img
              src={talisman.image}
              alt={talisman.name}
              className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowImageZoom(true)}
            />
            <button
              onClick={() => setShowImageZoom(true)}
              className="absolute bottom-2 right-2 p-2 rounded-lg transition-all hover:scale-110"
              style={{
                background: 'oklch(0.70 0.18 60)',
                color: 'oklch(0.12 0.03 270)',
              }}
              title="이미지 확대"
            >
              <ZoomIn size={16} />
            </button>
          </div>

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

          {/* 버튼 그룹 */}
          <div className="flex gap-3 pt-4">
            {/* 이미지 저장 버튼 */}
            <button
              onClick={handleImageDownload}
              className="flex-1 py-3 rounded-xl font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-2"
              style={{
                background: isPurchased ? 'linear-gradient(135deg, oklch(0.70 0.18 60), oklch(0.60 0.15 50))' : 'oklch(0.30 0.05 290)',
                color: isPurchased ? 'oklch(1 0 0)' : 'oklch(0.60 0.02 290)',
                opacity: isPurchased ? 1 : 0.5,
                cursor: isPurchased ? 'pointer' : 'not-allowed',
                boxShadow: isPurchased ? '0 4px 20px oklch(0.70 0.18 60 / 40%)' : 'none',
              }}
              disabled={!isPurchased}
              title={isPurchased ? '이미지 저장' : '결제 후에만 저장 가능'}
            >
              <Download size={18} />
              이미지 저장
            </button>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold transition-all active:scale-[0.97]"
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

      {/* 이미지 확대 모달 */}
      {showImageZoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.9)' }} onClick={() => setShowImageZoom(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-white/10 z-10"
            >
              <X size={32} style={{ color: 'oklch(0.94 0.015 90)' }} />
            </button>

            {/* 확대된 이미지 */}
            <img
              src={talisman.image}
              alt={talisman.name}
              className="w-full h-auto rounded-lg"
            />

            {/* 이미지 정보 */}
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                {talisman.name}
              </h3>
              <p style={{ color: 'oklch(0.78 0.15 85)' }}>
                {talisman.meaning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
