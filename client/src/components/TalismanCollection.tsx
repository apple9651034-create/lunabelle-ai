/**
 * 마이페이지 부적 보관함 컴포넌트
 * 구매한 부적 목록을 표시하고 관리
 */
import React from 'react';
import { Download, Trash2 } from 'lucide-react';

interface PurchasedTalisman {
  id: number;
  name: string;
  image: string;
  purchaseDate: string;
  price: number;
}

interface TalismanCollectionProps {
  talismans: PurchasedTalisman[];
  onDownload: (imageUrl: string, name: string) => void;
  onRemove: (id: number) => void;
}

export default function TalismanCollection({
  talismans,
  onDownload,
  onRemove,
}: TalismanCollectionProps) {
  if (talismans.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-sm">
          아직 구매한 부적이 없습니다.
        </p>
        <p style={{ color: 'oklch(0.50 0.02 290)' }} className="text-xs mt-2">
          부적 상점에서 당신을 위한 부적을 찾아보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
        ✨ 나의 부적 보관함
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {talismans.map((talisman) => (
          <div
            key={talisman.id}
            className="rounded-lg overflow-hidden"
            style={{
              background: 'oklch(0.17 0.04 270)',
              border: '1px solid oklch(1 0 0 / 10%)',
            }}
          >
            {/* 이미지 */}
            <div className="aspect-square bg-white/5 overflow-hidden">
              <img
                src={talisman.image}
                alt={talisman.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 정보 */}
            <div className="p-3">
              <p className="font-bold text-xs mb-1" style={{ color: 'oklch(0.94 0.015 90)' }}>
                {talisman.name}
              </p>
              <p className="text-[10px] mb-2" style={{ color: 'oklch(0.60 0.02 290)' }}>
                {new Date(talisman.purchaseDate).toLocaleDateString('ko-KR')}
              </p>

              {/* 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={() => onDownload(talisman.image, talisman.name)}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.97]"
                  style={{
                    background: 'oklch(0.78 0.15 85 / 15%)',
                    color: 'oklch(0.78 0.15 85)',
                    border: '1px solid oklch(0.78 0.15 85 / 30%)',
                  }}
                >
                  <Download size={10} />
                  다운로드
                </button>
                <button
                  onClick={() => onRemove(talisman.id)}
                  className="px-2 py-1.5 rounded-lg transition-all active:scale-[0.97]"
                  style={{
                    background: 'oklch(0.65 0.22 15 / 15%)',
                    color: 'oklch(0.65 0.22 15)',
                  }}
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
