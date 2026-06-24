/* AI 루나 — SajuPage
 * Design: Mystic Dark Luxury
 */
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SajuResult {
  personality: string;
  luck: string;
  love: number;
  wealth: number;
  health: number;
  career: number;
}

export default function SajuPage() {
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const birthDate = birthYear && birthMonth && birthDay ? `${birthYear}-${birthMonth}-${birthDay}` : '';
  const [gender, setGender] = useState('');
  const [result, setResult] = useState<SajuResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const years = Array.from({ length: 80 }, (_, i) => String(2010 - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const selectStyle = {
    background: 'oklch(0.20 0.05 270)',
    color: 'oklch(0.94 0.015 90)',
    border: '1px solid oklch(1 0 0 / 15%)',
  };

  const handleAnalyzeSaju = () => {
    if (!birthDate || !gender) {
      alert('생년월일과 성별을 모두 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setResult({
        personality: '당신은 강한 의지와 창의적인 사고를 가진 사람입니다. 리더십이 뛰어나며 주변 사람들에게 긍정적인 영향을 미칩니다.',
        luck: '올해는 변화와 성장의 해입니다. 새로운 기회가 찾아올 것이며, 이를 잘 활용하면 큰 성공을 거둘 수 있습니다.',
        love: 75,
        wealth: 82,
        health: 68,
        career: 90,
      });
      setIsLoading(false);
    }, 1500);
  };

  const barColor = (val: number) =>
    val >= 80
      ? 'oklch(0.78 0.15 85)'
      : val >= 60
      ? 'oklch(0.55 0.25 290)'
      : 'oklch(0.50 0.22 250)';

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
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔮</span>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              사주 분석
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>생년월일로 운명을 분석합니다</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Input Form */}
        <div className="p-5 space-y-4" style={cardStyle}>
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              생년월일
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center"
                style={selectStyle}
              >
                <option value="">년도</option>
                {years.map((y) => <option key={y} value={y}>{y}년</option>)}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center"
                style={selectStyle}
              >
                <option value="">월</option>
                {months.map((m) => <option key={m} value={m}>{parseInt(m)}월</option>)}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center"
                style={selectStyle}
              >
                <option value="">일</option>
                {days.map((d) => <option key={d} value={d}>{parseInt(d)}일</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              성별
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['남성', '여성'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className="py-3 rounded-xl text-sm font-semibold transition-all"
                  style={
                    gender === g
                      ? {
                          background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                          color: 'oklch(0.97 0.005 90)',
                        }
                      : {
                          background: 'oklch(0.20 0.05 270)',
                          color: 'oklch(0.70 0.02 290)',
                          border: '1px solid oklch(1 0 0 / 10%)',
                        }
                  }
                >
                  {g === '남성' ? '👨 남성' : '👩 여성'}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAnalyzeSaju}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              color: 'oklch(0.97 0.005 90)',
              boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
              fontFamily: "'Noto Serif KR', serif",
            }}
          >
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> 분석 중...</> : '🔮 사주 분석하기'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-3">
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>성격 분석</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.015 90)' }}>{result.personality}</p>
            </div>
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>올해의 운세</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.015 90)' }}>{result.luck}</p>
            </div>
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>운세 지수</h3>
              <div className="space-y-3">
                {[
                  { label: '💕 연애운', value: result.love },
                  { label: '💰 재물운', value: result.wealth },
                  { label: '🏥 건강운', value: result.health },
                  { label: '💼 직업운', value: result.career },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: 'oklch(0.85 0.015 90)' }}>{label}</span>
                      <span className="font-bold" style={{ color: barColor(value) }}>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'oklch(0.22 0.05 270)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${value}%`, background: barColor(value) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
