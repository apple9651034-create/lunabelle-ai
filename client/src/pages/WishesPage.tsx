import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Wish {
  id: number;
  author: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  date: string;
  liked: boolean;
}

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: 1,
      author: '사용자A',
      content: '올해 안에 좋은 인연을 만나길 바랍니다. 🌙',
      category: '연애',
      likes: 24,
      comments: 5,
      date: '2024-06-23',
      liked: false,
    },
    {
      id: 2,
      author: '사용자B',
      content: '새로운 일자리에서 성공하기를 바랍니다!',
      category: '직업',
      likes: 18,
      comments: 3,
      date: '2024-06-22',
      liked: false,
    },
    {
      id: 3,
      author: '사용자C',
      content: '건강하고 행복한 한 해가 되길 소원합니다. ✨',
      category: '건강',
      likes: 32,
      comments: 8,
      date: '2024-06-21',
      liked: false,
    },
  ]);

  const [newWish, setNewWish] = useState('');
  const [category, setCategory] = useState('일반');

  const handleAddWish = () => {
    if (newWish.trim()) {
      const wish: Wish = {
        id: wishes.length + 1,
        author: '나',
        content: newWish,
        category,
        likes: 0,
        comments: 0,
        date: new Date().toISOString().split('T')[0],
        liked: false,
      };
      setWishes([wish, ...wishes]);
      setNewWish('');
    }
  };

  const handleLike = (id: number) => {
    setWishes(
      wishes.map((wish) =>
        wish.id === id
          ? {
              ...wish,
              likes: wish.liked ? wish.likes - 1 : wish.likes + 1,
              liked: !wish.liked,
            }
          : wish
      )
    );
  };

  const categories = ['일반', '연애', '직업', '건강', '학업', '재물'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">💝 소원 게시판</h1>
        <p className="text-pink-100 mt-2">다른 사용자들과 소원을 공유해보세요</p>
      </div>

      {/* New Wish Form */}
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">소원을 작성해보세요</h3>
          <div className="space-y-4">
            <textarea
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              placeholder="당신의 소원을 적어주세요..."
              className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              rows={3}
            />
            <div className="flex gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleAddWish}
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white"
              >
                소원 작성
              </Button>
            </div>
          </div>
        </div>

        {/* Wishes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">모든 소원</h3>
          {wishes.map((wish) => (
            <div key={wish.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{wish.author}</p>
                  <p className="text-sm text-slate-500">{wish.date}</p>
                </div>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                  {wish.category}
                </span>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">{wish.content}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleLike(wish.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    wish.liked ? 'text-pink-600' : 'text-slate-600 hover:text-pink-600'
                  }`}
                >
                  <Heart size={18} fill={wish.liked ? 'currentColor' : 'none'} />
                  <span className="text-sm font-medium">{wish.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">{wish.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors ml-auto">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
