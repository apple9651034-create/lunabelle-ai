import React from 'react';
import { useLocation } from 'wouter';
import { MessageCircle, Wand2, Calendar, ShoppingBag, Heart } from 'lucide-react';

export default function HomePage() {
  const [, navigate] = useLocation();

  const services = [
    {
      path: '/chat',
      icon: MessageCircle,
      title: '🌙 AI 루나 채팅',
      description: '실시간으로 AI 루나와 대화하며 당신의 운명을 알아보세요',
      color: 'from-purple-500 to-purple-600',
    },
    {
      path: '/yuk',
      icon: Wand2,
      title: '☯️ 육효 점술',
      description: '변화의 흐름을 육효로 분석하고 조언을 얻어보세요',
      color: 'from-blue-500 to-blue-600',
    },
    {
      path: '/saju',
      icon: Calendar,
      title: '🌙 사주 분석',
      description: '생년월일로 당신의 운명과 성격을 분석해보세요',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      path: '/shop',
      icon: ShoppingBag,
      title: '🛍️ 부적 상점',
      description: '영적 보호와 행운을 위한 다양한 부적을 만나보세요',
      color: 'from-amber-500 to-amber-600',
    },
    {
      path: '/wishes',
      icon: Heart,
      title: '💝 소원 게시판',
      description: '다른 사용자들과 소원을 공유하고 응원해보세요',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">🌙 AI 루나</h1>
        <p className="text-purple-100 mt-2">당신의 운명을 예측해 보세요</p>
      </div>

      {/* Welcome Section */}
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">안녕하세요! 👋</h2>
          <p className="text-slate-600 leading-relaxed">
            AI 루나는 타로, 사주, 육효를 통해 당신의 운명을 예측해주는 신비로운 앱입니다.
            아래의 서비스들을 통해 당신의 미래를 알아보세요.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">우리의 서비스</h3>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.path}
                onClick={() => navigate(service.path)}
                className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 text-left group"
              >
                <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${service.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{service.title}</h4>
                <p className="text-sm text-slate-600">{service.description}</p>
              </button>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">AI 루나의 특징</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-semibold text-slate-900">정확한 해석</p>
                <p className="text-sm text-slate-600">전통 지식과 현대적 관점을 결합</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold text-slate-900">맞춤형 상담</p>
                <p className="text-sm text-slate-600">당신의 상황에 맞는 개인화된 상담</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-slate-900">상담 기록 관리</p>
                <p className="text-sm text-slate-600">모든 상담 기록을 저장하고 분석</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <p className="font-semibold text-slate-900">커뮤니티</p>
                <p className="text-sm text-slate-600">다른 사용자들과 경험 공유</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
