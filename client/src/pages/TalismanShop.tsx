import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, ArrowLeft, Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

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
    {
      id: 1,
      name: '연애 부적',
      price: 15000,
      description: '사랑과 인연을 이끌어주는 부적',
      benefit: '연애운 상승, 좋은 인연 만남',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-1-love-bLeDzFpnV2UzvMrKEXHcfS.png',
      liked: false,
    },
    {
      id: 2,
      name: '재물 부적',
      price: 15000,
      description: '재운과 복을 가져오는 부적',
      benefit: '재운 상승, 사업 번영',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-2-wealth-mRS4ntPC5oMZUSQrufKhfx.png',
      liked: false,
    },
    {
      id: 3,
      name: '건강 부적',
      price: 15000,
      description: '건강과 치유를 주는 부적',
      benefit: '건강 증진, 질병 예방',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-3-health-e8fgjmK6ft6oQ2RaJMeRPG.png',
      liked: false,
    },
    {
      id: 4,
      name: '보호 부적',
      price: 15000,
      description: '안전과 보호를 주는 부적',
      benefit: '사고 예방, 안전 보호',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-4-protection-j6YmcCi3ALWNMUxQAFYHsm.png',
      liked: false,
    },
    {
      id: 5,
      name: '성공 부적',
      price: 15000,
      description: '성공과 성취를 이끌어주는 부적',
      benefit: '성공운 상승, 목표 달성',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-5-success-6yziXbQeZ27Bpmt9S2S5Vi.png',
      liked: false,
    },
    {
      id: 6,
      name: '조화 부적',
      price: 15000,
      description: '조화와 평화를 가져오는 부적',
      benefit: '가정 화목, 인간관계 개선',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-6-harmony-HATmo4UvH6h2kFMqvf4PQw.png',
      liked: false,
    },
    {
      id: 7,
      name: '행운 부적',
      price: 15000,
      description: '행운과 좋은 기운을 주는 부적',
      benefit: '행운 상승, 좋은 일 발생',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-7-luck-GjiKSjMM23b5PgV7RKgAc8.png',
      liked: false,
    },
    {
      id: 8,
      name: '학업 부적',
      price: 15000,
      description: '학업과 지혜를 주는 부적',
      benefit: '학업 성취, 시험 합격',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663786803659/B23kaSJwN8DhSY2JeTWyAi/talisman-white-gold-8-study-XuKPVKHHHxDWQ2JVKPUjn2.png',
      liked: false,
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setTalismans(talismans.map(item =>
      item.id === id ? { ...item, liked: !item.liked } : item
    ));
  };

  const addToCart = (talisman: Talisman) => {
    const existing = cart.find((item) => item.id === talisman.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === talisman.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...talisman, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = () => {
    const newPurchased = [...purchasedItems, ...cart.map(item => item.id)];
    setPurchasedItems(newPurchased);
    setCart([]);
    setShowCart(false);
    alert('결제가 완료되었습니다! 부적 이미지를 다운로드할 수 있습니다.');
  };

  const downloadImage = async (imageUrl: string, talismanName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${talismanName}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('이미지 다운로드에 실패했습니다.');
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 헤더 */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-4 flex items-center justify-between shadow-lg">
        <button
          onClick={() => setLocation('/')}
          className="hover:bg-white/20 p-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">✨ 부적 상점</h1>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative hover:bg-white/20 p-2 rounded-lg transition-colors"
        >
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {showCart ? (
        // 장바구니 뷰
        <div className="p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-300">
            <h2 className="text-3xl font-bold text-yellow-800 mb-6">🛒 장바구니</h2>
            {cart.length === 0 ? (
              <p className="text-yellow-700 text-center py-8">장바구니가 비어있습니다</p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-yellow-900">{item.name}</p>
                        <p className="text-sm text-yellow-700">{item.price.toLocaleString()}원</p>
                      </div>
                      <div className="flex items-center gap-2 mx-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-amber-200 rounded"
                        >
                          <Minus size={16} className="text-yellow-700" />
                        </button>
                        <span className="w-6 text-center font-semibold text-yellow-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-amber-200 rounded"
                        >
                          <Plus size={16} className="text-yellow-700" />
                        </button>
                      </div>
                      <p className="w-24 text-right font-semibold text-yellow-600">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-yellow-200 pt-4">
                  <div className="flex justify-between mb-4">
                    <p className="text-lg font-bold text-yellow-900">총액</p>
                    <p className="text-lg font-bold text-yellow-600">{totalPrice.toLocaleString()}원</p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white font-bold py-3 rounded-lg transition-all duration-300"
                  >
                    결제하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        // 부적 그리드 뷰
        <div className="p-4">
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
            <h2 className="text-yellow-900 font-bold mb-2">✨ 영적 보호와 행운의 부적</h2>
            <p className="text-yellow-800 text-sm">
              전통 한국 부적으로 당신의 삶에 긍정적인 에너지를 불어넣으세요.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {talismans.map((talisman) => (
              <div
                key={talisman.id}
                className="bg-white border-2 border-yellow-300 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* 이미지 */}
                <div className="relative overflow-hidden bg-yellow-50 aspect-square">
                  <img
                    src={talisman.image}
                    alt={talisman.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* 정보 */}
                <div className="p-3">
                  <h3 className="text-yellow-900 font-bold text-sm mb-1">{talisman.name}</h3>
                  <p className="text-yellow-700 text-xs mb-2">{talisman.description}</p>
                  <p className="text-yellow-600 text-xs mb-3 font-semibold">💫 {talisman.benefit}</p>

                  {/* 가격 */}
                  <div className="mb-3 pb-3 border-b-2 border-yellow-200">
                    <p className="text-yellow-900 font-bold text-lg">₩{talisman.price.toLocaleString()}</p>
                  </div>

                  {/* 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(talisman)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                    >
                      담기
                    </button>
                    <button
                      onClick={() => toggleLike(talisman.id)}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                        talisman.liked
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      }`}
                    >
                      <Heart size={18} fill={talisman.liked ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* 다운로드 버튼 - 구매한 경우만 표시 */}
                  {purchasedItems.includes(talisman.id) && (
                    <button
                      onClick={() => downloadImage(talisman.image, talisman.name)}
                      className="w-full mt-2 bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Download size={14} />
                      다운로드
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
