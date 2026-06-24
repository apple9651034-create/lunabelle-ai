/* AI 루나 — MyPage
 * Design: Mystic Dark Luxury
 */
import React, { useState } from 'react';
import { User, Settings, Bell, Shield, ChevronRight } from 'lucide-react';

export default function MyPage() {
  const [userInfo] = useState({
    name: '루나 사용자',
    email: 'user@example.com',
    joinDate: '2026-01-15',
  });

  const consultHistory = [
    { id: 1, type: '타로', date: '2026-06-22', result: '연애운 상승' },
    { id: 2, type: '사주', date: '2026-06-20', result: '재물운 긍정적' },
    { id: 3, type: '육효', date: '2026-06-18', result: '건강 주의 필요' },
  ];

  const menuItems = [
    { icon: Settings, label: '계정 설정', desc: '프로필 및 계정 관리' },
    { icon: Bell, label: '알림 설정', desc: '푸시 알림 및 이메일 설정' },
    { icon: Shield, label: '개인정보 보호', desc: '데이터 및 프라이버시 설정' },
  ];

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
        <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
          마이페이지
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile */}
        <div className="p-5 flex items-center gap-4" style={{ ...cardStyle, borderColor: 'oklch(0.78 0.15 85 / 20%)' }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              boxShadow: '0 0 20px oklch(0.55 0.25 290 / 40%)',
            }}
          >
            <User size={28} color="oklch(0.97 0.005 90)" />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              {userInfo.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'oklch(0.60 0.02 290)' }}>{userInfo.email}</p>
            <p className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.02 290)' }}>가입일: {userInfo.joinDate}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="overflow-hidden" style={cardStyle}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all"
                style={{
                  borderBottom: i < menuItems.length - 1 ? '1px solid oklch(1 0 0 / 8%)' : 'none',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'oklch(0.20 0.05 270)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'oklch(0.55 0.25 290 / 20%)' }}
                >
                  <Icon size={18} style={{ color: 'oklch(0.78 0.15 85)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>{item.label}</p>
                  <p className="text-xs" style={{ color: 'oklch(0.55 0.02 290)' }}>{item.desc}</p>
                </div>
                <ChevronRight size={16} style={{ color: 'oklch(0.45 0.02 290)' }} />
              </button>
            );
          })}
        </div>

        {/* History */}
        <div className="p-5" style={cardStyle}>
          <h3 className="text-sm font-bold mb-4 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
            최근 상담 내역
          </h3>
          <div className="space-y-3">
            {consultHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2"
                style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: 'oklch(0.55 0.25 290 / 20%)' }}
                >
                  {item.type === '타로' ? '🃏' : item.type === '사주' ? '🔮' : '☯️'}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>{item.type} 상담</p>
                  <p className="text-[11px]" style={{ color: 'oklch(0.55 0.02 290)' }}>{item.date}</p>
                </div>
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background: 'oklch(0.78 0.15 85 / 15%)', color: 'oklch(0.78 0.15 85)' }}
                >
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
