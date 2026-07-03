/* 월간 운세 달력 페이지
 * 이번달의 길일/흉일을 직관적으로 표시
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { generateMonthlyFortune, getWeekdayName, getFortuneColor, getFortuneEmoji } from '@/lib/monthlyFortuneCalendar';

export default function MonthlyFortuneCalendar() {
  const [, setLocation] = useLocation();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthlyFortune = generateMonthlyFortune(currentYear, currentMonth);
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('ko-KR', { month: 'long' });

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.14 0.05 270)' }}>
      {/* 헤더 */}
      <div className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'oklch(0.14 0.05 270 / 80%)', borderBottom: '1px solid oklch(1 0 0 / 10%)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation('/')}
            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
            style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.85 0.015 90)' }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'oklch(0.85 0.015 90)' }}>
            월간 운세 달력
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-xl" style={{ background: 'oklch(0.17 0.04 270)', border: '1px solid oklch(1 0 0 / 10%)' }}>
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
            style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.85 0.015 90)' }}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold" style={{ color: 'oklch(0.85 0.015 90)' }}>
            {currentYear}년 {currentMonth}월
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
            style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.85 0.015 90)' }}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div
              key={day}
              className="text-center py-2 text-sm font-semibold rounded-lg"
              style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.70 0.02 290)' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className="grid grid-cols-7 gap-2">
          {monthlyFortune.map((day, idx) => {
            const isCurrentMonth = idx >= 7 && idx < 7 + daysInMonth;
            const isToday = isCurrentMonth && day.date === today.getDate() && currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();

            return (
              <div
                key={idx}
                className={`aspect-square p-2 rounded-lg flex flex-col items-center justify-center text-center transition-all ${
                  isCurrentMonth ? 'cursor-pointer hover:scale-105' : 'opacity-30'
                } ${isToday ? 'ring-2' : ''}`}
                style={{
                  background: getFortuneColor(day.fortuneType),
                  color: 'oklch(1 0 0)',
                }}
              >
                <div className="text-xs font-bold">{day.date}</div>
                <div className="text-lg">{getFortuneEmoji(day.fortuneType)}</div>
                {isCurrentMonth && day.fortuneType !== 'neutral' && (
                  <div className="text-xs opacity-70 leading-tight">
                    {day.luckyColor && <div>{day.luckyColor}</div>}
                    {day.luckyNumber && <div>#{day.luckyNumber}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="mt-8 p-4 rounded-xl" style={{ background: 'oklch(0.17 0.04 270)', border: '1px solid oklch(1 0 0 / 10%)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'oklch(0.85 0.015 90)' }}>
            범례
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ background: getFortuneColor('lucky') }} />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>길일 - 좋은 일을 시작하기 좋은 날</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ background: getFortuneColor('neutral') }} />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>평일 - 보통의 날</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ background: getFortuneColor('unlucky') }} />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>흉일 - 신중한 행동이 필요한 날</span>
            </div>
          </div>
        </div>

        {/* 길일 상세 정보 */}
        <div className="mt-6 p-4 rounded-xl" style={{ background: 'oklch(0.17 0.04 270)', border: '1px solid oklch(1 0 0 / 10%)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'oklch(0.85 0.015 90)' }}>
            이번달 길일
          </h3>
          <div className="space-y-2">
            {monthlyFortune
              .filter((day, idx) => idx >= 7 && idx < 7 + daysInMonth && day.fortuneType === 'lucky')
              .map((day) => (
                <div key={day.date} className="text-xs p-2 rounded" style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.85 0.015 90)' }}>
                  <div className="font-semibold">{day.date}일 ({getWeekdayName(day.dayOfWeek)})</div>
                  <div style={{ color: 'oklch(0.70 0.02 290)' }}>{day.description}</div>
                  {day.luckyColor && <div style={{ color: 'oklch(0.70 0.02 290)' }}>행운의 색: {day.luckyColor}</div>}
                  {day.luckyNumber && <div style={{ color: 'oklch(0.70 0.02 290)' }}>행운의 숫자: {day.luckyNumber}</div>}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
