/**
 * 내 부적 보관함 페이지
 * 사용자가 구매한 부적 내역을 모아보고 이미지를 다시 다운로드할 수 있음
 */
import React, { useEffect, useState } from 'react';
import { Download, Trash2, Calendar, Coins } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import TalismanDetailModal from '@/components/TalismanDetailModal';
import { TALISMAN_DETAILS } from '@/lib/talismanDetails';
import { useAuth } from '@/_core/hooks/useAuth';

interface PurchasedTalisman {
  id: number;
  talismanId: string;
  talismanName: string;
  talismanImage?: string;
  price: number;
  purchasedAt: Date;
  imageUrl?: string;
  consultationType?: string;
  consultationContent?: string;
}

export default function MyTalismanVaultPage() {
  const { user, isAuthenticated } = useAuth();
  const [talismans, setTalismans] = useState<PurchasedTalisman[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTalisman, setSelectedTalisman] = useState<PurchasedTalisman | null>(null);

  // 부적 목록 조회 (실제로는 tRPC를 통해 서버에서 조회)
  useEffect(() => {
    if (!isAuthenticated) return;

    // 임시 데이터 (실제로는 서버에서 조회)
    const mockTalismans: PurchasedTalisman[] = [
      {
        id: 1,
        talismanId: 'love',
        talismanName: '연애 부적',
        talismanImage: '❤️',
        price: 2900,
        purchasedAt: new Date('2026-07-01'),
        consultationType: 'saju',
        consultationContent: '당신의 사주에 맞는 연애 운을 높여주는 부적입니다.',
      },
      {
        id: 2,
        talismanId: 'wealth',
        talismanName: '재물 부적',
        talismanImage: '💰',
        price: 2900,
        purchasedAt: new Date('2026-06-28'),
        consultationType: 'yuk',
        consultationContent: '재물 운을 증진시키는 강력한 부적입니다.',
      },
    ];

    setTalismans(mockTalismans);
    setLoading(false);
  }, [isAuthenticated]);

  const handleDownloadImage = (talisman: PurchasedTalisman) => {
    if (!talisman.imageUrl) {
      alert('이미지를 다운로드할 수 없습니다.');
      return;
    }

    // 이미지 다운로드 로직
    const link = document.createElement('a');
    link.href = talisman.imageUrl;
    link.download = `${talisman.talismanName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteTalisman = (id: number) => {
    if (confirm('이 부적을 보관함에서 삭제하시겠습니까?')) {
      setTalismans(talismans.filter((t) => t.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.12 0.05 290)' }}>
        <div className="text-center">
          <p style={{ color: 'oklch(0.70 0.02 290)' }}>로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.12 0.05 290)' }}>
        <div className="text-center">
          <p style={{ color: 'oklch(0.70 0.02 290)' }}>부적 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.05 290)' }}>
      {/* 헤더 */}
      <div className="p-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 10%)', background: 'oklch(0.15 0.08 290)' }}>
        <h1 className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
          🏺 내 부적 보관함
        </h1>
        <p style={{ color: 'oklch(0.70 0.02 290)' }} className="text-sm mt-1">
          구매한 부적 내역을 관리하고 이미지를 다시 다운로드할 수 있습니다
        </p>
      </div>

      {/* 부적 목록 */}
      <div className="p-4">
        {talismans.length === 0 ? (
          <div
            className="text-center py-12 rounded-lg border"
            style={{ borderColor: 'oklch(1 0 0 / 10%)', background: 'oklch(0.15 0.08 290)' }}
          >
            <p style={{ color: 'oklch(0.70 0.02 290)' }}>아직 구매한 부적이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {talismans.map((talisman) => (
              <div
                key={talisman.id}
                onClick={() => setSelectedTalisman(talisman)}
                className="p-4 rounded-lg border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                style={{
                  borderColor: 'oklch(1 0 0 / 10%)',
                  background: 'linear-gradient(135deg, oklch(0.18 0.08 290), oklch(0.15 0.06 310))',
                }}
              >
                {/* 부적 이미지 */}
                <div
                  className="w-full h-32 flex items-center justify-center text-6xl rounded-lg mb-3"
                  style={{ background: 'oklch(0.12 0.05 290)' }}
                >
                  {talisman.talismanImage}
                </div>

                {/* 부적 정보 */}
                <h3 className="font-bold text-lg mb-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  {talisman.talismanName}
                </h3>

                {/* 구매 날짜 */}
                <div className="flex items-center gap-2 mb-2" style={{ color: 'oklch(0.70 0.02 290)' }}>
                  <Calendar size={16} />
                  <span className="text-sm">{talisman.purchasedAt.toLocaleDateString()}</span>
                </div>

                {/* 가격 */}
                <div className="flex items-center gap-2 mb-3" style={{ color: 'oklch(0.70 0.18 60)' }}>
                  <Coins size={16} />
                  <span className="text-sm font-semibold">{talisman.price} 크레딧</span>
                </div>

                {/* 상담 정보 */}
                {talisman.consultationType && (
                  <div className="mb-3 p-2 rounded" style={{ background: 'oklch(0.12 0.05 290)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.70 0.18 60)' }}>
                      상담 타입: {talisman.consultationType.toUpperCase()}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                      {talisman.consultationContent}
                    </p>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadImage(talisman)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded font-semibold transition-all"
                    style={{
                      background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                      color: 'oklch(1 0 0)',
                    }}
                  >
                    <Download size={16} />
                    <span className="text-sm">다운로드</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTalisman(talisman.id)}
                    className="p-2 rounded transition-all hover:opacity-80"
                    style={{ background: 'oklch(0.18 0.08 0)' }}
                  >
                    <Trash2 size={16} style={{ color: 'oklch(0.70 0.18 30)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 통계 */}
      {talismans.length > 0 && (
        <div className="p-4 mt-4">
          <div
            className="p-4 rounded-lg border"
            style={{
              borderColor: 'oklch(1 0 0 / 10%)',
              background: 'linear-gradient(135deg, oklch(0.18 0.08 290), oklch(0.15 0.06 310))',
            }}
          >
            <h3 className="font-bold mb-3" style={{ color: 'oklch(0.94 0.015 90)' }}>
              📊 보관함 통계
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={{ color: 'oklch(0.70 0.02 290)' }} className="text-sm mb-1">
                  총 부적 개수
                </p>
                <p className="text-2xl font-bold" style={{ color: 'oklch(0.70 0.18 60)' }}>
                  {talismans.length}개
                </p>
              </div>
              <div>
                <p style={{ color: 'oklch(0.70 0.02 290)' }} className="text-sm mb-1">
                  총 지출 크레딧
                </p>
                <p className="text-2xl font-bold" style={{ color: 'oklch(0.70 0.18 60)' }}>
                  {talismans.reduce((sum, t) => sum + t.price, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 부적 상세 정보 팝업 */}
      {selectedTalisman && (
        <TalismanDetailModal
          isOpen={!!selectedTalisman}
          talisman={TALISMAN_DETAILS[parseInt(selectedTalisman.talismanId) || 1] || {
            name: selectedTalisman.talismanName,
            symbol: selectedTalisman.talismanImage || '🏺',
            meaning: '부적의 의미',
            benefit: '부적의 효능',
            description: selectedTalisman.consultationContent || '부적에 대한 설명',
            usage: '부적 사용 방법',
            history: '부적의 역사',
          }}
          onClose={() => setSelectedTalisman(null)}
        />
      )}
    </div>
  );
}
