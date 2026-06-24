/* AI 루나 — AppLayout
 * Design: Mystic Dark Luxury — bottom navigation with gold active state
 * 모든 서브 페이지에 뒤로가기 화살표 표시
 */
import React from 'react';
import { useLocation } from 'wouter';
import { Home, MessageCircle, Wand2, Calendar, ShoppingBag, Heart, User, HelpCircle, ArrowLeft } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location, navigate] = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/chat', icon: MessageCircle, label: '채팅' },
    { path: '/yuk', icon: Wand2, label: '육효' },
    { path: '/saju', icon: Calendar, label: '사주' },
    { path: '/shop', icon: ShoppingBag, label: '부적' },
    { path: '/wishes', icon: Heart, label: '소원' },
    { path: '/mypage', icon: User, label: '마이' },
    { path: '/support', icon: HelpCircle, label: '지원' },
  ];

  const isHome = location === '/';

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'oklch(0.12 0.03 270)' }}
    >
      {/* Top Back Button (서브 페이지에서만 표시) */}
      {!isHome && (
        <div
          className="flex items-center px-4 py-3 border-b"
          style={{
            background: 'oklch(0.10 0.03 270)',
            borderColor: 'oklch(1 0 0 / 8%)',
          }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 py-1 px-2 rounded-lg transition-all active:scale-95"
            style={{ color: 'oklch(0.78 0.15 85)' }}
          >
            <ArrowLeft size={20} strokeWidth={2} />
            <span className="text-sm font-medium" style={{ color: 'oklch(0.80 0.02 90)' }}>뒤로</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 border-t shadow-2xl"
        style={{
          background: 'oklch(0.10 0.03 270)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div className="flex justify-around items-center h-[4.5rem] max-w-2xl mx-auto w-full px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-150"
                style={
                  isActive
                    ? {
                        color: 'oklch(0.78 0.15 85)',
                        background: 'oklch(0.55 0.25 290 / 15%)',
                      }
                    : {
                        color: 'oklch(0.60 0.02 290)',
                      }
                }
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
