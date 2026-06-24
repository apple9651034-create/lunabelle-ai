/* AI 루나 — AppLayout
 * Design: Mystic Dark Luxury — bottom navigation with gold active state
 */
import React from 'react';
import { useLocation } from 'wouter';
import { Home, MessageCircle, Wand2, Calendar, ShoppingBag, Heart, User, HelpCircle } from 'lucide-react';

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

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'oklch(0.12 0.03 270)' }}
    >
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
