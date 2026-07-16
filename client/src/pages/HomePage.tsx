/**
 * HomePage.tsx - 출시용 완전 리디자인
 * Design: 고급스러운 타로 브랜드 - 보라색, 달빛, 유리 느낌
 * 목표: 사용자가 "상담을 받고 싶다"는 감정을 느끼게 만들기
 */
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, Star } from 'lucide-react';

export default function HomePage() {
  const [, navigate] = useLocation();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const reviews = [
    {
      rating: 5,
      text: "정말 신기하게도 제 상황을 정확하게 맞춰주셨어요. 앞으로의 방향을 알 수 있어서 감사합니다.",
      author: "김민지 님"
    },
    {
      rating: 5,
      text: "타로 카드 해석이 너무 깊고 의미 있었습니다. 다시 한 번 상담받고 싶어요.",
      author: "이준호 님"
    },
    {
      rating: 5,
      text: "사주 분석이 정말 정확했어요. 제 성격과 운명에 대해 새로운 이해를 얻었습니다.",
      author: "박수진 님"
    }
  ];

  const handlePrevReview = () => {
    setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background blur effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-light mb-4">
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                루나벨
              </span>
            </h1>
            <p className="text-3xl md:text-4xl font-light text-purple-200 mb-2">
              타로살롱
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-12 leading-relaxed">
            오늘 당신에게 필요한 답을 만나보세요.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/chat')}
            className="group relative mb-8 px-12 py-4 text-lg font-light text-white rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/50"></div>
            <span className="relative flex items-center justify-center gap-2">
              AI 상담 시작하기
              <ChevronRight className="w-5 h-5" />
            </span>
          </button>

          {/* Secondary text */}
          <p className="text-gray-400 font-light">
            타로 • 사주 • 주역 - 당신의 운명을 지금 만나보세요
          </p>
        </div>
      </section>

      {/* Today's Free Reading */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 hover:bg-white/10 transition-all duration-300 cursor-pointer"
             onClick={() => navigate('/fortune/tarot')}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">🔮</span>
            <h2 className="text-2xl font-light text-purple-200">오늘의 운세</h2>
          </div>
          <p className="text-gray-300 font-light mb-6">
            무료로 오늘의 운세를 받아보세요. 당신의 하루를 밝혀줄 특별한 메시지가 기다리고 있습니다.
          </p>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
            타로 무료 운세 보기
          </button>
        </div>
      </section>

      {/* Quick Consultation */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-light text-center mb-12 text-purple-200">빠른 상담</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🔮', title: '타로 상담', desc: '카드가 전하는 메시지를 들어보세요' },
            { icon: '☯', title: '주역 상담', desc: '변화의 흐름을 읽어보세요' },
            { icon: '🌿', title: '사주 상담', desc: '당신의 운명을 분석해보세요' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate('/chat')}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left group"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-light text-purple-200 mb-2 group-hover:text-pink-300 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-400 font-light">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Talismans */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-light text-center mb-12 text-purple-200">인기 부적</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: '재회', emoji: '💕' },
            { title: '금전', emoji: '💰' },
            { title: '합격', emoji: '📚' },
            { title: '건강', emoji: '🌿' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate('/talisman-shop')}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-center group"
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <p className="text-lg font-light text-purple-200 group-hover:text-pink-300 transition-colors">{item.title}</p>
            </button>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate('/talisman-shop')}
            className="px-6 py-2 border border-purple-400 text-purple-300 rounded-full font-light hover:bg-purple-400/10 transition-all duration-300"
          >
            전체보기
          </button>
        </div>
      </section>

      {/* Wish Prayer Board */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-light text-center mb-12 text-purple-200">소원기도 게시판</h2>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-lg font-light text-purple-300 mb-6">최근 등록된 소원</h3>
            <div className="space-y-4">
              {[
                '새로운 일자리를 찾을 수 있기를...',
                '사랑하는 사람과 다시 만날 수 있기를...',
                '시험에 합격할 수 있기를...'
              ].map((wish, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-gray-300 font-light">{wish}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/wishes')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              기도 참여하기
            </button>
            <button
              onClick={() => navigate('/wishes')}
              className="px-6 py-2 border border-purple-400 text-purple-300 rounded-full font-light hover:bg-purple-400/10 transition-all duration-300"
            >
              게시판 바로가기
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-light text-center mb-12 text-purple-200">실제 상담 후기</h2>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(reviews[currentReviewIndex].rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-center text-gray-300 font-light text-lg mb-6 min-h-20">
            "{reviews[currentReviewIndex].text}"
          </p>
          <p className="text-center text-purple-300 font-light mb-8">
            - {reviews[currentReviewIndex].author}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePrevReview}
              className="px-4 py-2 border border-purple-400 text-purple-300 rounded-full hover:bg-purple-400/10 transition-all duration-300"
            >
              ← 이전
            </button>
            <button
              onClick={handleNextReview}
              className="px-4 py-2 border border-purple-400 text-purple-300 rounded-full hover:bg-purple-400/10 transition-all duration-300"
            >
              다음 →
            </button>
          </div>
        </div>
      </section>

      {/* 루나벨과 바로 상담하기 */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <div className="backdrop-blur-md bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-purple-200 mb-4">💜 루나벨과 바로 상담하기</h2>
            <p className="text-gray-300 font-light">
              AI 상담으로 부족하셨나요?<br />
              루나벨과 직접 1:1 상담을 받아보세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 20분 상담 */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-xl font-light text-purple-300 mb-2">20분 상담</h3>
              <p className="text-3xl font-light text-purple-200 mb-4">22,000원</p>
              <p className="text-sm text-gray-400 font-light mb-6">(부가세 포함)</p>
              <button
                onClick={() => navigate('/consultation/20')}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                상담 신청하기
              </button>
            </div>
            
            {/* 50분 상담 */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-xl font-light text-purple-300 mb-2">50분 상담</h3>
              <p className="text-3xl font-light text-purple-200 mb-4">55,000원</p>
              <p className="text-sm text-gray-400 font-light mb-6">(부가세 포함)</p>
              <button
                onClick={() => navigate('/consultation/50')}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                상담 신청하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-light text-purple-200 mb-4">프리미엄 멤버십</h2>
          <p className="text-gray-300 font-light mb-8">
            더 많은 상담 기회와 특별한 혜택을 누려보세요.
          </p>
          <button
            onClick={() => navigate('/my')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-light hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            자세히 보기
          </button>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  );
}
