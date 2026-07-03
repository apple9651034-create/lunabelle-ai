import React, { useRef, useState } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ConsultationCardShareProps {
  talismanName: string;
  talismanImage: string;
  summary: string;
  consultationType: 'saju' | 'tarot' | 'yuk';
}

export default function ConsultationCardShare({
  talismanName,
  talismanImage,
  summary,
  consultationType,
}: ConsultationCardShareProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const getTypeInfo = (type: string) => {
    const info: Record<string, { label: string; color: string; icon: string }> = {
      saju: { label: '사주 상담', color: 'oklch(0.70 0.18 60)', icon: '🌟' },
      tarot: { label: '타로 상담', color: 'oklch(0.50 0.28 290)', icon: '🔮' },
      yuk: { label: '육효 상담', color: 'oklch(0.78 0.15 85)', icon: '🎲' },
    };
    return info[type] || info.saju;
  };

  const typeInfo = getTypeInfo(consultationType);

  const generateImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0415',
        scale: 2,
      });

      // 이미지 다운로드
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `luna-consultation-${Date.now()}.png`;
      link.click();

      // 클립보드에 이미지 복사
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }
      });
    } catch (error) {
      console.error('카드 생성 실패:', error);
      alert('카드 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToKakao = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0415',
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'consultation.png', { type: 'image/png' });
          
          // 카카오톡 공유 (실제 구현은 카카오 SDK 필요)
          alert('카카오톡 공유 기능은 카카오 SDK 설정 후 사용 가능합니다.');
        }
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToInstagram = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0415',
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          // 인스타그램 DM으로 공유 (웹에서는 직접 공유 불가, 이미지 다운로드 후 수동 공유)
          alert('인스타그램 스레드로 공유하려면 다운로드한 이미지를 직접 업로드해주세요.');
        }
      });
    } catch (error) {
      console.error('인스타그램 공유 실패:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 카드 미리보기 */}
      <div
        ref={cardRef}
        className="rounded-xl overflow-hidden border-2 p-6 space-y-4"
        style={{
          background: 'linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: typeInfo.color,
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <p className="text-sm font-bold" style={{ color: typeInfo.color }}>
            {typeInfo.icon} {typeInfo.label}
          </p>
          <p className="text-xs" style={{ color: 'oklch(0.60 0.02 290)' }}>
            AI 루나의 맞춤형 부적 추천
          </p>
        </div>

        {/* 부적 이미지 */}
        <div className="flex justify-center">
          <img
            src={talismanImage}
            alt={talismanName}
            className="w-32 h-32 rounded-lg object-cover"
          />
        </div>

        {/* 부적명 */}
        <div className="text-center">
          <p className="font-bold text-lg" style={{ color: typeInfo.color }}>
            {talismanName}
          </p>
        </div>

        {/* 요약 코멘트 */}
        <div
          className="p-4 rounded-lg text-xs leading-relaxed border-l-4"
          style={{
            background: `${typeInfo.color}15`,
            borderColor: typeInfo.color,
            color: 'oklch(0.78 0.15 85)',
          }}
        >
          <p className="font-bold mb-2">✨ 루나의 조언</p>
          <p>{summary}</p>
        </div>

        {/* 푸터 */}
        <div className="text-center pt-2 border-t" style={{ borderColor: `${typeInfo.color}40` }}>
          <p className="text-xs" style={{ color: 'oklch(0.60 0.02 290)' }}>
            AI 루나와 함께 당신의 운명을 만나세요
          </p>
        </div>
      </div>

      {/* 공유 버튼 */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50"
          style={{
            background: 'oklch(0.78 0.15 85 / 20%)',
            color: 'oklch(0.78 0.15 85)',
            border: '1px solid oklch(0.78 0.15 85 / 40%)',
          }}
        >
          {isGenerating ? '생성 중...' : (
            <>
              <Download size={16} />
              다운로드
            </>
          )}
        </button>

        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50"
          style={{
            background: copied ? 'oklch(0.70 0.18 60 / 20%)' : 'oklch(0.78 0.15 85 / 20%)',
            color: copied ? 'oklch(0.70 0.18 60)' : 'oklch(0.78 0.15 85)',
            border: copied ? '1px solid oklch(0.70 0.18 60 / 40%)' : '1px solid oklch(0.78 0.15 85 / 40%)',
          }}
        >
          {copied ? (
            <>
              <Check size={16} />
              복사됨!
            </>
          ) : (
            <>
              <Copy size={16} />
              클립보드 복사
            </>
          )}
        </button>

        <button
          onClick={shareToKakao}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #FFE812 0%, #FDD835 100%)',
            color: '#000000',
          }}
        >
          <Share2 size={16} />
          카카오톡
        </button>

        <button
          onClick={shareToInstagram}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 100%)',
            color: '#FFFFFF',
          }}
        >
          <Share2 size={16} />
          인스타그램
        </button>
      </div>
    </div>
  );
}
