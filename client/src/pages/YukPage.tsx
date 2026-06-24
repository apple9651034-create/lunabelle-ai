/* AI 루나 — YukPage
 * Design: Mystic Dark Luxury
 */
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface YukResult {
  symbol: string;
  meaning: string;
  advice: string;
}

const yukSymbols = [
  { symbol: '━━━', meaning: '양효 (陽爻)', advice: '강한 양기가 흐릅니다. 적극적으로 행동하세요.' },
  { symbol: '━ ━', meaning: '음효 (陰爻)', advice: '음기가 강합니다. 신중하게 판단하세요.' },
  { symbol: '☰', meaning: '건 (乾)', advice: '하늘의 기운이 강합니다. 창조적 에너지를 활용하세요.' },
  { symbol: '☷', meaning: '곤 (坤)', advice: '땅의 기운이 강합니다. 포용력을 발휘하세요.' },
  { symbol: '☵', meaning: '감 (坎)', advice: '물의 흐름처럼 유연하게 대처하세요.' },
  { symbol: '☲', meaning: '리 (離)', advice: '불의 기운이 강합니다. 열정을 유지하세요.' },
];

export default function YukPage() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<YukResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrawYuk = () => {
    if (!question.trim()) {
      alert('질문을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const drawn = Array.from({ length: 6 }, () => yukSymbols[Math.floor(Math.random() * yukSymbols.length)]);
      setResults(drawn);
      setIsLoading(false);
    }, 1200);
  };

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
          <span className="text-2xl">☯️</span>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              육효 점술
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>변화의 흐름을 읽습니다</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <div className="p-5 space-y-4" style={cardStyle}>
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              질문을 입력하세요
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="예: 이번 사업이 성공할까요?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
              style={{
                background: 'oklch(0.20 0.05 270)',
                color: 'oklch(0.94 0.015 90)',
                border: '1px solid oklch(1 0 0 / 15%)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'oklch(0.55 0.25 290 / 60%)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'oklch(1 0 0 / 15%)'; }}
            />
          </div>
          <button
            onClick={handleDrawYuk}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              color: 'oklch(0.97 0.005 90)',
              boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
              fontFamily: "'Noto Serif KR', serif",
            }}
          >
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> 점괘를 뽑는 중...</> : '☯️ 육효 점치기'}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                뽑힌 효 (爻)
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="text-center py-3 px-2 rounded-xl"
                    style={{
                      background: 'oklch(0.20 0.05 270)',
                      border: '1px solid oklch(0.55 0.25 290 / 20%)',
                    }}
                  >
                    <div className="text-xl mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>{r.symbol}</div>
                    <div className="text-[10px]" style={{ color: 'oklch(0.60 0.02 290)' }}>{i + 1}효</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                해석
              </h3>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ background: 'oklch(0.55 0.25 290 / 20%)', color: 'oklch(0.78 0.15 85)' }}
                    >
                      {i + 1}효
                    </span>
                    <div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: 'oklch(0.94 0.015 90)' }}>{r.meaning}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.65 0.02 290)' }}>{r.advice}</p>
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
