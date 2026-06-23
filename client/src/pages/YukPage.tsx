import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface YukResult {
  line: number;
  symbol: string;
  meaning: string;
}

export default function YukPage() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<YukResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const yukSymbols = [
    { symbol: '☰', meaning: '건(乾) - 하늘, 창조, 강함' },
    { symbol: '☱', meaning: '태(兌) - 호수, 기쁨, 변화' },
    { symbol: '☲', meaning: '리(離) - 불, 밝음, 성장' },
    { symbol: '☳', meaning: '진(震) - 천둥, 움직임, 시작' },
    { symbol: '☴', meaning: '손(巽) - 바람, 침투, 유연함' },
    { symbol: '☵', meaning: '감(坎) - 물, 위험, 흐름' },
  ];

  const handleDrawYuk = () => {
    if (!question.trim()) {
      alert('질문을 입력해주세요');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const randomResults: YukResult[] = Array.from({ length: 6 }, (_, i) => ({
        line: i + 1,
        symbol: yukSymbols[Math.floor(Math.random() * yukSymbols.length)].symbol,
        meaning: yukSymbols[Math.floor(Math.random() * yukSymbols.length)].meaning,
      }));
      setResults(randomResults);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">☯️ 육효 점술</h1>
        <p className="text-blue-100 mt-2">변화의 흐름을 육효로 분석해보세요</p>
      </div>

      <div className="px-6 py-8">
        {/* Question Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">당신의 질문</h2>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="궁금한 점을 자세히 적어주세요..."
            className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
            rows={4}
          />
          <Button
            onClick={handleDrawYuk}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {isLoading ? '육효를 뽑는 중...' : '육효 뽑기'}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">육효 결과</h2>
            <div className="space-y-4 mb-8">
              {results.map((result) => (
                <div key={result.line} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl">{result.symbol}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{result.line}번째 괘</p>
                      <p className="text-sm text-slate-600">{result.meaning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interpretation */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="font-bold text-slate-900 mb-3">종합 해석</h3>
              <p className="text-slate-700 leading-relaxed mb-3">
                당신의 질문에 대한 육효 결과는 현재 상황이 변화의 시기임을 나타내고 있습니다.
                위에서 나타난 괘들은 당신의 상황과 미래의 방향성을 보여주고 있습니다.
              </p>
              <p className="text-slate-700 leading-relaxed mb-3">
                각 괘의 의미를 종합하면, 긍정적인 변화가 예상되며, 현재의 노력이 좋은 결과로
                이어질 가능성이 높습니다. 계속 진행하되, 신중함을 잃지 마세요.
              </p>
              <p className="text-slate-700 leading-relaxed">
                🌙 AI 루나의 조언: 이 시기에는 인내심과 지혜가 중요합니다. 
                변화를 두려워하지 말고, 긍정적인 마음으로 나아가세요.
              </p>
            </div>
          </div>
        )}

        {/* Symbol Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">육효 기호 설명</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yukSymbols.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <p className="text-3xl mb-2">{item.symbol}</p>
                <p className="text-sm text-slate-700">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
