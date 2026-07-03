/* AI 루나 — TalismanShop
 * Design: Mystic Dark Luxury — dark card grid, gold borders, purple CTA
 */
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, ArrowLeft, Heart, Download, X, Info } from 'lucide-react';
import { useLocation } from 'wouter';
import { TalismanDescription } from '@/components/TalismanDescriptions';
import TalismanDetailModal from '@/components/TalismanDetailModal';
import TalismanDownloadAnimation from '@/components/TalismanDownloadAnimation';
import { getTalismanDetail } from '@/lib/talismanDetails';

interface Talisman {
  id: number;
  name: string;
  price: number;
  description: string;
  benefit: string;
  image: string;
  liked: boolean;
}

interface CartItem extends Talisman {
  quantity: number;
}

export default function TalismanShop() {
  const [, setLocation] = useLocation();

  const [talismans, setTalismans] = useState<Talisman[]>([
    { id: 1, name: '연애 부적', price: 4900, description: '사랑과 인연을 이끌어주는 부적', benefit: '연애운 상승, 좋은 인연 만남', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-1-love-bLeDzFpnV2UzvMrKEXHcfS.png', liked: false },
    { id: 2, name: '재물 부적', price: 4900, description: '재운과 복을 가져오는 부적', benefit: '재운 상승, 사업 번영', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-2-wealth-mRS4ntPC5oMZUSQrufKhfx.png', liked: false },
    { id: 3, name: '건강 부적', price: 4900, description: '건강과 치유를 주는 부적', benefit: '건강 증진, 질병 예방', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-3-health-e8fgjmK6ft6oQ2RaJMeRPG.png', liked: false },
    { id: 4, name: '보호 부적', price: 4900, description: '안전과 보호를 주는 부적', benefit: '사고 예방, 안전 보호', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-4-protection-j6YmcCi3ALWNMUxQAFYHsm.png', liked: false },
    { id: 5, name: '성공 부적', price: 4900, description: '성공과 성취를 이끌어주는 부적', benefit: '성공운 상승, 목표 달성', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-5-success-6yziXbQeZ27Bpmt9S2S5Vi.png', liked: false },
    { id: 6, name: '조화 부적', price: 4900, description: '조화와 평화를 가져오는 부적', benefit: '가정 화목, 인간관계 개선', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-6-harmony-HATmo4UvH6h2kFMqvf4PQw.png', liked: false },
    { id: 7, name: '행운 부적', price: 4900, description: '행운과 좋은 기운을 주는 부적', benefit: '행운 상승, 좋은 일 발생', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-7-luck-GjiKSjMM23b5PgV7RKgAc8.png', liked: false },
    { id: 8, name: '학업 부적', price: 4900, description: '학업과 지혜를 주는 부적', benefit: '학업 성취, 시험 합격', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-8-study-XuKPVKHHHxDWQ2JVKPUjn2.png', liked: false },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<number[]>([]);
  const [selectedTalismanId, setSelectedTalismanId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDownloadAnimation, setShowDownloadAnimation] = useState(false);

  const toggleLike = (id: number) => {
    setTalismans((prev) => prev.map((t) => t.id === id ? { ...t, liked: !t.liked } : t));
  };

  const addToCart = (talisman: Talisman) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === talisman.id);
      if (existing) return prev.map((item) => item.id === talisman.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...talisman, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    const ids = cart.map((item) => item.id);
    setPurchasedItems((prev) => Array.from(new Set([...prev, ...ids])));
    
    // 구매한 부적 localStorage에 저장
    const cartTalismans = cart.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      purchaseDate: new Date().toISOString(),
      price: item.price,
    }));
    
    const saved = localStorage.getItem('purchasedTalismans');
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [...existing, ...cartTalismans];
    localStorage.setItem('purchasedTalismans', JSON.stringify(updated));
    
    setCart([]);
    setShowCart(false);
    alert('구매가 완료되었습니다! 부적 이미지를 다운로드하실 수 있습니다.');
  };

  const downloadImage = async (imageUrl: string, name: string) => {
    try {
      setShowDownloadAnimation(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('다운로드 중 오류가 발생했습니다.');
      setShowDownloadAnimation(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  if (showCart) {
    return (
      <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
        <div
          className="px-5 py-4 flex items-center gap-3 border-b"
          style={{ background: 'oklch(0.14 0.04 270)', borderColor: 'oklch(1 0 0 / 10%)' }}
        >
          <button onClick={() => setShowCart(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'oklch(0.78 0.15 85)' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            장바구니
          </h1>
        </div>

        <div className="p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'oklch(0.55 0.02 290)' }}>
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-40" />
              <p>장바구니가 비어있습니다</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-3" style={cardStyle}>
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" style={{ background: '#fff' }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: 'oklch(0.94 0.015 90)' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>{item.price.toLocaleString()}원</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'oklch(0.22 0.05 270)', color: 'oklch(0.94 0.015 90)' }}>
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center" style={{ color: 'oklch(0.94 0.015 90)' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'oklch(0.22 0.05 270)', color: 'oklch(0.94 0.015 90)' }}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-2xl" style={{ background: 'oklch(0.17 0.04 270)', border: '1px solid oklch(0.78 0.15 85 / 20%)' }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>총 금액</span>
                  <span className="text-xl font-bold" style={{ color: 'oklch(0.78 0.15 85)', fontFamily: "'Noto Serif KR', serif" }}>
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                    color: 'oklch(0.97 0.005 90)',
                    boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
                    fontFamily: "'Noto Serif KR', serif",
                  }}
                >
                  구매하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between border-b"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            🏮 부적 상점
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'oklch(0.78 0.15 85)' }}>전통 한국 부적 컬렉션</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative p-2.5 rounded-xl transition-all"
          style={{ background: 'oklch(0.22 0.05 270)', color: 'oklch(0.94 0.015 90)' }}
        >
          <ShoppingCart size={20} />
          {cart.length > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ background: 'oklch(0.78 0.15 85)', color: 'oklch(0.12 0.03 270)' }}
            >
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {talismans.map((talisman) => (
          <div
            key={talisman.id}
            className="rounded-2xl overflow-hidden transition-all duration-150"
            style={{
              ...cardStyle,
              ...(purchasedItems.includes(talisman.id)
                ? { borderColor: 'oklch(0.78 0.15 85 / 40%)' }
                : {}),
            }}
          >
            {/* Image */}
            <div className="relative aspect-square" style={{ background: '#f8f4ef' }}>
              <img src={talisman.image} alt={talisman.name} className="w-full h-full object-cover" />
              <button
                onClick={() => toggleLike(talisman.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(0.12 0.03 270 / 60%)' }}
              >
                <Heart
                  size={14}
                  style={{
                    color: talisman.liked ? 'oklch(0.65 0.22 15)' : 'oklch(0.70 0.02 290)',
                    fill: talisman.liked ? 'oklch(0.65 0.22 15)' : 'none',
                  }}
                />
              </button>
              {purchasedItems.includes(talisman.id) && (
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: 'oklch(0.78 0.15 85)', color: 'oklch(0.12 0.03 270)' }}
                >
                  구매완료
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1">
                  <p className="font-bold text-sm mb-0.5" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
                    {talisman.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTalismanId(talisman.id);
                    setShowDetailModal(true);
                  }}
                  className="p-1 rounded-lg transition-colors hover:bg-white/10 flex-shrink-0"
                  style={{ color: 'oklch(0.70 0.18 60)' }}
                >
                  <Info size={14} />
                </button>
              </div>
              <p className="text-[11px] mb-1 leading-snug" style={{ color: 'oklch(0.60 0.02 290)' }}>
                {talisman.description}
              </p>
              <p className="text-sm font-bold mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
                {talisman.price.toLocaleString()}원
              </p>

              {purchasedItems.includes(talisman.id) ? (
                <button
                  onClick={() => downloadImage(talisman.image, talisman.name)}
                  className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.97]"
                  style={{
                    background: 'oklch(0.78 0.15 85 / 15%)',
                    color: 'oklch(0.78 0.15 85)',
                    border: '1px solid oklch(0.78 0.15 85 / 30%)',
                  }}
                >
                  <Download size={12} />
                  다운로드
                </button>
              ) : (
                <button
                  onClick={() => addToCart(talisman)}
                  className="w-full py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                    color: 'oklch(0.97 0.005 90)',
                  }}
                >
                  담기
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 부적 상세 설명 모달 */}
      <TalismanDetailModal
        talisman={selectedTalismanId ? getTalismanDetail(selectedTalismanId) || null : null}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* 다운로드 애니메이션 */}
      <TalismanDownloadAnimation
        isVisible={showDownloadAnimation}
        onComplete={() => setShowDownloadAnimation(false)}
      />
    </div>
  );
}
