/* AI 루나 — YukPage
 * Design: Mystic Dark Luxury
 * 시간 기반 정확한 육효 생성 알고리즘
 */
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface YukResult {
  line: number;
  yinYang: '양' | '음';
  changing: boolean;
  meaning: string;
  advice: string;
}

interface HexagramInfo {
  name: string;
  meaning: string;
  interpretation: string;
}

const hexagrams: Record<string, HexagramInfo> = {
  '111111': { name: '천 (乾)', meaning: '하늘, 창조, 강함', interpretation: '강한 양기가 가득합니다. 주도적으로 행동하세요. 창의력과 리더십을 발휘할 좋은 시기입니다.' },
  '000000': { name: '지 (坤)', meaning: '땅, 포용, 부드러움', interpretation: '음기가 강합니다. 포용력을 발휘하고 신중하게 행동하세요. 기초를 다지는 시기입니다.' },
  '111000': { name: '수산 (水山)', meaning: '물과 산, 흐름과 정지', interpretation: '변화의 흐름을 읽으세요. 외부 환경에 적응하되 내면의 안정성을 유지하세요.' },
  '000111': { name: '산수 (山水)', meaning: '산과 물, 정지와 흐름', interpretation: '신중함과 유연함의 균형을 맞추세요. 현재 상황을 분석한 후 행동하세요.' },
  '101010': { name: '수 (坎)', meaning: '물, 위험, 흐름', interpretation: '어려움이 있을 수 있습니다. 하지만 물처럼 유연하게 흐르면 극복할 수 있습니다.' },
  '010101': { name: '화 (離)', meaning: '불, 밝음, 열정', interpretation: '밝은 기운이 흐릅니다. 열정을 유지하되 신중함을 잃지 마세요.' },
  '110011': { name: '뇌풍 (雷風)', meaning: '천둥과 바람, 움직임', interpretation: '변화와 움직임의 시기입니다. 새로운 시작에 좋은 시기입니다.' },
  '001100': { name: '풍뇌 (風雷)', meaning: '바람과 천둥, 자극', interpretation: '외부 자극이 있을 것입니다. 이를 기회로 삼으세요.' },
};

export default function YukPage() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<YukResult[]>([]);
  const [hexagramKey, setHexagramKey] = useState('');
  const [hexagramInfo, setHexagramInfo] = useState<HexagramInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 시간 기반 육효 생성 알고리즘
  const generateYukByTime = (): YukResult[] => {
    const now = new Date();
    const timestamp = now.getTime();
    const seed = timestamp % 64; // 0-63 범위의 시드값

    const lines: YukResult[] = [];
    let key = '';

    for (let i = 0; i < 6; i++) {
      const lineValue = (seed >> i) & 1;
      const yinYang = lineValue === 1 ? '양' : '음';
      const changing = Math.random() > 0.7; // 30% 확률로 변효

      lines.push({
        line: i + 1,
        yinYang,
        changing,
        meaning: yinYang === '양' ? '강한 기운' : '부드러운 기운',
        advice: yinYang === '양' ? '적극적으로 행동하세요.' : '신중하게 판단하세요.',
      });

      key += lineValue;
    }

    // 역순으로 정렬 (전통 육효는 아래에서 위로 읽음)
    lines.reverse();
    key = key.split('').reverse().join('');

    setHexagramKey(key);
    setHexagramInfo(hexagrams[key] || {
      name: '변화의 흐름',
      meaning: '독특한 조합',
      interpretation: '이 조합은 특별한 의미를 담고 있습니다. 현재 상황을 깊이 있게 성찰해보세요.',
    });

    return lines;
  };

  const handleDrawYuk = () => {
    if (!question.trim()) {
      alert('질문을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const drawn = generateYukByTime();
      setResults(drawn);
      setIsLoading(false);
    }, 1200);
  };

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  const yinYangSymbol = (yinYang: '양' | '음', changing: boolean) => {
    if (yinYang === '양') {
      return changing ? '━ ━ ━' : '━━━━━';
    } else {
      return changing ? '━ ━ ━' : '━ ━';
    }
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
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> 육효 생성 중...</> : '🎲 육효 뽑기'}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            {/* 육효 시각화 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase text-center" style={{ color: 'oklch(0.78 0.15 85)' }}>
                육효 결과
              </h3>
              <div className="space-y-2 font-mono text-center" style={{ color: 'oklch(0.94 0.015 90)', fontSize: '20px', letterSpacing: '4px' }}>
                {results.map((result, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-4">
                    <span style={{ color: 'oklch(0.78 0.15 85)', fontSize: '12px' }}>제{result.line}효</span>
                    <span style={{ color: result.yinYang === '양' ? 'oklch(0.78 0.15 85)' : 'oklch(0.70 0.20 290)' }}>
                      {yinYangSymbol(result.yinYang, result.changing)}
                    </span>
                    <span style={{ fontSize: '12px', color: 'oklch(0.60 0.02 290)' }}>
                      {result.yinYang} {result.changing ? '(변효)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 육괘 정보 */}
            {hexagramInfo && (
              <div className="p-5" style={cardStyle}>
                <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                  {hexagramInfo.name}
                </h3>
                <div className="space-y-2 text-sm" style={{ color: 'oklch(0.85 0.015 90)' }}>
                  <p><strong>의미:</strong> {hexagramInfo.meaning}</p>
                  <p><strong>해석:</strong> {hexagramInfo.interpretation}</p>
                </div>
              </div>
            )}

            {/* 각 효의 해석 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                효별 분석
              </h3>
              <div className="space-y-2">
                {results.map((result, idx) => (
                  <div key={idx} className="p-3 rounded-lg" style={{ background: 'oklch(0.20 0.05 270)', border: '1px solid oklch(1 0 0 / 10%)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
                      제{result.line}효 - {result.yinYang}효 {result.changing ? '(변효)' : ''}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.85 0.015 90)' }}>
                      {result.meaning}: {result.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 종합 해석 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                종합 해석
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.015 90)' }}>
                당신의 질문 "{question}"에 대해 육효가 말하는 바는 현재 상황이 {results.filter(r => r.yinYang === '양').length > 3 ? '양기가 강하며 적극적인 행동이 필요한 시기' : '음기가 강하며 신중한 판단이 필요한 시기'}입니다.
                {results.some(r => r.changing) && ' 변효가 나타났으므로 상황이 변할 가능성이 있습니다.'}
                깊이 있는 성찰과 함께 현명한 결정을 내리세요.
              </p>
            </div>

            {/* AI 상담 버튼 */}
            <button
              onClick={() => {
                sessionStorage.setItem('yukResult', JSON.stringify({ question, results, hexagramInfo }));
                window.location.href = '/chat';
              }}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                color: 'oklch(0.97 0.005 90)',
                boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
                fontFamily: "'Noto Serif KR', serif",
              }}
            >
              🤖 AI 루나와 상담하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
