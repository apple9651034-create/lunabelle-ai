/* AI 루나 — WishesPage.tsx
 * Design: Mystic Dark Luxury
 * 소원 게시판 + 복비 기능 + 상호작용 (공감/응원)
 */
import React, { useState, useEffect } from 'react';
import { Heart, Send, Trash2, ArrowLeft, MessageCircle, ThumbsUp } from 'lucide-react';
import { useLocation } from 'wouter';
import {
  loadInteractions,
  addEmpathy,
  addEncouragement,
  getWishInteractions,
  getRecentEncouragements,
  ENCOURAGEMENT_TEMPLATES,
  WishWithInteractions,
} from '@/lib/wishInteraction';
import { processBlessingPayment, getUserCredit } from '@/lib/paymentHandler';
import InteractionAnimation from '@/components/InteractionAnimation';

interface Wish {
  id: number;
  content: string;
  category: string;
  likes: number;
  liked: boolean;
  date: string;
  blessings: number;
  expiresAt: string;
}

interface BlessingOption {
  amount: number;
  label: string;
}

const CATEGORIES = ['연애', '재물', '건강', '학업', '기타'];
const BLESSING_OPTIONS: BlessingOption[] = [
  { amount: 3000, label: '3,000원' },
  { amount: 1000, label: '1,000원' },
  { amount: 500, label: '500원' },
  { amount: 100, label: '100원' },
];

const STORAGE_KEY = 'ai-luna-wishes';

export default function WishesPage() {
  const [, navigate] = useLocation();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [selectedBlessing, setSelectedBlessing] = useState<number | null>(null);
  const [selectedWishForBlessing, setSelectedWishForBlessing] = useState<number | null>(null);
  const [showBlessingModal, setShowBlessingModal] = useState(false);
  const [showEncouragementModal, setShowEncouragementModal] = useState(false);
  const [selectedWishForEncouragement, setSelectedWishForEncouragement] = useState<number | null>(null);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [wishInteractions, setWishInteractions] = useState<Map<number, WishWithInteractions>>(new Map());
  const [userCredit, setUserCredit] = useState(0);

  useEffect(() => {
    // 크레딧 로드
    const credit = getUserCredit();
    setUserCredit(credit.balance);
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      
      const testWishes: Wish[] = [
        {
          id: 1,
          content: '올해 안에 좋은 인연을 만나고 싶습니다. 진심 어린 사랑을 찾고 있어요.',
          category: '연애',
          likes: 5,
          liked: false,
          date: new Date().toISOString().split('T')[0],
          blessings: 3500,
          expiresAt: expiryDate.toISOString(),
        },
        {
          id: 2,
          content: '사업이 잘 되어 경제적 자유를 얻고 싶습니다.',
          category: '재물',
          likes: 8,
          liked: false,
          date: new Date().toISOString().split('T')[0],
          blessings: 2000,
          expiresAt: expiryDate.toISOString(),
        },
        {
          id: 3,
          content: '건강하고 행복한 가족과 함께 오래 살고 싶습니다.',
          category: '건강',
          likes: 12,
          liked: false,
          date: new Date().toISOString().split('T')[0],
          blessings: 1500,
          expiresAt: expiryDate.toISOString(),
        },
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testWishes));
    }
    
    loadWishes();
    setWishInteractions(loadInteractions());
  }, []);

  const loadWishes = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let loadedWishes: Wish[] = stored ? JSON.parse(stored) : [];

      // 데이터가 없으면 초기 데이터 생성
      if (loadedWishes.length === 0) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        
        loadedWishes = [
          {
            id: 1,
            content: '올해 안에 좋은 인연을 만나고 싶습니다. 진심 어린 사랑을 찾고 있어요.',
            category: '연애',
            likes: 5,
            liked: false,
            date: new Date().toISOString().split('T')[0],
            blessings: 3500,
            expiresAt: expiryDate.toISOString(),
          },
          {
            id: 2,
            content: '사업이 잘 되어 경제적 자유를 얻고 싶습니다.',
            category: '재물',
            likes: 8,
            liked: false,
            date: new Date().toISOString().split('T')[0],
            blessings: 2000,
            expiresAt: expiryDate.toISOString(),
          },
          {
            id: 3,
            content: '건강하고 행복한 가족과 함께 오래 살고 싶습니다.',
            category: '건강',
            likes: 12,
            liked: false,
            date: new Date().toISOString().split('T')[0],
            blessings: 1500,
            expiresAt: expiryDate.toISOString(),
          },
        ];
      }

      const now = new Date();
      loadedWishes = loadedWishes.filter((wish) => {
        const expiryDate = new Date(wish.expiresAt);
        return expiryDate > now;
      });

      setWishes(loadedWishes);
      saveWishes(loadedWishes);
    } catch (e) {
      console.error('소원 로드 실패:', e);
      setWishes([]);
    }
  };

  const saveWishes = (wishesToSave: Wish[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishesToSave));
  };

  const handleAddWish = async () => {
    if (!newWish.trim()) return;

    if (selectedBlessing && selectedBlessing > 0) {
      const paymentResult = await processBlessingPayment(selectedBlessing, newWish);
      if (!paymentResult.success) {
        alert(paymentResult.message);
        return;
      }
      // 결제 완료 알림
      setUserCredit(paymentResult.newBalance || 0);
      alert(`✅ 소원 기도가 완료되었습니다!\n동전: ${selectedBlessing}원\n차감 잔앩: ${paymentResult.newBalance}원`);
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const wish: Wish = {
      id: Date.now(),
      content: newWish,
      category: selectedCategory,
      likes: 0,
      liked: false,
      date: new Date().toISOString().split('T')[0],
      blessings: selectedBlessing || 0,
      expiresAt: expiryDate.toISOString(),
    };

    const updatedWishes = [wish, ...wishes];
    setWishes(updatedWishes);
    saveWishes(updatedWishes);
    setNewWish('');
    setSelectedBlessing(null);
  };

  const handleLike = (id: number) => {
    const updatedWishes = wishes.map((w) =>
      w.id === id ? { ...w, liked: !w.liked, likes: w.liked ? w.likes - 1 : w.likes + 1 } : w
    );
    setWishes(updatedWishes);
    saveWishes(updatedWishes);
  };

  const handleAddBlessing = (wishId: number, amount: number) => {
    const updatedWishes = wishes.map((w) =>
      w.id === wishId ? { ...w, blessings: w.blessings + amount } : w
    );
    setWishes(updatedWishes);
    saveWishes(updatedWishes);
    setShowBlessingModal(false);
    setSelectedWishForBlessing(null);
  };

  const handleAddEmpathy = (wishId: number) => {
    const updated = addEmpathy(wishId);
    setWishInteractions(new Map(wishInteractions).set(wishId, updated));
  };

  const handleAddEncouragement = (wishId: number) => {
    if (!encouragementMessage.trim() && Math.random() > 0.5) {
      setEncouragementMessage(ENCOURAGEMENT_TEMPLATES[Math.floor(Math.random() * ENCOURAGEMENT_TEMPLATES.length)]);
    }

    const updated = addEncouragement(wishId, encouragementMessage || undefined);
    setWishInteractions(new Map(wishInteractions).set(wishId, updated));
    setShowEncouragementModal(false);
    setEncouragementMessage('');
    setSelectedWishForEncouragement(null);
  };

  const handleDeleteWish = (id: number) => {
    if (confirm('이 소원을 삭제하시겠습니까?')) {
      const updatedWishes = wishes.filter((w) => w.id !== id);
      setWishes(updatedWishes);
      saveWishes(updatedWishes);
    }
  };

  const categoryEmoji: Record<string, string> = {
    연애: '💕',
    재물: '💰',
    건강: '🏥',
    학업: '📚',
    기타: '✨',
  };

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  const sortedWishes = [...wishes].sort((a, b) => b.blessings - a.blessings);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* Header */}
      <div
        className="px-5 py-4 border-b sticky top-0 z-40 backdrop-blur-md"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290 / 90%) 0%, oklch(0.14 0.04 270 / 90%) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} style={{ color: 'oklch(0.78 0.15 85)' }} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              소원 게시판
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>소원을 빌고 복비로 응원해요</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>MY 동전</p>
            <p className="text-lg font-bold" style={{ color: 'oklch(0.70 0.18 60)' }}>{userCredit.toLocaleString()}원</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Write */}
        <div className="p-5 space-y-3" style={cardStyle}>
          <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
            소원 작성
          </label>
          <textarea
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            placeholder="당신의 소원을 적어보세요..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
            style={{
              background: 'oklch(0.20 0.05 270)',
              color: 'oklch(0.94 0.015 90)',
              border: '1px solid oklch(1 0 0 / 15%)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'oklch(0.55 0.25 290 / 60%)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'oklch(1 0 0 / 15%)'; }}
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  selectedCategory === cat
                    ? { background: 'oklch(0.55 0.25 290)', color: 'oklch(0.97 0.005 90)' }
                    : { background: 'oklch(0.20 0.05 270)', color: 'oklch(0.65 0.02 290)', border: '1px solid oklch(1 0 0 / 10%)' }
                }
              >
                {categoryEmoji[cat]} {cat}
              </button>
            ))}
          </div>
          
          {/* 복비 선택 버튼 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              💝 복비 선택
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 3000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedBlessing(selectedBlessing === amount ? null : amount)}
                  className="py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
                  style={{
                    background: selectedBlessing === amount ? 'oklch(0.55 0.25 290)' : 'oklch(0.25 0.08 290)',
                    color: 'oklch(0.94 0.015 90)',
                    border: selectedBlessing === amount ? '2px solid oklch(0.78 0.15 85)' : '1px solid oklch(1 0 0 / 15%)',
                  }}
                >
                  {amount}원
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleAddWish}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              color: 'oklch(0.97 0.005 90)',
              boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
              fontFamily: "'Noto Serif KR', serif",
            }}
          >
            <Send size={14} />
            소원 올리기
          </button>
        </div>

        {/* Info */}
        <div
          className="p-4 rounded-xl text-xs"
          style={{
            background: 'oklch(0.15 0.05 270)',
            border: '1px solid oklch(0.78 0.15 85 / 20%)',
            color: 'oklch(0.70 0.02 290)',
          }}
        >
          <p className="mb-1">
            💫 <strong>소원 게시판 안내</strong>
          </p>
          <p>• 소원은 한 달간 게시됩니다 (자동 리셋)</p>
          <p>• 복비로 다른 사람의 소원을 응원할 수 있습니다</p>
          <p>• 공감 버튼으로 따뜻한 마음을 전하세요</p>
          <p>• 복비가 높은 소원이 상단에 표시됩니다</p>
        </div>

        {/* List */}
        <div className="space-y-3">
          {sortedWishes.length === 0 ? (
            <div className="p-8 text-center" style={cardStyle}>
              <p className="text-lg mb-2">🙏</p>
              <p style={{ color: 'oklch(0.70 0.02 290)' }}>아직 소원이 없습니다</p>
            </div>
          ) : (
            sortedWishes.map((wish) => {
              const interaction = wishInteractions.get(wish.id) || {
                wishId: wish.id,
                empathyCount: 0,
                encouragementCount: 0,
                interactions: [],
                userEmpathized: false,
                userEncouraged: false,
              };
              const recentEncouragements = getRecentEncouragements(wish.id, 2);

              return (
                <div
                  key={wish.id}
                  className="p-4 rounded-xl transition-all"
                  style={{
                    ...cardStyle,
                    background:
                      wish.blessings > 0
                        ? 'linear-gradient(135deg, oklch(0.20 0.08 290 / 50%), oklch(0.17 0.06 270 / 50%))'
                        : cardStyle.background,
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                        style={{ background: 'oklch(0.55 0.25 290 / 20%)', color: 'oklch(0.78 0.15 85)' }}
                      >
                        {categoryEmoji[wish.category]} {wish.category}
                      </span>
                      {wish.blessings > 0 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                          style={{ background: 'oklch(0.70 0.20 60 / 20%)', color: 'oklch(0.70 0.18 60)' }}
                        >
                          💝 {wish.blessings.toLocaleString()}원
                        </span>
                      )}
                    </div>
                    <span className="text-[11px]" style={{ color: 'oklch(0.50 0.02 290)' }}>
                      {wish.date}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'oklch(0.85 0.015 90)' }}>
                    {wish.content}
                  </p>

                  {/* Recent Encouragements */}
                  {recentEncouragements.length > 0 && (
                    <div className="mb-3 p-2 rounded-lg" style={{ background: 'oklch(0.15 0.04 270)' }}>
                      <p className="text-[11px] font-semibold mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
                        💬 응원 메시지
                      </p>
                      {recentEncouragements.map((enc) => (
                        <p key={enc.id} className="text-[11px] mb-1" style={{ color: 'oklch(0.75 0.015 90)' }}>
                          "{enc.message}"
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(wish.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold transition-all px-2 py-1 rounded-lg"
                        style={{
                          color: wish.liked ? 'oklch(0.65 0.22 15)' : 'oklch(0.55 0.02 290)',
                          background: wish.liked ? 'oklch(0.65 0.22 15 / 15%)' : 'transparent',
                        }}
                      >
                        <Heart size={14} style={{ fill: wish.liked ? 'oklch(0.65 0.22 15)' : 'none' }} />
                        {wish.likes}
                      </button>

                      <button
                        onClick={() => handleAddEmpathy(wish.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold transition-all px-2 py-1 rounded-lg hover:scale-110 active:scale-95"
                        style={{
                          color: interaction.userEmpathized ? 'oklch(0.78 0.15 85)' : 'oklch(0.55 0.02 290)',
                          background: interaction.userEmpathized ? 'oklch(0.78 0.15 85 / 20%)' : 'transparent',
                        }}
                      >
                        <InteractionAnimation type="empathy" />
                        {interaction.empathyCount}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleAddEncouragement(wish.id);
                          setSelectedWishForEncouragement(wish.id);
                          setShowEncouragementModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 hover:scale-110 active:scale-95"
                        style={{
                          background: 'oklch(0.55 0.25 290 / 20%)',
                          color: 'oklch(0.78 0.15 85)',
                          border: '1px solid oklch(0.55 0.25 290 / 30%)',
                        }}
                      >
                        <InteractionAnimation type="encouragement" />
                        응원 ({interaction.encouragementCount})
                      </button>

                      <button
                        onClick={() => {
                          setSelectedWishForBlessing(wish.id);
                          setShowBlessingModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: 'oklch(0.70 0.18 60 / 20%)',
                          color: 'oklch(0.70 0.18 60)',
                          border: '1px solid oklch(0.70 0.18 60 / 30%)',
                        }}
                      >
                        💝 복비
                      </button>

                      <button
                        onClick={() => handleDeleteWish(wish.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                        style={{ color: 'oklch(0.60 0.20 0)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Blessing Modal */}
      {showBlessingModal && selectedWishForBlessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
          <div className="w-full rounded-t-3xl p-6 space-y-4" style={{ background: 'oklch(0.15 0.04 270)' }}>
            <div className="text-center mb-4">
              <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
                복비를 선택하세요
              </p>
              <p className="text-xs mt-1" style={{ color: 'oklch(0.60 0.02 290)' }}>높은 금액순으로 상단에 표시됩니다</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BLESSING_OPTIONS.map((option) => (
                <button
                  key={option.amount}
                  onClick={() => handleAddBlessing(selectedWishForBlessing, option.amount)}
                  className="py-4 rounded-xl font-bold transition-all active:scale-[0.95]"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                    color: 'oklch(1 0 0)',
                    boxShadow: '0 4px 15px oklch(0.55 0.25 290 / 30%)',
                  }}
                >
                  💝 {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowBlessingModal(false);
                setSelectedWishForBlessing(null);
              }}
              className="w-full py-3 rounded-xl font-semibold transition-all"
              style={{
                background: 'oklch(0.20 0.05 270)',
                color: 'oklch(0.70 0.02 290)',
                border: '1px solid oklch(1 0 0 / 15%)',
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Encouragement Modal */}
      {showEncouragementModal && selectedWishForEncouragement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
          <div className="w-full rounded-t-3xl p-6 space-y-4" style={{ background: 'oklch(0.15 0.04 270)' }}>
            <div className="text-center mb-4">
              <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>응원 메시지를 남겨주세요</p>
              <p className="text-xs mt-1" style={{ color: 'oklch(0.60 0.02 290)' }}>따뜻한 말씀이 큰 힘이 됩니다</p>
            </div>

            <textarea
              value={encouragementMessage}
              onChange={(e) => setEncouragementMessage(e.target.value)}
              placeholder="응원 메시지를 입력하세요 (선택사항)..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
              style={{
                background: 'oklch(0.20 0.05 270)',
                color: 'oklch(0.94 0.015 90)',
                border: '1px solid oklch(1 0 0 / 15%)',
              }}
            />

            <div className="grid grid-cols-2 gap-2">
              {ENCOURAGEMENT_TEMPLATES.slice(0, 4).map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => setEncouragementMessage(template)}
                  className="py-2 px-2 rounded-lg text-xs transition-all text-center"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    color: 'oklch(0.78 0.15 85)',
                    border: '1px solid oklch(0.55 0.25 290 / 30%)',
                  }}
                >
                  {template}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAddEncouragement(selectedWishForEncouragement)}
                className="flex-1 py-3 rounded-xl font-bold transition-all active:scale-[0.95]"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                  color: 'oklch(1 0 0)',
                  boxShadow: '0 4px 15px oklch(0.55 0.25 290 / 30%)',
                }}
              >
                응원하기
              </button>

              <button
                onClick={() => {
                  setShowEncouragementModal(false);
                  setEncouragementMessage('');
                  setSelectedWishForEncouragement(null);
                }}
                className="flex-1 py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: 'oklch(0.20 0.05 270)',
                  color: 'oklch(0.70 0.02 290)',
                  border: '1px solid oklch(1 0 0 / 15%)',
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
