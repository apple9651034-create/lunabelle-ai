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
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="flex justify-around items-center h-20 max-w-4xl mx-auto w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
