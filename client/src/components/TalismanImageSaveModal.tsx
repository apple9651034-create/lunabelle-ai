/**
 * 부적 이미지 저장 팝업 컴포넌트
 * 결제 완료 후 부적 이미지를 저장할 수 있는 모달
 */
import React from 'react';
import { X, Download, Share2 } from 'lucide-react';

interface TalismanImageSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  talismanName: string;
  talismanImage: string;
  onSave: () => void;
  onShare: () => void;
}

export default function TalismanImageSaveModal({
  isOpen,
  onClose,
  talismanName,
  talismanImage,
  onSave,
  onShare,
}: TalismanImageSaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div
        className="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl"
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
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
            ✨ {talismanName} 저장
          </h2>
          <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
            결제 완료! 부적 이미지를 저장하세요.
          </p>
        </div>

        {/* 이미지 표시 */}
        <div className="p-8 text-center">
          <img
            src={talismanImage}
            alt={talismanName}
            className="w-48 h-48 object-cover rounded-lg mx-auto mb-6 shadow-lg"
          />
          
          <p className="text-sm mb-6" style={{ color: 'oklch(0.70 0.02 290)' }}>
            이 부적 이미지를 저장하거나 공유할 수 있습니다.
          </p>

          {/* 버튼 그룹 */}
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'oklch(0.50 0.28 290)',
                color: 'oklch(1 0 0)',
              }}
            >
              <Download size={18} />
              이미지 저장
            </button>
            <button
              onClick={onShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'oklch(0.45 0.25 310)',
                color: 'oklch(1 0 0)',
              }}
            >
              <Share2 size={18} />
              공유하기
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{
              background: 'oklch(0.25 0.08 280)',
              color: 'oklch(0.70 0.02 290)',
            }}
          >
            닫기
          </button>
        </div>
      <PaymentSuccessAnimation 
        isVisible={showAnimation}
        onComplete={() => setShowAnimation(false)}
      />
    </div>
    </div>
  );
}
