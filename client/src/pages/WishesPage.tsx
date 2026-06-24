/* AI 루나 — WishesPage
 * Design: Mystic Dark Luxury
 */
import React, { useState } from 'react';
import { Heart, Send } from 'lucide-react';

interface Wish {
  id: number;
  content: string;
  category: string;
  likes: number;
  liked: boolean;
  date: string;
}

const CATEGORIES = ['연애', '재물', '건강', '학업', '기타'];

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([
    { id: 1, content: '올해 꼭 좋은 인연을 만나게 해주세요. 진심으로 사랑할 수 있는 사람을 만나고 싶습니다.', category: '연애', likes: 24, liked: false, date: '2026-06-20' },
    { id: 2, content: '사업이 잘 되어서 가족들과 행복하게 살 수 있으면 좋겠습니다. 열심히 하겠습니다!', category: '재물', likes: 18, liked: false, date: '2026-06-21' },
    { id: 3, content: '건강하게 오래오래 살고 싶습니다. 가족 모두 건강하길 바랍니다.', category: '건강', likes: 31, liked: false, date: '2026-06-22' },
  ]);
  const [newWish, setNewWish] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('기타');

  const handleAddWish = () => {
    if (!newWish.trim()) return;
    const wish: Wish = {
      id: Date.now(),
      content: newWish,
      category: selectedCategory,
      likes: 0,
      liked: false,
      date: new Date().toISOString().split('T')[0],
    };
    setWishes((prev) => [wish, ...prev]);
    setNewWish('');
  };

  const handleLike = (id: number) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, liked: !w.liked, likes: w.liked ? w.likes - 1 : w.likes + 1 } : w
      )
    );
  };

  const categoryEmoji: Record<string, string> = {
    연애: '💕', 재물: '💰', 건강: '🏥', 학업: '📚', 기타: '✨',
  };

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">💫</span>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              소원 게시판
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>소원을 빌고 서로 응원해요</p>
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

        {/* List */}
        <div className="space-y-3">
          {wishes.map((wish) => (
            <div key={wish.id} className="p-4" style={cardStyle}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: 'oklch(0.55 0.25 290 / 20%)', color: 'oklch(0.78 0.15 85)' }}
                >
                  {categoryEmoji[wish.category]} {wish.category}
                </span>
                <span className="text-[11px]" style={{ color: 'oklch(0.50 0.02 290)' }}>{wish.date}</span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'oklch(0.85 0.015 90)' }}>
                {wish.content}
              </p>
              <button
                onClick={() => handleLike(wish.id)}
                className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                style={{ color: wish.liked ? 'oklch(0.65 0.22 15)' : 'oklch(0.55 0.02 290)' }}
              >
                <Heart
                  size={14}
                  style={{ fill: wish.liked ? 'oklch(0.65 0.22 15)' : 'none' }}
                />
                {wish.likes}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
