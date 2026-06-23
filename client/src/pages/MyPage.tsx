import React, { useState } from 'react';
import { Settings, LogOut, History, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MyPage() {
  const [user] = useState({
    name: '사용자',
    email: 'user@example.com',
    joinDate: '2024년 6월',
    consultations: 12,
  });

  const consultationHistory = [
    { id: 1, type: '채팅', date: '2024-06-23', topic: '연애운' },
    { id: 2, type: '사주', date: '2024-06-22', topic: '사주 분석' },
    { id: 3, type: '육효', date: '2024-06-21', topic: '육효 점술' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">마이페이지</h1>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-600">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">가입일</p>
              <p className="text-lg font-bold text-purple-600">{user.joinDate}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">상담 횟수</p>
              <p className="text-lg font-bold text-purple-600">{user.consultations}회</p>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">설정</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg transition-colors">
              <Bell size={20} className="text-purple-600" />
              <span className="font-medium text-slate-900">알림 설정</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg transition-colors">
              <Settings size={20} className="text-purple-600" />
              <span className="font-medium text-slate-900">계정 설정</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg transition-colors">
              <LogOut size={20} className="text-red-600" />
              <span className="font-medium text-red-600">로그아웃</span>
            </button>
          </div>
        </div>

        {/* Consultation History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-purple-600" />
            <h3 className="text-lg font-bold text-slate-900">최근 상담 기록</h3>
          </div>
          <div className="space-y-3">
            {consultationHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{item.topic}</p>
                  <p className="text-sm text-slate-600">{item.type}</p>
                </div>
                <p className="text-sm text-slate-500">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
