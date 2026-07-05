/**
 * ConsultationQRCode.tsx
 * 상담 내역 QR코드 표시 컴포넌트
 */
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Copy, X } from 'lucide-react';

interface ConsultationQRCodeProps {
  consultationType: string;
  consultationId: string;
  onClose?: () => void;
}

export default function ConsultationQRCode({
  consultationType,
  consultationId,
  onClose,
}: ConsultationQRCodeProps) {
  const [copied, setCopied] = useState(false);

  // 공유 링크 생성
  const shareLink = `${window.location.origin}/consultation/${consultationType}/${consultationId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleDownloadQR = () => {
    const qrElement = document.getElementById('consultation-qr-code');
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${consultationType}-상담-QR코드.png`;
        link.click();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg p-6 max-w-sm w-full"
        style={{ background: 'oklch(0.15 0.05 270)' }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
            🌙 상담 공유
          </h3>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:opacity-70">
              <X size={20} style={{ color: 'oklch(0.94 0.015 90)' }} />
            </button>
          )}
        </div>

        {/* QR코드 */}
        <div className="flex justify-center mb-6">
          <div
            id="consultation-qr-code"
            className="p-4 rounded-lg"
            style={{ background: 'oklch(0.95 0.01 90)' }}
          >
            <QRCode
              value={shareLink}
              size={200}
              level="H"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>
        </div>

        {/* 공유 링크 */}
        <div className="mb-4">
          <p className="text-xs mb-2" style={{ color: 'oklch(0.70 0.18 60)' }}>
            공유 링크:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-3 py-2 rounded text-sm"
              style={{
                background: 'oklch(0.12 0.03 270)',
                color: 'oklch(0.94 0.015 90)',
                border: '1px solid oklch(0.70 0.18 60 / 30%)',
              }}
            />
            <button
              onClick={handleCopyLink}
              className="p-2 rounded hover:opacity-70 transition-opacity"
              style={{
                background: 'oklch(0.40 0.15 280)',
                color: 'oklch(0.94 0.015 90)',
              }}
              title={copied ? '복사됨!' : '링크 복사'}
            >
              <Copy size={18} />
            </button>
          </div>
          {copied && (
            <p className="text-xs mt-1" style={{ color: 'oklch(0.70 0.18 60)' }}>
              ✓ 링크가 복사되었습니다!
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadQR}
            className="flex-1 px-4 py-2 rounded font-medium transition-opacity hover:opacity-80"
            style={{
              background: 'oklch(0.40 0.15 280)',
              color: 'oklch(0.94 0.015 90)',
            }}
          >
            QR코드 다운로드
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded font-medium transition-opacity hover:opacity-80"
              style={{
                background: 'oklch(0.25 0.08 270)',
                color: 'oklch(0.94 0.015 90)',
              }}
            >
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
