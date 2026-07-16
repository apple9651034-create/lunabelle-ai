import React from 'react';
import { useLocation } from 'wouter';
import { Sparkles, Wand2, BookOpen, Compass } from 'lucide-react';

export default function FreeFortuneSelection() {
  const [, navigate] = useLocation();

  const fortuneTypes = [
    {
      id: 'tarot',
      name: '타로',
      description: '카드의 신비로운 메시지로 오늘의 운명을 읽어보세요',
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600',
      emoji: '🔮'
    },
    {
      id: 'iching',
      name: '주역',
      description: '동양의 지혜로 변화의 흐름을 이해하세요',
      icon: BookOpen,
      color: 'from-blue-600 to-cyan-600',
      emoji: '📖'
    },
    {
      id: 'saju',
      name: '사주',
      description: '당신의 사주로 운명의 패턴을 발견하세요',
      icon: Compass,
      color: 'from-amber-600 to-orange-600',
      emoji: '🌟'
    }
  ];

  const handleSelect = (type: string) => {
    navigate(`/fortune/${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              무료 운세
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-light">
            당신의 운명을 알아보는 방식을 선택하세요
          </p>
        </div>

        {/* Fortune Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {fortuneTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleSelect(type.id)}
                className="group relative h-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
                
                <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 h-full flex flex-col items-center text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                  {/* Emoji */}
                  <div className="text-5xl mb-4">{type.emoji}</div>

                  {/* Icon */}
                  <Icon className="w-12 h-12 text-purple-300 mb-4 group-hover:text-pink-300 transition-colors" />

                  {/* Title */}
                  <h3 className="text-2xl font-light text-white mb-3">
                    {type.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 font-light text-sm mb-6 flex-grow">
                    {type.description}
                  </p>

                  {/* Button */}
                  <div className={`px-6 py-2 bg-gradient-to-r ${type.color} text-white rounded-full font-light text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    선택하기
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <Wand2 className="w-8 h-8 text-purple-300 mx-auto mb-4" />
          <p className="text-gray-300 font-light">
            매일 새로운 해석으로 당신의 하루를 밝혀줄 특별한 메시지를 받아보세요.
            <br />
            <span className="text-purple-300 text-sm mt-2 block">
              더 깊은 상담이 필요하신가요? 루나벨과 1:1 상담을 받아보세요.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
