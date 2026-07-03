/**
 * 상담 내역 SNS 공유 버튼 컴포넌트
 * 카카오톡, 인스타그램 스레드, 클립보드 공유
 */
import React, { useState } from 'react';
import { Share2, MessageCircle, Copy } from 'lucide-react';
import {
  shareToKakaoTalk,
  shareToInstagramThread,
  shareToClipboard,
  formatConsultationForShare,
  ShareContent,
} from '@/lib/snsShare';

interface ConsultationShareButtonsProps {
  consultationType: string; // '사주', '타로', '육효'
  messages: any[];
  className?: string;
}

export default function ConsultationShareButtons({
  consultationType,
  messages,
  className = '',
}: ConsultationShareButtonsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleKakaoShare = async () => {
    setIsSharing(true);
    try {
      const shareContent: ShareContent = {
        title: `🌙 AI 루나 ${consultationType} 상담`,
        description: messages
          .filter((m) => m.role === 'assistant')
          .map((m) => m.content.substring(0, 100))
          .join('... '),
      };
      await shareToKakaoTalk(shareContent);
    } finally {
      setIsSharing(false);
      setShowMenu(false);
    }
  };

  const handleInstagramShare = async () => {
    setIsSharing(true);
    try {
      const text = formatConsultationForShare(consultationType, messages);
      await shareToInstagramThread({ title: '', description: text });
    } finally {
      setIsSharing(false);
      setShowMenu(false);
    }
  };

  const handleClipboardShare = async () => {
    setIsSharing(true);
    try {
      const text = formatConsultationForShare(consultationType, messages);
      await shareToClipboard(text);
    } finally {
      setIsSharing(false);
      setShowMenu(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 공유 버튼 */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isSharing}
        className="p-2 hover:opacity-70 transition-opacity disabled:opacity-50"
        title="상담 내역 공유"
      >
        <Share2 size={20} style={{ color: 'oklch(0.70 0.18 60)' }} />
      </button>

      {/* 공유 메뉴 */}
      {showMenu && (
        <div
          className="absolute top-full right-0 mt-2 rounded-lg shadow-lg z-50 overflow-hidden"
          style={{ background: 'oklch(0.18 0.08 290)', border: '1px solid oklch(1 0 0 / 10%)' }}
        >
          {/* 카카오톡 */}
          <button
            onClick={handleKakaoShare}
            disabled={isSharing}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50 border-b"
            style={{ borderColor: 'oklch(1 0 0 / 10%)', color: 'oklch(0.94 0.015 90)' }}
          >
            <MessageCircle size={16} />
            <span className="text-sm">카카오톡</span>
          </button>

          {/* 인스타그램 스레드 */}
          <button
            onClick={handleInstagramShare}
            disabled={isSharing}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50 border-b"
            style={{ borderColor: 'oklch(1 0 0 / 10%)', color: 'oklch(0.94 0.015 90)' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8" />
            </svg>
            <span className="text-sm">인스타그램 스레드</span>
          </button>

          {/* 클립보드 복사 */}
          <button
            onClick={handleClipboardShare}
            disabled={isSharing}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ color: 'oklch(0.94 0.015 90)' }}
          >
            <Copy size={16} />
            <span className="text-sm">클립보드 복사</span>
          </button>
        </div>
      )}
    </div>
  );
}
