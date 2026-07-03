import React, { useRef } from 'react';
import { Share2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ConsultationCardWithQRProps {
  consultationType: 'tarot' | 'saju' | 'yuk';
  question: string;
  summary: string;
  talismanName?: string;
  talismanReason?: string;
  websiteUrl?: string;
}

export const ConsultationCardWithQR: React.FC<ConsultationCardWithQRProps> = ({
  consultationType,
  question,
  summary,
  talismanName,
  talismanReason,
  websiteUrl = 'https://ai-luna.manus.space',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getConsultationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tarot: '🃏 타로',
      saju: '📅 사주',
      yuk: '☯️ 육효',
    };
    return labels[type] || type;
  };

  const generateQRCode = () => {
    // QR 코드 생성 API (간단한 방식)
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(websiteUrl)}`;
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0e27',
        scale: 2,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `luna-consultation-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to download card:', error);
      alert('카드 다운로드에 실패했습니다.');
    }
  };

  const shareCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0e27',
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;

        const file = new File([blob], 'luna-consultation.png', { type: 'image/png' });

        if (navigator.share) {
          navigator.share({
            title: 'AI 루나 상담 결과',
            text: `루나의 ${getConsultationTypeLabel(consultationType)} 상담을 받았어요!`,
            files: [file],
          }).catch(err => console.log('Share cancelled:', err));
        } else {
          // Fallback: 클립보드에 복사
          alert('공유 기능을 지원하지 않는 브라우저입니다. 카드를 다운로드해주세요.');
        }
      });
    } catch (error) {
      console.error('Failed to share card:', error);
      alert('카드 공유에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      {/* 카드 */}
      <div
        ref={cardRef}
        className="rounded-2xl p-8 border-2"
        style={{
          background: 'linear-gradient(135deg, oklch(0.15 0.08 270) 0%, oklch(0.12 0.04 270) 100%)',
          borderColor: 'oklch(0.70 0.18 60)',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        {/* 헤더 */}
        <div className="text-center mb-6">
          <p className="text-sm font-bold mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
            ✨ AI 루나 운명 예측
          </p>
          <p className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
            {getConsultationTypeLabel(consultationType)}
          </p>
        </div>

        {/* 구분선 */}
        <div
          className="h-px mb-6"
          style={{ background: 'oklch(0.78 0.15 85 / 20%)' }}
        />

        {/* 질문 */}
        <div className="mb-6">
          <p className="text-xs font-bold mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
            질문
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.94 0.015 90)' }}>
            "{question}"
          </p>
        </div>

        {/* 루나의 조언 */}
        <div className="mb-6">
          <p className="text-xs font-bold mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
            루나의 조언
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.70 0.02 290)' }}>
            {summary}
          </p>
        </div>

        {/* 부적 추천 */}
        {talismanName && (
          <div className="mb-6 p-4 rounded-lg" style={{ background: 'oklch(0.20 0.06 270)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
              🔮 맞춤형 부적 추천
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: 'oklch(0.94 0.015 90)' }}>
              {talismanName}
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
              {talismanReason}
            </p>
          </div>
        )}

        {/* 구분선 */}
        <div
          className="h-px mb-6"
          style={{ background: 'oklch(0.78 0.15 85 / 20%)' }}
        />

        {/* QR 코드 및 링크 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
              더 알아보기
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
              {websiteUrl}
            </p>
          </div>
          <img
            src={generateQRCode()}
            alt="QR Code"
            className="w-20 h-20 rounded-lg"
          />
        </div>

        {/* 푸터 */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: 'oklch(0.60 0.02 290)' }}>
            AI 루나와 함께하는 운명 예측
          </p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={downloadCard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-[0.97]"
          style={{
            background: 'oklch(0.70 0.18 60)',
            color: 'oklch(0.12 0.02 270)',
          }}
        >
          <Download size={16} />
          다운로드
        </button>
        <button
          onClick={shareCard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-[0.97]"
          style={{
            background: 'oklch(0.78 0.15 85)',
            color: 'oklch(0.12 0.02 270)',
          }}
        >
          <Share2 size={16} />
          공유
        </button>
      </div>
    </div>
  );
};

export default ConsultationCardWithQR;
