import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, History, Heart, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';
// 불필요한 임포트 제거됨

export default function MyPageDashboard() {
  const [, navigate] = useLocation();
  const [consultationHistory, setConsultationHistory] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);
  const [creditBalance, setCreditBalance] = useState(10000);

  // 상담 내역 로드
  useEffect(() => {
    const saved = localStorage.getItem('consultationHistory');
    if (saved) {
      try {
        setConsultationHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load consultation history:', e);
      }
    }
  }, []);

  // 소원 로드
  useEffect(() => {
    const saved = localStorage.getItem('wishes');
    if (saved) {
      try {
        setWishes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load wishes:', e);
      }
    }
  }, []);

  // 크레딧 잔액 로드
  useEffect(() => {
    const saved = localStorage.getItem('userCredit');
    if (saved) {
      setCreditBalance(parseInt(saved));
    }
  }, []);

  const totalWishBlessings = wishes.reduce((sum, wish) => sum + (wish.blessing || 0), 0);
  const totalWishes = wishes.length;
  const totalConsultations = consultationHistory.length;

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.02 270)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b" style={{
        background: 'oklch(0.12 0.03 270 / 80%)',
        borderColor: 'oklch(1 0 0 / 8%)',
      }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} style={{ color: 'oklch(0.94 0.015 90)' }} />
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            마이페이지
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Credit Balance Card */}
        <div className="mb-8 p-8 rounded-2xl border" style={{
          background: 'linear-gradient(135deg, oklch(0.20 0.08 270) 0%, oklch(0.15 0.05 270) 100%)',
          borderColor: 'oklch(0.70 0.18 60)',
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'oklch(0.78 0.15 85)' }}>현재 보유 크레딧</p>
              <h2 className="text-4xl font-bold mt-2" style={{ color: 'oklch(0.70 0.18 60)' }}>
                {creditBalance.toLocaleString()}
              </h2>
              <p className="text-xs mt-2" style={{ color: 'oklch(0.78 0.15 85)' }}>1 크레딧 = 1회 상담</p>
            </div>
            <Wallet size={48} style={{ color: 'oklch(0.70 0.18 60)' }} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Total Consultations */}
          <div className="p-6 rounded-xl border" style={{
            background: 'oklch(0.15 0.05 270)',
            borderColor: 'oklch(0.78 0.15 85 / 20%)',
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>총 상담 횟수</p>
                <p className="text-2xl font-bold mt-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  {totalConsultations}회
                </p>
              </div>
              <History size={32} style={{ color: 'oklch(0.70 0.18 60)' }} />
            </div>
          </div>

          {/* Total Wishes */}
          <div className="p-6 rounded-xl border" style={{
            background: 'oklch(0.15 0.05 270)',
            borderColor: 'oklch(0.78 0.15 85 / 20%)',
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>올린 소원</p>
                <p className="text-2xl font-bold mt-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  {totalWishes}개
                </p>
              </div>
              <Heart size={32} style={{ color: 'oklch(0.70 0.18 60)' }} />
            </div>
          </div>

          {/* Total Blessings */}
          <div className="p-6 rounded-xl border" style={{
            background: 'oklch(0.15 0.05 270)',
            borderColor: 'oklch(0.78 0.15 85 / 20%)',
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>총 복비</p>
                <p className="text-2xl font-bold mt-2" style={{ color: 'oklch(0.94 0.015 90)' }}>
                  ₩{totalWishBlessings.toLocaleString()}
                </p>
              </div>
              <TrendingUp size={32} style={{ color: 'oklch(0.70 0.18 60)' }} />
            </div>
          </div>
        </div>

        {/* Consultation History */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6" style={{ color: 'oklch(0.94 0.015 90)' }}>
            📋 상담 내역
          </h3>
          {consultationHistory.length === 0 ? (
            <div className="p-8 rounded-xl text-center" style={{
              background: 'oklch(0.15 0.05 270)',
              borderColor: 'oklch(0.78 0.15 85 / 20%)',
              border: '1px solid',
            }}>
              <p style={{ color: 'oklch(0.78 0.15 85)' }}>상담 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {consultationHistory.slice(0, 5).map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border" style={{
                  background: 'oklch(0.15 0.05 270)',
                  borderColor: 'oklch(0.78 0.15 85 / 20%)',
                }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                        {item.type === 'saju' ? '🔮 사주' : item.type === 'tarot' ? '🃏 타로' : '☯️ 육효'} 상담
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
                        {new Date(item.timestamp).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full" style={{
                      background: 'oklch(0.70 0.18 60 / 20%)',
                      color: 'oklch(0.70 0.18 60)',
                    }}>
                      {item.creditUsed}크레딧
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Wishes */}
        <div>
          <h3 className="text-xl font-bold mb-6" style={{ color: 'oklch(0.94 0.015 90)' }}>
            💝 최근 올린 소원
          </h3>
          {wishes.length === 0 ? (
            <div className="p-8 rounded-xl text-center" style={{
              background: 'oklch(0.15 0.05 270)',
              borderColor: 'oklch(0.78 0.15 85 / 20%)',
              border: '1px solid',
            }}>
              <p style={{ color: 'oklch(0.78 0.15 85)' }}>올린 소원이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishes.slice(0, 5).map((wish, idx) => (
                <div key={idx} className="p-4 rounded-lg border" style={{
                  background: 'oklch(0.15 0.05 270)',
                  borderColor: 'oklch(0.78 0.15 85 / 20%)',
                }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                        {wish.text}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
                        {wish.category} • {new Date(wish.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full" style={{
                      background: 'oklch(0.70 0.18 60 / 20%)',
                      color: 'oklch(0.70 0.18 60)',
                    }}>
                      💝 {wish.blessing}원
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
